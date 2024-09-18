import { adjustForInflation, isDead } from "./utils";

export const calculate = (info: CalculationInfo<Paydown>) => {
  const { income, startYear, currentYear } = {
    ...info,
    income: { ...info.income },
  };
  income.startYear = income.startYear || currentYear;
  if (info.income.personId !== -1 && isDead(info, info.income.personId))
    return 0;
  if (
    income.startYear > currentYear ||
    income.startYear + income.length <= currentYear
  ) {
    return 0;
  }
  const interest = income.interestRate / 100;
  let amount =
    (income.total * interest) / (1 - Math.pow(1 + interest, -income.length));
  console.log("aaaa", income.paymentInYear);

  if (income.paymentInYear === "beginning") {
    amount = amount / (1 + interest);
  }

  amount = adjustForInflation(info, amount, startYear);

  return amount;
};

export const calculatePaydown = (info: CalculationInfo<Paydown>) => {
  return { amount: calculate(info), note: "" };
};
