import { convertToMoYr, moyrToAnnual } from "../../utils";
import { calculateAge } from "../Info/PersonInfo";

export const calculateSingleSpending = (
  data: IncomeMapData,
  spending: RetirementSpendingSettings | undefined,
  settings: ScenarioSettings,
  year: number,
): SpendingResult[] => {
  if (!spending) return [];
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

  const results: SpendingResult[] = [];

  // Calculate base spending
  let baseAmount = moyrToAnnual(
    spending.newCurrentSpending
      ? spending.newCurrentSpending
      : convertToMoYr(spending.currentSpending),
  );

  // Apply death reduction to base
  if (settings.whoDies != -1 && settings.deathYears[settings.whoDies]) {
    const age =
      calculateAge(new Date(data.people[settings.whoDies].birthday)) + years;
    if (age > (settings.deathYears[settings.whoDies] as any)) {
      baseAmount =
        baseAmount * (1 - spending.decreaseAtDeath[settings.whoDies] / 100);
    }
  }

  // Inflate base amount
  baseAmount = inflateAmount(baseAmount, spending.yearlyIncrease);

  // Add base spending
  results.push({
    type: "base",
    amount: baseAmount,
  });

  // Add pre-retirement spending
  spending.preSpending
    ?.filter((item) => year <= item.endYear)
    .forEach((item) => {
      let amount = inflateAmount(
        moyrToAnnual(
          item.newAmount ? item.newAmount : convertToMoYr(item.amount || 0),
        ),
        item.increase,
      );
      results.push({
        type: "pre",
        category: item.category,
        amount,
      });
    });

  // Add post-retirement spending
  spending.postSpending
    ?.filter(
      (item) => (item.endYear || 2100) >= year && (item.startYear || 0) <= year,
    )
    .forEach((item) => {
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
      amount = inflateAmount(amount, item.increase);
      results.push({
        type: "post",
        category: item.category,
        amount,
      });
    });

  // Apply real dollars adjustment if needed
  if (settings.inflationType == "Real") {
    results.forEach((result) => {
      result.amount = calculatePV(
        result.amount,
        (settings.inflation || 0) / 100,
        years,
      );
    });
  }

  // Round all amounts
  results.forEach((result) => {
    result.amount = Math.round(isNaN(result.amount) ? 0 : result.amount);
  });

  return results;
};

export const calculateSpendingYear = (
  data: IncomeMapData,
  spending: RetirementSpendingSettings | undefined,
  settings: ScenarioSettings,
  year: number,
) => {
  const result = calculateSingleSpending(data, spending, settings, year);
  return result.map((i) => i.amount).reduce((a, b) => a + b, 0);
};

export const getSpendingItems = (
  data: IncomeMapData,
  spending: RetirementSpendingSettings | undefined,
  settings: ScenarioSettings,
  year: number,
): SpendingResult[] => {
  const result = calculateSingleSpending(data, spending, settings, year);
  return result;
};

export const getSpendingItemsByType = (
  data: IncomeMapData,
  spending: RetirementSpendingSettings | undefined,
  settings: ScenarioSettings,
  year: number,
  type: "base" | "pre" | "post",
): SpendingResult[] => {
  const result = calculateSingleSpending(data, spending, settings, year);
  return result.filter((i) => i.type === type);
};

export const getSpendingItemOverYears = (
  data: IncomeMapData,
  spending: RetirementSpendingSettings | undefined,
  settings: ScenarioSettings,
  startYear: number,
  endYear: number,
  type: "base" | "pre" | "post",
  category?: string,
): { year: number; amount: number; name: string }[] => {
  const results: { year: number; amount: number; name: string }[] = [];

  for (let year = startYear; year <= endYear; year++) {
    const yearItems = calculateSingleSpending(data, spending, settings, year);
    const matchingItem = yearItems.find(
      (item) =>
        item.type === type && (category ? item.category === category : true),
    );

    if (matchingItem) {
      results.push({
        year,
        amount: matchingItem.amount,
        name: category || (type as any).capitalize(),
      });
    } else {
      results.push({
        year,
        amount: 0,
        name: category || (type as any).capitalize(),
      });
    }
  }

  return results;
};

function calculatePV(futureValue: any, interestRate: any, periods: any) {
  return futureValue / Math.pow(1 + interestRate, periods);
}
