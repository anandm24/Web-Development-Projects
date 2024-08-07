import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
} from 'reactflow';
import 'reactflow/dist/style.css';
import Sidebar from './Components/Sidebar';
import UpdateNode from './Components/UpdateNode';
import Notification from './Components/Notification';
import newNode from './Components/newNode';
import './index.css';
import Topbar from './Components/Topbar';
import axios from 'axios';

let id = 0;

const App = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [nodeSelected, setNodeSelected] = useState(false);
  const [changeNode, setChangeNode] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [messageColor, setMessageColor] = useState(null);
  const [targetHandles, setTargetHandles] = useState([]);

  useEffect(() => {
    document.title = "React Flow Demo";
  }, []);

  const update = useCallback((event, node) => {
    setChangeNode(node);
    setNodeSelected(true);
  }, []);

  let sourceHandles = [];
  let targetHandle = [];

  const onConnect = useCallback(
    (params) => {
      if (sourceHandles.includes(params.source)) return;
      sourceHandles = sourceHandles.concat(params.source);
      setEdges((eds) => addEdge({ ...params, markerEnd: { type: 'arrowclosed' } }, eds));
      if (targetHandle.includes(params.target)) return;
      targetHandle = targetHandle.concat(params.target);
      setTargetHandles(targetHandle);
    },
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    async (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      try {
        const response = await axios.get('https://official-joke-api.appspot.com/random_joke');
        const joke = `${response.data.setup} - ${response.data.punchline}`;

        const newerNode = {
          id: `node_${id}`,
          type: 'node',
          position,
          data: { heading: 'Message', label: joke },
        };

        id++;
        setNodes((nds) => nds.concat(newerNode));
      } catch (error) {
        console.error('Error fetching the joke:', error);
      }
    },
    [reactFlowInstance, setNodes]
  );

  const nodeTypes = useMemo(
    () => ({
      node: newNode,
    }),
    []
  );

  const saveFlow = () => {
    const totalNodes = reactFlowInstance.getNodes().length;
    if (targetHandles.length !== totalNodes - 1) {
      setErrorMessage('Cannot save Flow');
      setMessageColor('redMessage');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    } else {
      setErrorMessage('Saved Flow');
      setMessageColor('greenMessage');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  return (
    <div className="appflow" style={{ width: '100vw', height: '100vh' }}>
      <Helmet>
        <title>React Flow Demo</title>
      </Helmet>
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <div className="topbar">
            <Notification errorMessage={errorMessage} messageColor={messageColor} />
          </div>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
            proOptions={{ hideAttribution: true }}
            onNodeClick={update}
            nodeTypes={nodeTypes}
          >
            <Controls />
          </ReactFlow>
        </div>
        {nodeSelected ? (
          <div className="rightbar">
            <Topbar saveFlow={saveFlow} />
            <UpdateNode
              selectedNode={changeNode}
              setNodeSelected={setNodeSelected}
              setNodes={setNodes}
            />
          </div>
        ) : (
          <div className="rightbar">
            <Topbar saveFlow={saveFlow} />
            <Sidebar />
          </div>
        )}
      </ReactFlowProvider>
    </div>
  );
};

export default App;
