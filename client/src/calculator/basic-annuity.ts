import { adjustForInflation, adjustForIncrease, isDead } from "./utils";

export const calculate = (info: CalculationInfo<BasicAnnuity>) => {
  const { income, startYear, currentYear } = info;
  const start = startYear + income.yearsOfDeferral;
  let yearAmount = adjustForIncrease(info, income.annualAmount, start);

  if (currentYear < start) {
    return 0;
  }

  yearAmount = adjustForInflation(info, yearAmount, startYear);

  if (isDead(info, income.personId)) {
    return (yearAmount * income.survivorPercent) / 100;
  }
  if (currentYear == start) {
    return (yearAmount * income.firstYearProRatePercent) / 100;
  }

  return yearAmount;
};

export const calculateBasicAnnuity = (info: CalculationInfo<BasicAnnuity>) => {
  return { amount: calculate(info), note: "" };
};
