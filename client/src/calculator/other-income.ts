import { adjustForInflation, isDead } from "./utils";

export const calculate = (info: CalculationInfo<OtherIncome>) => {
  const { income, currentYear } = info;
  const current = currentYear;
  const startYear = income.startYear || info.startYear;

  if (current < startYear) {
    return 0;
  }
  if (income.endYear && current > income.endYear) {
    return 0;
  }

  let yearAmount =
    income.amount *
    (1 + income.yearlyIncreasePercent / 100) ** (current - startYear);

  yearAmount = adjustForInflation(info, yearAmount, info.startYear);

  if (income.frequency === "monthly") {
    yearAmount = yearAmount * 12;
  } else if (income.frequency === "quarterly") {
    yearAmount = yearAmount * 4;
  } else if (income.frequency === "semi-annually") {
    yearAmount = yearAmount * 2;
  }

  if (isDead(info, income.personId)) {
    return (yearAmount * income.survivorPercent) / 100;
  }

  if (current == startYear) {
    return (yearAmount * income.firstYearProRatePercent) / 100;
  }

  return yearAmount;
};

export const calculateOtherIncome = (info: CalculationInfo<OtherIncome>) => {
  return { amount: calculate(info), note: "" };
};
