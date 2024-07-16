// Fetching all the needed DOM elements
const yearlySalary = document.getElementById("yearly-salary");
const taxableIncome = document.getElementById("taxable-income");
const incomeTax = document.getElementById("income-tax");
const yearlyNetIncome = document.getElementById("yearly-net-income");
const monthlySalary = document.getElementById("monthly-salary");
const professionTax = document.getElementById("profession-tax");
const cessTax = document.getElementById("cess-tax");
const totalDeductions = document.getElementById("total-deductions");
const investments = document.getElementById("investments");
const age = {
  adult: document.getElementById("adult"),
  senior: document.getElementById("senior"),
  ultraSenior: document.getElementById("ultraSenior")
};

// Adding event listeners for all the inputs
yearlySalary.addEventListener("change", calculateSalary);
investments.addEventListener("change", calculateSalary);
age.adult.addEventListener("click", calculateSalary);
age.senior.addEventListener("click", calculateSalary);
age.ultraSenior.addEventListener("click", calculateSalary);

// Function called from all the event listeners and does all the business logic
function calculateSalary(event) {
  let lessTaxableIncomeValue,
    midTaxableIncomeValue,
    highTaxableIncomeValue,
    totalTaxableIncomeValue,
    incomeTaxValue,
    yearlyNetIncomeValue,
    monthlySalaryValue,
    professionTaxValue,
    cessTaxValue,
    totalDeductionsValue,
    yearlySalaryValue,
    investmentsValue = 0,
    taxFreeIncome = 250000;

  // Setting taxFreeIncome based on age group selected
  if (age.adult.checked) {
    taxFreeIncome = 250000;
  } else if (age.senior.checked) {
    taxFreeIncome = 300000;
  } else if (age.ultraSenior.checked) {
    taxFreeIncome = 500000;
  }

  if (event.target.name == "age") {
    yearlySalaryValue = yearlySalary.value;
    investmentsValue = investments.value ? parseInt(investments.value) : 0;
  }

  if (event.target.name == "investments") {
    if (event.target.value >= 150000) {
      investments.value = 150000;
      investmentsValue = 150000;
    } else if (event.target.value < 0) {
      investments.value = null;
      investmentsValue = 0;
    } else if (event.target.value == 0) {
      investmentsValue = 0;
    } else {
      investmentsValue = parseInt(event.target.value);
    }
    yearlySalaryValue = yearlySalary.value;
  }

  if (event.target.name == "grossIncome") {
    yearlySalaryValue = event.target.value;
    investmentsValue = investments.value ? parseInt(investments.value) : 0;
  }

  if (yearlySalaryValue > 1000000000) {
    alert(
      "We currently only support tax calculations for incomes upto ₹ 1 Billion!"
    );
    return 0;
  }

  // set profession tax based on income
  if (yearlySalaryValue > 120000) {
    professionTaxValue = 2500;
  } else if (yearlySalaryValue > 90000) {
    professionTaxValue = 2100;
  } else {
    professionTaxValue = 0;
  }

  if (yearlySalaryValue <= 0) {
    yearlySalary.value = null;
    yearlySalaryValue = 0;
    investments.value = null;
    investmentsValue = 0;
  } else if (yearlySalaryValue > 0 && yearlySalaryValue <= taxFreeIncome) {
    totalTaxableIncomeValue = 0;
    incomeTaxValue = 0;
    cessTaxValue = 0;
    yearlyNetIncomeValue = yearlySalaryValue - professionTaxValue;
    monthlySalaryValue = Math.floor(yearlyNetIncomeValue / 12);
  } else if (yearlySalaryValue > taxFreeIncome && yearlySalaryValue <= 500000) {
    yearlySalaryValue -= investmentsValue;
    totalTaxableIncomeValue =
      yearlySalaryValue - taxFreeIncome > 0
        ? yearlySalaryValue - taxFreeIncome
        : 0;
    incomeTaxValue = Math.floor(totalTaxableIncomeValue * 0.05);
    cessTaxValue = Math.floor(incomeTaxValue * 0.04);
    yearlyNetIncomeValue = Math.floor(
      taxFreeIncome +
        investmentsValue +
        totalTaxableIncomeValue * 0.95 -
        professionTaxValue -
        cessTaxValue
    );
    monthlySalaryValue = Math.floor(yearlyNetIncomeValue / 12);
  } else if (yearlySalaryValue > 500000 && yearlySalaryValue <= 1000000) {
    yearlySalaryValue -= investmentsValue;
    lessTaxableIncomeValue =
      yearlySalaryValue > 500000
        ? 500000 - taxFreeIncome
        : yearlySalaryValue - taxFreeIncome;
    midTaxableIncomeValue =
      yearlySalaryValue - 500000 > 0 ? yearlySalaryValue - 500000 : 0;
    totalTaxableIncomeValue = lessTaxableIncomeValue + midTaxableIncomeValue;
    incomeTaxValue = Math.floor(
      lessTaxableIncomeValue * 0.05 + midTaxableIncomeValue * 0.2
    );
    cessTaxValue = Math.floor(incomeTaxValue * 0.04);
    yearlyNetIncomeValue = Math.floor(
      taxFreeIncome +
        investmentsValue +
        lessTaxableIncomeValue * 0.95 +
        midTaxableIncomeValue * 0.8 -
        professionTaxValue -
        cessTaxValue
    );
    monthlySalaryValue = Math.floor(yearlyNetIncomeValue / 12);
  } else {
    yearlySalaryValue -= investmentsValue; // 1500000
    lessTaxableIncomeValue = 500000 - taxFreeIncome; // 500000
    midTaxableIncomeValue =
      yearlySalaryValue > 1000000 ? 500000 : yearlySalaryValue - 500000;
    highTaxableIncomeValue =
      yearlySalaryValue > 1000000 ? yearlySalaryValue - 1000000 : 0;
    totalTaxableIncomeValue =
      lessTaxableIncomeValue + midTaxableIncomeValue + highTaxableIncomeValue;
    incomeTaxValue = Math.floor(
      lessTaxableIncomeValue * 0.05 +
        midTaxableIncomeValue * 0.2 +
        highTaxableIncomeValue * 0.3
    );
    cessTaxValue = Math.floor(incomeTaxValue * 0.04);
    yearlyNetIncomeValue = Math.floor(
      taxFreeIncome +
        investmentsValue +
        lessTaxableIncomeValue * 0.95 +
        midTaxableIncomeValue * 0.8 +
        highTaxableIncomeValue * 0.7 -
        professionTaxValue -
        cessTaxValue
    );
    monthlySalaryValue = Math.floor(yearlyNetIncomeValue / 12);
  }

  totalDeductionsValue = incomeTaxValue + professionTaxValue + cessTaxValue;

  if (yearlySalaryValue === 0) {
    taxableIncome.innerText = "--";
    incomeTax.innerText = "--";
    yearlyNetIncome.innerText = "--";
    monthlySalary.innerText = "--";
    professionTax.innerText = "--";
    cessTax.innerText = "--";
    totalDeductions.innerText = "--";
  } else {
    taxableIncome.innerText = "₹ " + totalTaxableIncomeValue;
    incomeTax.innerText = "- ₹ " + incomeTaxValue;
    yearlyNetIncome.innerText = "₹ " + yearlyNetIncomeValue;
    monthlySalary.innerText = "₹ " + monthlySalaryValue;
    professionTax.innerText = "- ₹ " + professionTaxValue;
    cessTax.innerText = "- ₹ " + cessTaxValue;
    totalDeductions.innerText = "- ₹ " + totalDeductionsValue;
  }
}
