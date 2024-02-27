import { adjustForInflation, isDead } from "./utils";

export const calculateEmploymentIncome = (
  info: CalculationInfo<EmploymentIncome>,
) => {
  const { people, income, startYear, currentYear } = info;
  const person = people[income.personId];
  const age = currentYear - person.birthYear;

  if (income.startAge > age || isDead(info) || age > income.retirementAgeYear) {
    return 0;
  }

  let baseAmount =
    income.annualIncome *
    Math.pow(
      1 + (income.yearlyIncreasePercent || 0) / 100,
      Math.min(age - income.startAge, currentYear - startYear),
    );

  baseAmount = adjustForInflation(info, baseAmount, startYear);

  if (income.startAge === age) {
    return (baseAmount * income.firstYearProratePercent) / 100;
  }

  if (income.retirementAgeYear === age) {
    return baseAmount * (income.retirementAgeMonth / 12);
  }
  return baseAmount;
};
