import { adjustForInflation, isDead } from "./utils";

export const calculateBasicAnnuity = (info: CalculationInfo<BasicAnnuity>) => {
  const { income, startYear, currentYear } = info;
  const start = startYear + income.yearsOfDeferral;
  let yearAmount =
    income.annualAmount *
    Math.pow(1 + income.yearlyIncreasePercent / 100, currentYear - start);

  if (currentYear < start) {
    return 0;
  }

  yearAmount = adjustForInflation(info, yearAmount, start);

  if (isDead(info, income.personId)) {
    return (yearAmount * income.survivorPercent) / 100;
  }
  if (currentYear == start) {
    return (yearAmount * income.firstYearProRatePercent) / 100;
  }

  return yearAmount;
};
