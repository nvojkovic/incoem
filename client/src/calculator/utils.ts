export const isDead = (info: CalculationInfo<Income>) => {
  const { dead, deathYears, people, income, currentYear } = info;
  const person = people[income.personId];
  const age = currentYear - person.birthYear;
  return (
    dead != -1 &&
    dead == income.personId &&
    deathYears[income.personId] &&
    deathYears[income.personId] < age
  );
};

export const adjustForInflation = (
  info: CalculationInfo<Income>,
  amount: number,
  startYear: number,
) => {
  return (
    amount /
    Math.pow(1 + (info.inflation || 0) / 100, info.currentYear - startYear)
  );
};

export const NRA = (birthYear: number): [number, number] => {
  if (birthYear <= 1937) return [65, 0];
  if (birthYear === 1938) return [65, 2];
  if (birthYear === 1939) return [65, 4];
  if (birthYear === 1940) return [65, 6];
  if (birthYear === 1941) return [65, 8];
  if (birthYear === 1942) return [65, 10];
  if (birthYear >= 1943 && birthYear <= 1954) return [66, 0];
  if (birthYear === 1955) return [66, 2];
  if (birthYear === 1956) return [66, 4];
  if (birthYear === 1957) return [66, 6];
  if (birthYear === 1958) return [66, 8];
  if (birthYear === 1959) return [66, 10];
  return [67, 0];
};

export const ssPercent = (
  birthYear: number,
  birthMonth: number,
  retirementYear: number,
  retirementMonth: number,
) => {
  const [nraYear, nraMonth] = NRA(birthYear);
  const ageMonths =
    (retirementYear - birthYear) * 12 + retirementMonth - birthMonth;
  const overage = ageMonths - nraYear * 12 - nraMonth;
  if (overage < -60) return NaN;
  if (overage < -36) return 80 + (5 / 12) * (overage + 36);

  console.log(overage, ageMonths);
  if (overage <= 0) return 100 + (5 / 9) * overage;
  else return Math.min(100 + (8 / 12) * overage, 124);
};

console.log(ssPercent(1960, 6, 2030, 8));
