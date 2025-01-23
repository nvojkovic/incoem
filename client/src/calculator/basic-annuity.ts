import { moyrToAnnual } from "src/utils";
import { adjustForInflation, adjustForIncrease, isDead } from "./utils";
import { CalculationInfo } from "./types";
import { BasicAnnuity } from "src/types";

export const calculate = (info: CalculationInfo<BasicAnnuity>) => {
  const { income, startYear, currentYear } = info;
  const start = startYear + income.yearsOfDeferral;
  const amount = income.amount
    ? moyrToAnnual(income.amount)
    : income.annualAmount;
  let yearAmount = adjustForIncrease(info, amount, start);

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
