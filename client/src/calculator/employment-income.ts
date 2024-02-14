export const calculateEmploymentIncome = ({
  people,
  income,
  startYear,
  currentYear,
  deathYears,
  inflation,
}: CalculationInfo<EmploymentIncome>) => {
  const person = people[income.personId];
  const age = currentYear - person.birthYear;
  let baseAmount =
    income.annualIncome *
    Math.pow(
      1 + (income.yearlyIncreasePercent || 0) / 100,
      Math.min(age - income.startAge, currentYear - startYear),
    );

  if (inflation) {
    baseAmount =
      baseAmount / Math.pow(1 + inflation / 100, currentYear - startYear);
  }
  if (income.startAge > age) {
    return 0;
  }

  if (income.startAge === age) {
    return (baseAmount * income.firstYearProratePercent) / 100;
  }

  if (
    deathYears[person.id] &&
    deathYears[person.id] + people[person.id].birthYear <= currentYear
  ) {
    return 0;
  }
  if (age > income.retirementAgeYear) {
    return 0;
  }
  if (income.retirementAgeYear === age) {
    return baseAmount * (income.retirementAgeMonth / 12);
  }
  return baseAmount;
};
