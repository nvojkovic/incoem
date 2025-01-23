import { CompanyPension } from "src/types";
import { moyrToAnnual, splitDate } from "../utils";
import { adjustForIncrease, adjustForInflation, isDead } from "./utils";
import { CalculationInfo } from "./types";

export const calculate = (info: CalculationInfo<CompanyPension>) => {
  const { people, income, startYear, currentYear } = info;
  const person = people[income.personId];
  const { year: birthYear } = splitDate(person.birthday);
  const age = currentYear - birthYear;
  const start = income.startAge ? income.startAge + birthYear : startYear;
  // let yearAmount =
  //   income.annualAmount *
  //   Math.pow(
  //     1 + (income.yearlyIncreasePercent || 0) / 100,
  //     currentYear - start,
  //   );
  const annualIncome = income.amount
    ? moyrToAnnual(income.amount)
    : income.annualAmount;

  let yearAmount = adjustForIncrease(info, annualIncome, start);

  yearAmount = adjustForInflation(info, yearAmount, start);

  if (income.startAge && income.startAge > age) {
    return 0;
  }

  if (isDead(info, income.personId)) {
    return (yearAmount * income.survivorPercent) / 100;
  }
  if (income.startAge === age) {
    return (yearAmount * income.firstYearProRatePercent) / 100;
  }

  return yearAmount;
};

export const calculateCompanyPension = (
  info: CalculationInfo<CompanyPension>,
) => {
  return { amount: calculate(info), note: "" };
};
