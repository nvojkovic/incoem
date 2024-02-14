export const calculatePaydown = ({
  income,
  startYear,
  currentYear,
  inflation,
}: CalculationInfo<Paydown>) => {
  if (
    income.startYear > currentYear ||
    income.startYear + income.length < currentYear
  ) {
    return 0;
  }
  const interest = income.interestRate / 100;
  let amount =
    // (income.total * Math.pow(1 + interest, income.length) - 1) / interest;
    (income.total * interest) / (1 - Math.pow(1 + interest, -income.length));
  if (income.paymentInYear === "beggining") {
    amount = amount / (1 + interest);
  }
  if (inflation) {
    amount = amount / Math.pow(1 + inflation / 100, currentYear - startYear);
  }

  return amount;
};
