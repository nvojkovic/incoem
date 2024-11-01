import calculate from "../calculator/calculate";
import title from "../calculator/title";
import { yearRange } from "../utils";
import StackedAreaChart from "./NewChart";
import { calculateSpendingYear } from "./Spending/SpendingPage";

interface MapChartProps {
  data: IncomeMapData;
  settings: any;
  client: Client;
  spending?: RetirementSpendingSettings;
}

const MapChart = ({ data, spending, settings, client }: MapChartProps) => {
  const incomes = data.incomes.filter((inc) => inc.enabled);
  const startYear = new Date().getFullYear();
  return (
    <StackedAreaChart
      years={yearRange(startYear, startYear + settings.maxYearsShown - 1)}
      spending={false}
      lineData={
        client.needsFlag
          ? yearRange(startYear, startYear + settings.maxYearsShown - 1).map(
              (currentYear) =>
                calculateSpendingYear(
                  data,
                  spending,
                  { ...settings, taxType: "Pre-Tax" },
                  currentYear,
                ),
            )
          : []
      }
      stability={client.stabilityRatioFlag}
      needsFlag={client.needsFlag}
      stackedData={incomes.map((income, i) => ({
        name: title(incomes, data.people, i),
        stable: income.stable,
        values: yearRange(
          startYear,
          startYear + settings.maxYearsShown - 1,
        ).map((year) =>
          Math.round(
            calculate({
              people: data.people,
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
