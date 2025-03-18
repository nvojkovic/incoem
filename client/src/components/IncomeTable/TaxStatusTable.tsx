import { Tooltip } from "flowbite-react";
import calculate from "src/calculator/calculate";
import title from "src/calculator/title";
import { useFullscreen } from "src/hooks/useFullScreen";
import { Client, Income, ScenarioSettings, SelectedColumn } from "src/types";
import {
  printNumber,
  selectedTaxColors,
  splitDate,
  taxColors,
  yearRange,
} from "src/utils";

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

  const groupedIncomesByTaxType = scenario.incomes.reduce(
    (acc, income) => {
      const key = income.taxType || "Taxable";
      if (!acc[key]) acc[key] = [];
      acc[key].push(income);
      return acc;
    },
    { Taxable: [], "Tax-Deferred": [], "Tax-Free": [] } as any,
  );
  console.log("hhh", groupedIncomesByTaxType);
  {
    ("text-[#475467]");
  }
  const divisionFactor =
    client.liveSettings.monthlyYearly === "monthly" ? 12 : 1;

  const selectedColor = (key: string) =>
    selectedColumn?.type === key
      ? (client.liveSettings.showTaxType && selectedTaxColors[key]) ||
      "bg-slate-200"
      : "";
  const selectedColorHeader = (key: string) =>
    selectedColumn?.type === key ? "bg-slate-200" : "";
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
                        {key}
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
                    const getIncomes = (taxType: string) =>
                      scenario.incomes
                        .filter(
                          (income) =>
                            income.enabled &&
                            (income.taxType === taxType ||
                              (!income.taxType && taxType === "Taxable")),
                        )
                        .map((income, i) => [
                          title(scenario.incomes, client.people, i),
                          calculateOne(income, line).amount,
                        ]);

                    const income = (taxType: string) =>
                      getIncomes(taxType)
                        .map((item) => item[1])
                        .filter((t) => typeof t === "number")
                        .reduce((a: any, b: any) => a + b, 0);

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
                            className={`px-2 py-[0.45rem] ${selectedColumn?.type === key || line == selectedYear ? selectedColor(key) : client.liveSettings.showTaxType && taxColors[key]} text-[#475467] ${selectedYear === line ? (client.liveSettings.showTaxType ? selectedTaxColors[key] : "bg-slate-200") : ""}`}
                          >
                            <Tooltip
                              content={(() => {
                                return (
                                  <div className="z-[5000000] sticky w-60 ">
                                    <div className="text-lg mb-2">{line}</div>
                                    {scenario.incomes
                                      .filter((i) => i.taxType === key)
                                      .map(
                                        (income, i) =>
                                          calculateOne(income, line).amount >
                                          0 && (
                                            <div className="flex justify-between gap-3">
                                              <div className="font-bold">
                                                {title(
                                                  scenario.incomes,
                                                  client.people,
                                                  i,
                                                )}
                                                :{" "}
                                              </div>
                                              {printNumber(
                                                calculateOne(income, line)
                                                  .amount,
                                              )}
                                            </div>
                                          ),
                                      )}
                                  </div>
                                );
                              })()}
                              theme={{ target: "" }}
                              style="light"
                              arrow={false}
                              className={`border border-main-orange ${scenario.incomes.filter(
                                (i) =>
                                  i.taxType === key &&
                                  calculateOne(i, line).amount > 0,
                              ).length == 0 && "hidden"
                                }`}
                              placement="bottom"
                            >
                              {printNumber(income(key) as any)}
                            </Tooltip>
                          </td>
                        ))}

                        <td
                          className={`px-2 py-[0.45rem] font-medium ${selectedColumn?.type === "total" ? "!bg-slate-200" : ""} ${selectedYear === line ? "!bg-slate-200" : ""}`}
                        >
                          {" "}
                          <Tooltip
                            content={(() => {
                              return (
                                <div className="z-[5000000] sticky w-64 ">
                                  <div className="text-lg mb-2">{line}</div>
                                  {scenario.incomes.map(
                                    (income, i) =>
                                      calculateOne(income, line).amount !=
                                      0 && (
                                        <div className="flex justify-between gap-3">
                                          <div className="font-bold">
                                            {title(
                                              scenario.incomes,
                                              client.people,
                                              i,
                                            )}
                                            :{" "}
                                          </div>
                                          {printNumber(
                                            calculateOne(income, line).amount,
                                          )}
                                        </div>
                                      ),
                                  )}
                                </div>
                              );
                            })()}
                            theme={{ target: "" }}
                            style="light"
                            arrow={false}
                            className="border border-main-orange"
                            placement="bottom"
                          >
                            {printNumber(
                              scenario.incomes
                                .map((item) => calculateOne(item, line).amount)
                                .reduce((a, b) => a + b, 0),
                            )}
                          </Tooltip>
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

export default TaxStatusTable;
