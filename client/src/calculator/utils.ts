import { splitDate } from "../utils";

export const noNote = (amount: number) => ({ amount, note: "" });

export const isDead = (info: CalculationInfo<Income>, personId: number) => {
  const { dead, deathYears, people, currentYear } = info;
  if (personId === -1 || personId === undefined) return false;
  const person = people[personId];
  const { year } = splitDate(person.birthday);
  const age = currentYear - year;
  return dead == personId && deathYears[personId] && deathYears[personId] < age;
};

export const adjustForInflation = (
  info: CalculationInfo<Income>,
  amount: number,
  startYear: number,
) => {
  if (info.inflationType == "Nominal") return amount;
  return (
    amount /
    Math.pow(1 + (info.inflation || 0) / 100, info.currentYear - startYear)
  );
};
export const adjustForIncrease = (
  info: CalculationInfo<
    | BasicAnnuity
    | EmploymentIncome
    | SocialSecurityIncome
    | CompanyPension
    | OtherIncome
  >,
  amount: number,
  startYear: number,
) => {
  // if (info.inflationType == "Nominal") return amount;
  console.log(info.income.type);
  const income = info.income as any;
  const increase = info.income.yearlyIncrease || {
    type: "custom",
    percent: income.yearlyIncreasePercent || income.cola,
  };
  let inflation = 0;
  if (increase.type == "none") return amount;
  else if (increase.type == "general") inflation = info.inflation || 0;
  else if (increase.type === "custom") inflation = increase.percent || 0;
  return (
    amount * Math.pow(1 + (inflation || 0) / 100, info.currentYear - startYear)
  );
};

export const adjustCompoundInterest = (
  amount: number,
  years: number,
  percent: number | undefined,
) => {
  const per = percent || 0;
  return amount * Math.pow(1 + per / 100, years);
};

export const birthday = (person: Person) => {
  const { year, month } = splitDate(person.birthday);
  return { birthYear: year, birthMonth: month };
};

export const NRA = (birthYear: number): [number, number] => {
  if (birthYear >= 1943 && birthYear <= 1954) return [66, 0];
  if (birthYear === 1955) return [66, 2];
  if (birthYear === 1956) return [66, 4];
  if (birthYear === 1957) return [66, 6];
  if (birthYear === 1958) return [66, 8];
  if (birthYear === 1959) return [66, 10];
  return [67, 0];
};

export const ssPercent = (
  birthday: string,
  retirementYear: number,
  retirementMonth: number,
) => {
  const overage = monthsToFullRetirement(
    birthday,
    retirementYear,
    retirementMonth,
  );
  if (overage < -60) return 0;
  if (overage < -36) return 80 + (5 / 12) * (overage + 36);
  if (overage <= 0) return 100 + (5 / 9) * overage;
  else return Math.min(100 + (8 / 12) * overage, 124);
};

export const monthsToFullRetirement = (
  birthday: string,
  year: number,
  month: number,
) => {
  const { year: birthYear, month: birthMonth } = splitDate(birthday);
  const ageMonths = year * 12 + month - birthMonth;
  const [nraYear, nraMonth] = NRA(birthYear);
  return ageMonths - nraYear * 12 - nraMonth;
};

export const retirementYear = (birthday: string) => {
  const { year: birthYear, month: birthMonth } = splitDate(birthday);
  const [nraYear, nraMonth] = NRA(birthYear);
  let year = birthYear + nraYear;
  if (birthMonth + nraMonth > 12) {
    year++;
  }
  return year;
};
