import calculate from "src/calculator/calculate";
import { basicTitle } from "src/calculator/title";
import { useFullscreen } from "src/hooks/useFullScreen";
import { Client, Income, ScenarioSettings, SelectedColumn } from "src/types";
import {
  getTaxRate,
  printNumber,
  selectedTaxColors,
  splitDate,
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
const SourceTable = ({
  scenario,
  client,
  setSelectedYear,
  selectedYear,
  setSelectedColumn,
  selectedColumn,
  print,
}: Props) => {
  const currentYear = new Date().getFullYear();
  const height = 100;
  const { isFullscreen } = useFullscreen();

  const setColumn = (name: string) => () => {
    console.log(name);
    selectedColumn?.type === name
      ? setSelectedColumn({ type: "none", id: 0 })
      : setSelectedColumn({ type: name, id: 0 });
  };
  const setRow = (year: number) => () => {
    selectedYear === year ? setSelectedYear(-1) : setSelectedYear(year);
  };
  const incomes = scenario.incomes.filter((income) => income.enabled);

  const groupedIncomesByTaxType = incomes.reduce((acc, income) => {
    const key = income.type;
    if (!acc[key]) acc[key] = [];
    acc[key].push(income);
    return acc;
  }, {} as any);
  const divisionFactor =
    client.liveSettings.monthlyYearly === "monthly" ? 12 : 1;

  const selectedColor = (key: string) =>
    selectedColumn?.type === key ? "bg-slate-200" : "";
  const selectedColorHeader = (key: string) =>
    selectedColumn?.type === key ? "bg-slate-200" : "";

  const data = yearRange(
    currentYear,
    currentYear + client.liveSettings.maxYearsShown - 1,
  ).map((line) => {
    const startYear = new Date().getFullYear();
    const calculateOne = (income: Income, currentYear: number) => {
      const result = calculate({
        people: scenario.people,
        income,
        startYear,
        currentYear,
        deathYears: scenario.deathYears as any,
        dead: scenario.whoDies,
        inflation: scenario.inflation,
        incomes: incomes.filter((income) => income.enabled),
        ssSurvivorAge: scenario.ssSurvivorAge,
        inflationType: scenario.inflationType,
      });

      return {
        ...result,
        amount: result.amount / divisionFactor,
      };
    };

    const income = (type: string) =>
      incomes
        .filter((income) => income.enabled && income.type === type)
        .map((income) => calculateOne(income, line).amount)
        .filter((t) => typeof t === "number")
        .reduce((a, b) => a + b, 0);

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
          (income) => income.enabled && income.type === key,
        );

        return {
          value: (
            <div
              className={`px-2 text-[#475467] ${selectedYear === line ? selectedTaxColors[key] : ""}`}
            >
              {printNumber(income(key) * (1 - taxRate))}
            </div>
          ),
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
          <div className={`px-2 text-black font-medium `}>
            {printNumber(
              incomes
                .map((income) => calculateOne(income, line).amount)
                .filter((t) => typeof t === "number")
                .reduce((a: any, b: any) => a + b, 0) *
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
        ...Object.keys(groupedIncomesByTaxType).map((key) => ({
          key,
          name: basicTitle(key),
        })),

        { name: "Total", key: "total" },
      ]}
      data={data}
    />
  );
  return (
    <div className="flex justify-between flex-wrap">
      {[0, 1, 2, 3, 4].map((tableInd) => {
        return (
          currentYear + scenario.maxYearsShown >
          currentYear + tableInd * height && (
            <div className="w-full">
              <table className="border bg-white !text-sm w-full">
                <thead
                  className={`text-xs cursor-pointer bg-[#F9FAFB] text-black font-medium text-left sticky z-50 border-1 ${isFullscreen ? "top-[111px]" : !print && "top-[184px]"} border-separate`}
                >
                  <tr>
                    <th
                      className={`px-6 py-[0.45rem] font-medium text-black  ${selectedColor("year")}`}
                      onClick={setColumn("year")}
                    >
                      Year
                    </th>
                    <th
                      className={` font-medium ${selectedColor("age")}`}
                      onClick={setColumn("age")}
                    >
                      <div className="px-2 h-full w-full">Age</div>
                    </th>
                    {Object.keys(groupedIncomesByTaxType).map((key) => (
                      <th
                        className={`px-2 font-medium ${selectedColorHeader(key)}`}
                        onClick={setColumn(key)}
                        key={key}
                      >
                        {basicTitle(key)}
                      </th>
                    ))}
                    <th
                      className={` font-medium ${selectedColumn?.type === "total" ? "!g-slate-200" : ""}`}
                      onClick={setColumn("total")}
                    >
                      <div className="px-2 h-full w-full">Total</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="print:text-sm">
                  {yearRange(
                    currentYear + tableInd * height,
                    Math.min(
                      currentYear + (tableInd + 1) * height - 1,
                      currentYear + scenario.maxYearsShown - 1,
                    ),
                  ).map((line, index) => {
                    const startYear = new Date().getFullYear();
                    const calculateOne = (
                      income: Income,
                      currentYear: number,
                    ) => {
                      const result = calculate({
                        people: scenario.people,
                        income,
                        startYear,
                        currentYear,
                        deathYears: scenario.deathYears as any,
                        dead: scenario.whoDies,
                        inflation: scenario.inflation,
                        incomes: scenario.incomes.filter(
                          (income) => income.enabled,
                        ),
                        ssSurvivorAge: scenario.ssSurvivorAge,
                        inflationType: scenario.inflationType,
                      });

                      return {
                        ...result,
                        amount: result.amount / divisionFactor,
                      };
                    };
                    const income = (type: string) =>
                      scenario.incomes
                        .filter(
                          (income) => income.enabled && income.type === type,
                        )
                        .map((income) => calculateOne(income, line).amount)
                        .filter((t) => typeof t === "number")
                        .reduce((a, b) => a + b, 0);

                    return (
                      <tr
                        className={`${index % 2 == 1 ? "bg-[#F9FAFB]" : "bg-white"} border-y border-[#EAECF0] `}
                        onClick={setRow(line)}
                      >
                        <td
                          className={`px-6 py-[6px] font-medium ${selectedColumn?.type === "year" ? "!bg-slate-200" : ""} ${selectedYear === line ? "!bg-slate-200" : ""}`}
                        >
                          {line}
                        </td>
                        <td
                          className={`px-2 py-[0.45rem] font-medium ${selectedColumn?.type === "age" ? "!bg-slate-200" : ""} ${selectedYear === line ? "!bg-slate-200" : ""}`}
                        >
                          {scenario.people
                            .map((p) => line - splitDate(p.birthday).year)
                            .join("/")}
                        </td>
                        {Object.keys(groupedIncomesByTaxType).map((key) => (
                          <td
                            className={`px-2 py-[0.45rem] ${selectedColumn?.type === key || line == selectedYear ? "bg-slate-200" : ""} text-[#475467] ${selectedYear === line ? selectedTaxColors[key] : ""}`}
                          >
                            {printNumber(income(key))}
                          </td>
                        ))}
                        <td
                          className={`px-2 py-[0.45rem] font-medium ${selectedColumn?.type === "total" ? "!bg-slate-200" : ""} ${selectedYear === line ? "!bg-slate-200" : ""}`}
                        >
                          {" "}
                          {printNumber(
                            scenario.incomes
                              .map((item) => calculateOne(item, line).amount)
                              .reduce((a, b) => a + b, 0),
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        );
      })}
    </div>
  );
};

export default SourceTable;
