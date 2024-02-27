import { adjustForInflation } from "./utils";

export const calculatePaydown = (info: CalculationInfo<Paydown>) => {
  const { income, startYear, currentYear } = info;
  if (
    income.startYear > currentYear ||
    income.startYear + income.length < currentYear
  ) {
    return 0;
  }
  const interest = income.interestRate / 100;
  let amount =
    (income.total * interest) / (1 - Math.pow(1 + interest, -income.length));

  if (income.paymentInYear === "beggining") {
    amount = amount / (1 + interest);
  }

  amount = adjustForInflation(info, amount, startYear);

  return amount;
};
