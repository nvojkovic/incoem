import calculate from "../calculator/calculate";
import title from "../calculator/title";
import { yearRange } from "../utils";
import MainChart from "./Charts/MainChart";
import Header from "./Report/Header";
import { calculateSpendingYear } from "./Spending/SpendingPage";

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
                ) / divisionFactor,
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
