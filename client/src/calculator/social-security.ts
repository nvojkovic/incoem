import { adjustForInflation, ssPercent } from "./utils";

export const calculateSocialSecurity = (
  info: CalculationInfo<SocialSecurityIncome>,
) => {
  const { income, startYear } = info;

  // calculate spouse SS todo
  // calculate survivor SS todo

  let person = info.people[income.personId];
  let amount =
    (income.pia *
      12 *
      ssPercent(
        person.birthYear,
        person.birthMonth,
        income.startAgeYear,
        income.startAgeMonth,
      )) /
    100;

  //select max of all three

  amount = adjustForInflation(info, amount, startYear);

  return amount;
};
