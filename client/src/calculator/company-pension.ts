import { adjustForInflation, isDead } from "./utils";

export const calculateCompanyPension = (
  info: CalculationInfo<CompanyPension>,
) => {
  const { people, income, startYear, currentYear } = info;
  const person = people[income.personId];
  const age = currentYear - person.birthYear;
  const start = income.startAge
    ? income.startAge + person.birthYear
    : startYear;
  let yearAmount =
    income.annualAmount *
    Math.pow(
      1 + (income.yearlyIncreasePercent || 0) / 100,
      currentYear - start,
    );

  yearAmount = adjustForInflation(info, yearAmount, start);

  if (income.startAge && income.startAge > age) {
    return 0;
  }

  if (isDead(info)) {
    return (yearAmount * income.survivorPercent) / 100;
  }
  if (income.startAge === age) {
    return (yearAmount * income.firstYearProRatePercent) / 100;
  }

  return yearAmount;
};
