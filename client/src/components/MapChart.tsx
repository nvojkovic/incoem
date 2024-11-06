import calculate from "../calculator/calculate";
import title from "../calculator/title";
import { yearRange } from "../utils";
import StackedAreaChart from "./NewChart";
import { calculateSpendingYear } from "./Spending/SpendingPage";

interface MapChartProps {
  settings: ScenarioSettings;
  client: Client;
  print?: boolean;
}

const MapChart = ({ settings, client, print }: MapChartProps) => {
  const incomes = settings.data.incomes.filter((inc) => inc.enabled);
  const startYear = new Date().getFullYear();
  return (
    <StackedAreaChart
      years={yearRange(startYear, startYear + settings.maxYearsShown - 1)}
      spending={false}
      initialHeight={print ? 700 : undefined}
      lineData={
        client.needsFlag
          ? yearRange(startYear, startYear + settings.maxYearsShown - 1).map(
            (currentYear) =>
              calculateSpendingYear(
                settings.data,
                client.spending,
                { ...settings, taxType: "Pre-Tax" },
                currentYear,
              ),
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
            }).amount,
          ),
        ),
      }))}
    />
  );
};

export default MapChart;
