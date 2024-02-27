import { splitDate } from "../utils";
import { calculateEmploymentIncome } from "./employment-income";
import {
  adjustCompoundInterest,
  birthday,
  isDead,
  retirementYear,
  ssPercent,
} from "./utils";

export const calculateSocialSecurity = (
  info: CalculationInfo<SocialSecurityIncome>,
) => {
  const { income, people, currentYear, incomes } = info;
  const person = people[income.personId];
  const { birthYear } = birthday(person);
  const age = currentYear - birthYear;
  let ownAmount = 0;

  if (isDead(info, income.personId)) return 0;

  //find spousal
  const spouse = incomes.find(
    (i) => i.type === "social-security" && i.personId === 1 - income.personId,
  ) as SocialSecurityIncome;
  if (spouse && isDead(info, spouse.personId)) {
    let survivorAge = info.ssSurvivorAge[income.personId];
    if (survivorAge != null && birthYear + survivorAge <= currentYear) {
      // actually taking survivor benefit
      if (survivorAge >= 60) {
        const newInfo = {
          ...info,
          income: spouse,
        };
        ownAmount = Math.max(
          ownAmount,
          calculateSurvivorSocialSecurity(newInfo as any),
        );
      }
    }
  }
  if (!income.alreadyReceiving && income.startAgeYear > age)
    return reduceByIncome(info, ownAmount);

  // if retired
  ownAmount = Math.max(calculateOwnSocialSecurity(info), ownAmount);

  if (spouse) {
    // calculate spouse SS todo
    const spouseId = spouse.personId;
    const { birthYear: spouseBirthYear } = birthday(people[spouseId]);
    if (
      !isDead(info, spouseId) &&
      spouse.startAgeYear <= currentYear - spouseBirthYear
    ) {
      const newInfo = {
        ...info,
        income: spouse,
      } as CalculationInfo<SocialSecurityIncome>;
      const a = calculateOwnSocialSecurity(newInfo);
      let spousal = a / 2;
      ownAmount = Math.max(ownAmount, spousal);
    }
  }

  return reduceByIncome(info, ownAmount);
};

export const calculateOwnSocialSecurity = (
  info: CalculationInfo<SocialSecurityIncome>,
) => {
  const { income, people, currentYear } = info;
  const person = people[income.personId];
  const { year: birthYear } = splitDate(person.birthday);
  const age = currentYear - birthYear;
  let ownAmount = 0;
  if (income.calculationMethod == "automatic") {
    if (income.alreadyReceiving) {
      ownAmount = income.annualAmount;
    } else if (income.startAgeYear == age) {
      ownAmount = (income.annualAmount * (12 - income.startAgeMonth + 1)) / 12;
    } else if (income.startAgeYear < age) {
      ownAmount = income.annualAmount;
    }
  } else {
    ownAmount =
      (income.pia *
        12 *
        ssPercent(person.birthday, income.startAgeYear, income.startAgeMonth)) /
      100;
    // ownAmount = ssPercent(
    //   person.birthday,
    //   income.startAgeYear,
    //   income.startAgeMonth,
    // );
  }
  if (!income.alreadyReceiving && income.startAgeYear > age) return 0;

  // calculate reduction
  const years =
    info.currentYear -
    (income.alreadyReceiving
      ? info.startYear
      : income.startAgeYear + birthYear);

  ownAmount = adjustCompoundInterest(ownAmount, years, income.cola);
  ownAmount = adjustCompoundInterest(ownAmount, years, -(info.inflation || 0));
  return ownAmount;
};

export const calculateSurvivorSocialSecurity = (
  info: CalculationInfo<SocialSecurityIncome>,
) => {
  const { income, people, currentYear, startYear, deathYears } = info;
  const person = people[income.personId];
  const { year: birthYear } = splitDate(person.birthday);
  let deathYear = deathYears[income.personId];
  let ownAmount = 0;
  if (deathYear - birthYear < income.startAgeYear) {
    const newInfo = {
      ...info,
      currentYear: retirementYear(person.birthday),
    };
    ownAmount = calculateOwnSocialSecurity(newInfo);
  } else {
    const newInfo = {
      ...info,
      currentYear: deathYear + birthYear,
    };
    ownAmount = calculateOwnSocialSecurity(newInfo);
  }

  const years =
    currentYear -
    (income.alreadyReceiving ? startYear : income.startAgeYear + birthYear);
  ownAmount = adjustCompoundInterest(ownAmount, years, income.cola);
  ownAmount = adjustCompoundInterest(ownAmount, years, -(info.inflation || 0));
  return ownAmount;
};

const reduceByIncome = (
  info: CalculationInfo<SocialSecurityIncome>,
  ownAmount: number,
) => {
  const { incomes, income, currentYear } = info;
  const person = info.people[income.personId];
  const employment = incomes.find(
    (i) => i.type === "employment-income" && i.personId === income.personId,
  ) as EmploymentIncome | undefined;

  if (employment) {
    const newInfo: CalculationInfo<EmploymentIncome> = {
      ...info,
      income: employment,
    };

    const a = calculateEmploymentIncome(newInfo);
    let r = retirementYear(person.birthday);
    if (currentYear < r && a > 22320) {
      ownAmount = Math.max(ownAmount - (a - 22320) / 2, 0);
    }
    if (currentYear == r && a > 59520) {
      ownAmount = Math.max(ownAmount - (a - 59520) / 3, 0);
    }
  }
  return ownAmount;
};
