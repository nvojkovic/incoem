import calculate from "src/calculator/calculate";
import { Client, Income, ScenarioSettings, SelectedColumn } from "src/types";
import {
  getTaxRate,
  printNumber,
  selectedTaxColors,
  splitDate,
  taxColors,
  yearRange,
} from "src/utils";
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
const TaxStatusTable = ({
  scenario,
  client,
  setSelectedYear,
  selectedYear,
  setSelectedColumn,
  print,
  selectedColumn,
}: Props) => {
  const currentYear = new Date().getFullYear();

  const groupedIncomesByTaxType = scenario.incomes.reduce(
    (acc, income) => {
      const key = income.taxType || "Taxable";
      if (!acc[key]) acc[key] = [];
      acc[key].push(income);
      return acc;
    },
    { Taxable: [], "Tax-Deferred": [], "Tax-Free": [] } as any,
  );
  const divisionFactor =
    client.liveSettings.monthlyYearly === "monthly" ? 12 : 1;

  const incomes = scenario.incomes.filter((income) => income.enabled);
  const calculateOne = (income: Income, currentYear: number) => {
    const result = calculate({
      people: scenario.people,
      income,
      startYear: new Date().getFullYear(),
      currentYear,
      deathYears: scenario.deathYears as any,
      dead: scenario.whoDies,
      inflation: scenario.inflation,
      incomes: incomes,
      ssSurvivorAge: scenario.ssSurvivorAge,
      inflationType: scenario.inflationType,
    });

    return {
      ...result,
      amount: result.amount / divisionFactor,
    };
  };

  const data = yearRange(
    currentYear,
    currentYear + scenario.maxYearsShown - 1,
  ).map((line) => {
    const income = (taxType: string) =>
      incomes
        .filter(
          (income) =>
            income.taxType === taxType ||
            (!income.taxType && taxType === "Taxable"),
        )
        .map((income) => calculateOne(income, line).amount)
        .filter((t) => typeof t === "number")
        .reduce((a: any, b: any) => a + b, 0);

    const taxRate = getTaxRate(client, scenario, line);

    return [
      {
        value: <div className="font-medium text-black">{line}</div>,
        key: "year",
      },
      {
        value: (
          <LongevityTooltip client={client} currentYear={line}>
            <div className="font-medium text-black w-6">
              {scenario.people
                .map((p) => line - splitDate(p.birthday).year)
                .join("/")}
            </div>
          </LongevityTooltip>
        ),
        key: "age",
      },
      ...Object.keys(groupedIncomesByTaxType).map((key) => {
        const selectedIncomes = incomes.filter(
          (income) =>
            income.taxType === key || (!income.taxType && key === "Taxable"),
        );
        return {
          value: <div>{printNumber(income(key) * (1 - taxRate))}</div>,
          selectedClass:
            client.liveSettings.showTaxType && selectedTaxColors[key],
          normalClass: client.liveSettings.showTaxType && taxColors[key],
          key: key,
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
        key: "total",
        value: (
          <div className="font-medium text-black">
            {printNumber(
              incomes
                .map((income) => calculateOne(income, line).amount)
                .filter((t) => typeof t === "number")
                .reduce((a: any, b: any) => a + b, 0) *
              (1 - taxRate),
            )}
          </div>
        ),
        tooltip: incomes.length ? (
          <IncomeTooltip
            client={client}
            selectedIncomes={incomes}
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

        ...Object.keys(groupedIncomesByTaxType).map((key) => ({
          name: key,
          key,
        })),
        { name: "Total", key: "total" },
      ]}
      data={data}
    />
  );
};

export default TaxStatusTable;
