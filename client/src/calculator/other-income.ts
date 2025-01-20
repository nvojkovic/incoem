import { MonthlyYearlyAmount, OtherIncome } from "src/types";
import { CalculationInfo } from "./types";
import { adjustForIncrease, adjustForInflation, isDead } from "./utils";
export const migrateOtherIncome = (
  income: OtherIncome,
): MonthlyYearlyAmount => {
  if (income.newAmount) return income.newAmount;
  if (income.amount && income.frequency) {
    if (income.frequency === "monthly") {
      return { value: income.amount, type: "monthly" };
    } else if (income.frequency === "quarterly") {
      return { value: income.amount * 4, type: "yearly" };
    } else if (income.frequency === "semi-annually") {
      return { value: income.amount * 2, type: "yearly" };
    } else if (income.frequency === "annually") {
      return { value: income.amount, type: "yearly" };
    }
  }
  return { value: null as any, type: "yearly" };
};

export const calculate = (info: CalculationInfo<OtherIncome>) => {
  const { income, currentYear } = info;
  const newAmount = migrateOtherIncome(income);
  const current = currentYear;
  const startYear = income.startYear || info.startYear;

  if (current < startYear) {
    return 0;
  }
  if (income.endYear && current > income.endYear) {
    return 0;
  }

  // let yearAmount =
  //   income.amount *
  //   (1 + income.yearlyIncreasePercent / 100) ** (current - startYear);
  //
  let yearAmount = adjustForIncrease(info, newAmount.value, startYear);

  yearAmount = adjustForInflation(info, yearAmount, info.startYear);

  if (newAmount?.type === "monthly") {
    yearAmount = yearAmount * 12;
  } else {
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
