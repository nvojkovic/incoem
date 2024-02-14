export const calculateCompanyPension = ({
  people,
  income,
  startYear,
  currentYear,
  deathYears,
  dead,
  inflation,
}: CalculationInfo<CompanyPension>) => {
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

  if (inflation) {
    yearAmount =
      yearAmount / Math.pow(1 + inflation / 100, currentYear - start);
  }

  if (income.startAge && income.startAge > age) {
    return 0;
  }

  if (
    dead != -1 &&
    dead == income.personId &&
    deathYears[income.personId] < age
  ) {
    return (yearAmount * income.survivorPercent) / 100;
  }
  if (income.startAge === age) {
    return (yearAmount * income.firstYearProRatePercent) / 100;
  }

  return yearAmount;
};
