import calculate from "src/calculator/calculate";
import { Client, Income, ScenarioSettings, SelectedColumn } from "src/types";
import { getTaxRate, printNumber, splitDate, yearRange } from "src/utils";
import MapTable, { IncomeTooltip } from "./MapTable";
import LongevityTooltip from "./LongevityTooltip";

interface Props {
  scenario: ScenarioSettings;
  client: Client;
  selectedYear?: number;
  selectedColumn?: SelectedColumn;
  setSelectedColumn?: any;
  setSelectedYear?: any;
  print?: boolean;
}
const PersonTable = ({
  scenario,
  client,
  setSelectedYear,
  selectedYear,
  setSelectedColumn,
  selectedColumn,
  print,
}: Props) => {
  const currentYear = new Date().getFullYear();

  const groupedIncomesByTaxType = scenario.incomes.reduce(
    (acc, income) => {
      const key = income.personId;
      if (!acc[key]) acc[key] = [];
      acc[key].push(income);
      return acc;
    },
    { 0: [], 1: [], "-1": [] } as any,
  );
  const divisionFactor =
    client.liveSettings.monthlyYearly === "monthly" ? 12 : 1;

  const incomes = scenario.incomes.filter((income) => income.enabled);

  const data = yearRange(
    currentYear,
    currentYear + client.liveSettings.maxYearsShown - 1,
  ).map((line) => {
    const startYear = new Date().getFullYear();

    const taxRate = getTaxRate(client, scenario, line);
    const calculateOne = (income: Income, currentYear: number) => {
      const result = calculate({
        people: scenario.people,
        income,
        startYear,
        currentYear,
        deathYears: scenario.deathYears as any,
        dead: scenario.whoDies,
        inflation: scenario.inflation,
        incomes: scenario.incomes.filter((income) => income.enabled),
        ssSurvivorAge: scenario.ssSurvivorAge,
        inflationType: scenario.inflationType,
      });

      return {
        ...result,
        amount: result.amount / divisionFactor,
      };
    };
    const income = (person: string) =>
      incomes
        .filter(
          (income) => income.enabled && income.personId === parseInt(person),
        )
        .map((income) => calculateOne(income, line).amount)
        .filter((t) => typeof t === "number")
        .reduce((a, b) => a + b, 0) *
      (1 - taxRate);

    return [
      {
        value: <div className="font-medium text-black">{line}</div>,
        key: "year",
      },
      {
        value: (
          <LongevityTooltip client={client} currentYear={currentYear}>
            <div className="font-medium text-black w-6">
              {scenario.people
                .map((p) => currentYear - splitDate(p.birthday).year)
                .join("/")}
            </div>
          </LongevityTooltip>
        ),
        key: "age",
      },
      ...Object.keys(groupedIncomesByTaxType).map((key) => {
        const selectedIncomes = incomes.filter(
          (income) => income.enabled && income.personId === parseInt(key),
        );

        return {
          value: <>{printNumber(income(key))}</>,
          key,
          tooltip:
            income(key) > 0 ? (
              <IncomeTooltip
                client={client}
                selectedIncomes={selectedIncomes}
                scenario={scenario}
                year={line}
              />
            ) : undefined,
        };
      }),
      {
        value: (
          <div className="font-medium text-black">
            {printNumber(
              incomes
                .map((item) => calculateOne(item, line).amount)
                .reduce((a, b) => a + b, 0) *
              (1 - taxRate),
            )}
          </div>
        ),
        key: "total",
        tooltip: incomes.length ? (
          <IncomeTooltip
            client={client}
            selectedIncomes={incomes.sort((a, b) =>
              a.type.localeCompare(b.type),
            )}
            scenario={scenario}
            year={line}
          />
        ) : undefined,
      },
    ];
  });

  return (
    <MapTable
      client={client}
      selectedYear={selectedYear}
      selectedColumn={selectedColumn}
      setSelectedColumn={setSelectedColumn}
      setSelectedYear={setSelectedYear}
      print={print}
      columns={[
        { name: "Year", key: "year" },
        { name: "Age", key: "age" },
        ...client.people.map((item) => ({
          name: item.name,
          key: item.id.toString(),
        })),
        ...(client.people.length > 1 ? [{ name: "Joint", key: "-1" }] : []),
        { name: "Total", key: "total" },
      ]}
      data={data}
    />
  );
};

export default PersonTable;
