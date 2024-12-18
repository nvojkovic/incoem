import { convertToMoYr, moyrToAnnual } from "../../utils";
import { calculateAge } from "../Info/PersonInfo";

export const calculateSpendingYear = (
  data: IncomeMapData,
  spending: RetirementSpendingSettings | undefined,
  settings: ScenarioSettings,
  year: number,
) => {
  if (!spending) return 0;
  const years = year - 2024;

  const inflationRate = (inflation: YearlyIncrease) => {
    if (!inflation || inflation.type == "none") return 0;
    else if (inflation.type == "custom") return (inflation.percent || 0) / 100;
    else if (inflation.type == "general") return settings.inflation / 100 || 0;
    else return -10e9;
  };

  const inflateAmount = (amount: number, inflation: YearlyIncrease) => {
    return amount * Math.pow(1 + inflationRate(inflation), years);
  };

  // back out existing spending
  const existing = spending.preSpending
    .map((item) =>
      moyrToAnnual(
        item.newAmount ? item.newAmount : convertToMoYr(item.amount || 0),
      ),
    )
    .reduce((a, b) => a + b, 0);

  let result =
    moyrToAnnual(
      spending.newCurrentSpending
        ? spending.newCurrentSpending
        : convertToMoYr(spending.currentSpending),
    ) - existing;

  //back out death reduction
  if (settings.whoDies != -1 && settings.deathYears[settings.whoDies]) {
    const age =
      calculateAge(new Date(data.people[settings.whoDies].birthday)) + years;
    if (age > (settings.deathYears[settings.whoDies] as any)) {
      result = result * (1 - spending.decreaseAtDeath[settings.whoDies] / 100);
    }
  }
  // inflate by general
  result = inflateAmount(result, spending.yearlyIncrease);

  // add pre back in
  const pre = spending.preSpending
    ?.filter((item) => year <= item.endYear)
    .map((item) =>
      inflateAmount(
        moyrToAnnual(
          item.newAmount ? item.newAmount : convertToMoYr(item.amount || 0),
        ),
        item.increase,
      ),
    )
    .reduce((a, b) => a + b, 0);
  result += pre;

  // add post spending
  const post = spending.postSpending
    ?.filter(
      (item) => (item.endYear || 2100) >= year && (item.startYear || 0) <= year,
    )
    .map((item) => {
      let amount = moyrToAnnual(
        item.newAmount ? item.newAmount : convertToMoYr(item.amount || 0),
      );
      if (settings.whoDies !== -1 && settings.deathYears[settings.whoDies]) {
        const age =
          calculateAge(new Date(data.people[settings.whoDies].birthday)) +
          years;
        if (age > (settings.deathYears[settings.whoDies] as any)) {
          amount *= 1 - item.changeAtDeath[settings.whoDies] / 100;
        }
      }
      return inflateAmount(amount, item.increase);
    })
    .reduce((a, b) => a + b, 0);
  result += post;

  if (settings.inflationType == "Real") {
    result = calculatePV(result, (settings.inflation || 0) / 100, years);
  }

  return Math.round(isNaN(result) ? 0 : result);
};

const calculateSingleSpending = (
  data: IncomeMapData,
  spending: RetirementSpendingSettings | undefined,
  settings: ScenarioSettings,
  year: number,
) => {};

function calculatePV(futureValue: any, interestRate: any, periods: any) {
  return futureValue / Math.pow(1 + interestRate, periods);
}
