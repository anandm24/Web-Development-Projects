import { Handle, Position } from 'reactflow'

// Custom node with dynamic sizing, without WhatsApp icon, and wider top bar
const Node = ({ data }) => {
  return (
    <div
      style={{
        backgroundColor: 'white',
        border: '1px solid #b2f0e3',
        borderRadius: 5,
        width: 'auto',
        maxWidth: 275,
        minWidth: 150,
      }}
    >
      <div
        style={{
          backgroundColor: '#b2f0e3',
          borderTopLeftRadius: 5,
          borderTopRightRadius: 5,
          fontWeight: 'bold',
          color: 'black',
          padding: '3px 15px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 13, paddingRight: 7, paddingTop: 5 }}
          >
            chat
          </span>
          {data.heading}
        </div>
      </div>
      <div
        style={{
          padding: 15,
          borderBottomLeftRadius: 5,
          borderBottomRightRadius: 5,
          backgroundColor: 'white',
        }}
      >
        <div style={{ color: 'black' }}>
          {data.label}
        </div>
      </div>
      <Handle type="source" position={Position.Right} id="source" />
      <Handle type="target" position={Position.Left} id="target" />
    </div>
  )
}

export default Node
