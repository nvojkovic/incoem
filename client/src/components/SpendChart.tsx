import calculate from "src/calculator/calculate";
import { getTaxRate, yearRange } from "../utils";
import SpendingChart from "./Charts/SpendingChart";
import Header from "./Report/Header";
import { getSpendingItemOverYears } from "./Spending/calculate";

interface MapChartProps {
  settings: ScenarioSettings;
  client: Client;
  print?: boolean;
}

const SpendChart = ({ settings, client, print }: MapChartProps) => {
  const startYear = new Date().getFullYear();
  const spending = client.spending;
  const currentYear = new Date().getFullYear();

  const baseSpending = getSpendingItemOverYears(
    client.data,
    spending,
    settings,
    currentYear,
    currentYear + settings.maxYearsShown,
    "base",
  );
  const preSpending = spending.preSpending.map((item) =>
    getSpendingItemOverYears(
      client.data,
      spending,
      settings,
      currentYear,
      currentYear + settings.maxYearsShown,
      "pre",
      item.category,
    ),
  );

  const postSpending = spending.postSpending.map((item) =>
    getSpendingItemOverYears(
      client.data,
      spending,
      settings,
      currentYear,
      currentYear + settings.maxYearsShown,
      "post",
      item.category,
    ),
  );

  const years = yearRange(startYear, startYear + settings.maxYearsShown - 1);

  const divisionFactor =
    client.liveSettings.monthlyYearly === "monthly" ? 12 : 1;

  const calculateOne = (income: Income, currentYear: number) => {
    const result = calculate({
      people: settings.data.people,
      income,
      startYear,
      currentYear,
      deathYears: settings.deathYears as any,
      dead: settings.whoDies,
      inflation: settings.inflation,
      incomes: settings.data.incomes.filter((income) => income.enabled),
      ssSurvivorAge: settings.ssSurvivorAge,
      inflationType: settings.inflationType,
    });

    return {
      ...result,
      amount: result.amount / divisionFactor,
    };
  };
  const taxes = years.map((year) => ({
    name: "Taxes",
    year,
    amount:
      client.data.incomes
        .filter((income) => income.enabled)
        .map((income) => calculateOne(income, year).amount)
        .filter((t) => typeof t === "number")
        .reduce((a, b) => a + b, 0) * getTaxRate(client, settings, year),
  }));

  return (
    <div className={`bg-white ${!print && "pb-5"}`}>
      <Header client={client as any} scenario={settings} />
      <SpendingChart
        years={yearRange(startYear, startYear + settings.maxYearsShown - 1)}
        spending={false}
        initialHeight={print ? 620 : 550}
        longevityFlag={client.longevityFlag}
        people={settings.data.people}
        stability={client.stabilityRatioFlag}
        needsFlag={client.needsFlag}
        stackedData={[baseSpending, ...preSpending, ...postSpending, taxes].map(
          (item) => ({
            name: item[0]?.name,
            stable: true,
            values: item.map((i) => i.amount / divisionFactor),
          }),
        )}
      />
    </div>
  );
};

export default SpendChart;
