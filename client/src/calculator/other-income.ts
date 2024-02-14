export const calculateOtherIncome = ({
  people,
  income,
  startYear,
  currentYear,
  inflation,
  deathYears,
  dead,
}: CalculationInfo<OtherIncome>) => {
  const person = people[income.personId];
  const age = currentYear - person.birthYear;
  const start = startYear + (income.startYear || 0);
  let yearAmount =
    income.amount *
    (1 + income.yearlyIncreasePercent / 100) ** (currentYear - start);

  if (inflation) {
    yearAmount = yearAmount / (1 + inflation / 100) ** (currentYear - start);
  }

  console.log(currentYear, start);
  if (currentYear < start) {
    return 0;
  }

  if (income.frequency === "monthly") {
    yearAmount = yearAmount * 12;
  } else if (income.frequency === "quarterly") {
    yearAmount = yearAmount * 4;
  } else if (income.frequency === "semi-annually") {
    yearAmount = yearAmount * 2;
  }

  if (
    dead != -1 &&
    dead == income.personId &&
    deathYears[income.personId] < age
  ) {
    return (yearAmount * income.survivorPercent) / 100;
  }
  if (income.startYear + startYear === currentYear) {
    return (yearAmount * income.firstYearProRatePercent) / 100;
  }

  return yearAmount;
};
