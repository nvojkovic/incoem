import { EmploymentIncome } from "src/types";
import { moyrToAnnual, splitDate } from "../utils";
import { CalculationInfo } from "./types";
import { adjustForIncrease, adjustForInflation, isDead } from "./utils";

const calculate = (info: CalculationInfo<EmploymentIncome>) => {
  const { people, income, startYear, currentYear } = {
    ...info,
    income: { ...info.income },
  };
  const person = people[income.personId];
  const { year: birthYear } = splitDate(person.birthday);
  const age = currentYear - birthYear;
  income.retirementAgeYear = income.retirementAgeYear || 3000;

  if (
    income.startAge > age ||
    isDead(info, income.personId) ||
    (age > income.retirementAgeYear && income.retirementAgeYear != 0)
  ) {
    return 0;
  }

  // let baseAmount =
  //   income.annualIncome *
  //   Math.pow(
  //     1 + (income.yearlyIncreasePercent || 0) / 100,
  //     Math.min(age - income.startAge, currentYear - startYear),
  //   );
  //
  const annualIncome = income.income
    ? moyrToAnnual(income.income)
    : income.annualIncome;

  let baseAmount = adjustForIncrease(
    info,
    annualIncome,
    Math.max(birthYear + income.startAge, startYear),
  );

  baseAmount = adjustForInflation(
    info,
    baseAmount,
    Math.max(birthYear + income.startAge, startYear),
  );

  if (income.startAge === age) {
    console.log("wtf", income.startAge, age);
    return (baseAmount * income.firstYearProratePercent) / 100;
  }

  if (income.retirementAgeYear == age) {
    return baseAmount * (income.retirementAgeMonth / 12);
  }
  birthYear + income.startAge;
  return baseAmount;
};

export const calculateEmploymentIncome = (
  info: CalculationInfo<EmploymentIncome>,
) => {
  return { amount: calculate(info), note: "" };
};
