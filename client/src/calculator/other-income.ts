import { adjustForInflation, isDead } from "./utils";

export const calculateOtherIncome = (info: CalculationInfo<OtherIncome>) => {
  const { income, startYear, currentYear } = info;

  const start = startYear + (income.startYear || 0);
  if (currentYear < start) {
    return 0;
  }

  let yearAmount =
    income.amount *
    (1 + income.yearlyIncreasePercent / 100) ** (currentYear - start);

  yearAmount = adjustForInflation(info, yearAmount, start);

  if (income.frequency === "monthly") {
    yearAmount = yearAmount * 12;
  } else if (income.frequency === "quarterly") {
    yearAmount = yearAmount * 4;
  } else if (income.frequency === "semi-annually") {
    yearAmount = yearAmount * 2;
  }

  if (isDead(info)) {
    return (yearAmount * income.survivorPercent) / 100;
  }
  if (income.startYear + startYear === currentYear) {
    return (yearAmount * income.firstYearProRatePercent) / 100;
  }

  return yearAmount;
};
