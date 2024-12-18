import calculate from "../calculator/calculate";
import title from "../calculator/title";
import { yearRange } from "../utils";
import MainChart from "./Charts/MainChart";
import Header from "./Report/Header";
import { calculateSpendingYear } from "./Spending/calculate";

interface MapChartProps {
  settings: ScenarioSettings;
  client: Client;
  print?: boolean;
}

const MapChart = ({ settings, client, print }: MapChartProps) => {
  const incomes = settings.data.incomes.filter((inc) => inc.enabled);
  const startYear = new Date().getFullYear();
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
  // const income = years.map((line) =>
  //   client.data.incomes
  //     .filter((income) => income.enabled)
  //     .map((income) => calculateOne(income, line).amount)
  //     .filter((t) => typeof t === "number")
  //     .reduce((a, b) => a + b, 0),
  // );
  //
  const taxes = (line: any) => {
    const income = client.data.incomes
      .filter((income) => income.enabled)
      .map((income) => calculateOne(income, line).amount)
      .filter((t) => typeof t === "number")
      .reduce((a, b) => a + b, 0);

    const taxRate = settings.retirementYear
      ? line >= settings.retirementYear
        ? client.spending.postTaxRate
        : client.spending.preTaxRate
      : 0;
    const taxes = income * (taxRate / 100);
    return taxes;
  };

  return (
    <div className={`bg-white ${!print && "pb-5"}`}>
      <Header client={client as any} scenario={settings} />
      <MainChart
        years={yearRange(startYear, startYear + settings.maxYearsShown - 1)}
        spending={false}
        initialHeight={print ? 700 : 550}
        longevityFlag={client.longevityFlag}
        people={settings.data.people}
        lineData={
          client.needsFlag
            ? yearRange(startYear, startYear + settings.maxYearsShown - 1).map(
                (currentYear) =>
                  calculateSpendingYear(
                    settings.data,
                    client.spending,
                    { ...settings, taxType: "Pre-Tax" },
                    currentYear,
                  ) /
                    divisionFactor +
                  (settings.taxType == "Post-Tax" ? taxes(currentYear) : 0),
              )
            : []
        }
        taxes={
          client.needsFlag && settings.taxType === "Post-Tax"
            ? yearRange(startYear, startYear + settings.maxYearsShown - 1).map(
                (line) => taxes(line),
              )
            : []
        }
        stability={client.stabilityRatioFlag}
        needsFlag={client.needsFlag}
        stackedData={incomes.map((income, i) => ({
          name: title(incomes, settings.data.people, i),
          stable: income.stable,
          values: yearRange(
            startYear,
            startYear + settings.maxYearsShown - 1,
          ).map((year) =>
            Math.round(
              calculate({
                people: settings.data.people,
                income,
                startYear,
                currentYear: year,
                deathYears: settings.deathYears as any,
                dead: settings.whoDies,
                inflation: settings.inflation,
                incomes: incomes,
                ssSurvivorAge: settings.ssSurvivorAge,
                inflationType: settings.inflationType,
              }).amount / divisionFactor,
            ),
          ),
        }))}
      />
    </div>
  );
};

export default MapChart;
