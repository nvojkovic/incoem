export const calculateBasicAnnuity = ({
  people,
  income,
  startYear,
  currentYear,
  deathYears,
  dead,
  inflation,
}: CalculationInfo<BasicAnnuity>) => {
  const start = startYear + income.yearsOfDeferral;
  let yearAmount =
    income.annualAmount *
    Math.pow(1 + income.yearlyIncreasePercent / 100, currentYear - start);

  if (inflation) {
    yearAmount =
      yearAmount / Math.pow(1 + inflation / 100, currentYear - start);
  }

  if (currentYear < start) {
    return 0;
  }

  if (income.personId != -1) {
    const person = people[income.personId];
    const age = currentYear - person.birthYear;
    if (dead == income.personId && deathYears[income.personId] < age) {
      return (yearAmount * income.survivorPercent) / 100;
    }
  }
  if (currentYear == start) {
    return (yearAmount * income.firstYearProRatePercent) / 100;
  }

  return yearAmount;
};
