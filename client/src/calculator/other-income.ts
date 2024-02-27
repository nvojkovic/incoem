import { adjustCompoundInterest, isDead } from "./utils";

export const calculateOtherIncome = (info: CalculationInfo<OtherIncome>) => {
  const { income, currentYear } = info;
  // const startYear = currentYear + info.startYear;
  const current = currentYear;

  if (current < income.startYear) {
    return 0;
  }
  if (income.endYear && current > income.endYear) {
    return 0;
  }
  if (isDead(info, income.personId)) {
    return 0;
  }

  let yearAmount =
    income.amount *
    (1 + income.yearlyIncreasePercent / 100) ** (current - income.startYear);

  yearAmount = adjustCompoundInterest(
    yearAmount,
    -(current - (income.startYear || info.startYear)),
    info.inflation,
  );

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
  if (current == income.startYear) {
    return (yearAmount * income.firstYearProRatePercent) / 100;
  }

  return yearAmount;
};
