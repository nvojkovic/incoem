import { yearRange } from "../utils";
import SpendingChart from "./Charts/SpendingChart";
import Header from "./Report/Header";
import { getSpendingItemOverYears } from "./Spending/calculate";

interface MapChartProps {
  settings: ScenarioSettings;
  client: Client;
  print?: boolean;
}

const MapChart = ({ settings, client, print }: MapChartProps) => {
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

  return (
    <div className={`bg-white ${!print && "pb-5"}`}>
      <Header client={client as any} scenario={settings} />
      <SpendingChart
        taxes={null}
        years={yearRange(startYear, startYear + settings.maxYearsShown - 1)}
        spending={false}
        initialHeight={print ? 700 : 550}
        longevityFlag={client.longevityFlag}
        people={settings.data.people}
        stability={client.stabilityRatioFlag}
        needsFlag={client.needsFlag}
        stackedData={[baseSpending, ...preSpending, ...postSpending].map(
          (item) => ({
            name: item[0].name,
            stable: true,
            values: item.map((i) => i.amount),
          }),
        )}
      />
    </div>
  );
};

export default MapChart;
