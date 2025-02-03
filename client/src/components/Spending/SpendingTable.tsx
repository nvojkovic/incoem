import { useState } from "react";
import { getTaxRate, printNumber, splitDate, yearRange } from "src/utils";
import { getSpendingItemOverYears } from "./calculate";
import {
  Client,
  Income,
  IncomeMapData,
  RetirementSpendingSettings,
  ScenarioSettings,
} from "src/types";
import calculate from "src/calculator/calculate";

interface SpendingTableProps {
  settings: ScenarioSettings;
  spending: RetirementSpendingSettings;
  data: IncomeMapData;
  client: Client;
}

const SpendingTable = ({
  settings,
  spending,
  data,
  client,
}: SpendingTableProps) => {
  const [selectedCol, setSelectedCol] = useState(null as any);
  const [selectedRow, setSelectedRow] = useState(null as any);
  const currentYear = new Date().getFullYear();
  const nowYear = new Date().getFullYear();
  const factor = settings.monthlyYearly === "monthly" ? 12 : 1;
  const l = 56;
  const baseSpending = getSpendingItemOverYears(
    data,
    spending,
    settings,
    currentYear,
    currentYear + settings.maxYearsShown,
    "base",
  );
  const preSpending = spending.preSpending.map((item) =>
    getSpendingItemOverYears(
      data,
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
      data,
      spending,
      settings,
      currentYear,
      currentYear + settings.maxYearsShown,
      "post",
      item.category,
    ),
  );
  const results = [baseSpending, ...preSpending, ...postSpending];
  return (
    <div className="flex gap-4 p-3 w-full">
      {[0, 1, 2, 3, 4].map(
        (tableInd) =>
          currentYear + settings.maxYearsShown > currentYear + tableInd * l && (
            <div className="w-full">
              <table className="w-full border print:border-none bg-white">
                <thead
                  className={`text-xs cursor-pointer bg-[#F9FAFB] text-black font-medium text-left sticky z-50 print:border-b-gray-500 print:border-b-2 border-black`}
                >
                  <tr>
                    <th
                      className={`px-6 print:px-3 py-3 ${selectedCol === "year" ? "bg-slate-200" : ""}`}
                      onClick={() =>
                        setSelectedCol(selectedCol === "year" ? null : "year")
                      }
                    >
                      Year
                    </th>
                    <th
                      className={`px-6 print:px-3 py-3 ${selectedCol === "age" ? "bg-slate-200" : ""}`}
                      onClick={() =>
                        setSelectedCol(selectedCol === "age" ? null : "age")
                      }
                    >
                      Age
                    </th>
                    <th
                      className={`px-6 print:px-3 py-3 ${selectedCol === "base" ? "bg-slate-200" : ""}`}
                      onClick={() =>
                        setSelectedCol(selectedCol === "base" ? null : "base")
                      }
                    >
                      Base Spending
                    </th>
                    {spending.preSpending.map((i) => (
                      <th
                        className={`px-6 print:px-3 py-3 ${selectedCol === `pre-${i.category}` ? "bg-slate-200" : ""}`}
                        onClick={() =>
                          setSelectedCol(
                            selectedCol === `pre-${i.category}`
                              ? null
                              : `pre-${i.category}`,
                          )
                        }
                      >
                        {i.category}
                      </th>
                    ))}
                    {spending.postSpending.map((i) => (
                      <th
                        className={`px-6 print:px-3 py-3 ${selectedCol === `post-${i.category}` ? "bg-slate-200" : ""}`}
                        onClick={() =>
                          setSelectedCol(
                            selectedCol === `post-${i.category}`
                              ? null
                              : `post-${i.category}`,
                          )
                        }
                      >
                        {i.category}
                      </th>
                    ))}
                    {client.taxesFlag && (
                      <th
                        className={`px-6 print:px-3 py-3 ${selectedCol === "taxes" ? "bg-slate-200" : ""}`}
                        onClick={() =>
                          setSelectedCol(
                            selectedCol === "taxes" ? null : "taxes",
                          )
                        }
                      >
                        Taxes
                      </th>
                    )}
                    <th
                      className={`px-6 print:px-3 py-3 ${selectedCol === "total" ? "bg-slate-200" : ""}`}
                      onClick={() =>
                        setSelectedCol(selectedCol === "total" ? null : "total")
                      }
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="print:text-sm">
                  {yearRange(
                    currentYear + tableInd * l,
                    Math.min(
                      currentYear + (tableInd + 1) * l - 1,
                      currentYear + settings.maxYearsShown,
                    ),
                  ).map((year) => (
                    <tr
                      className={`${selectedRow === year ? "bg-slate-200" : "hover:bg-slate-100"}`}
                      onClick={() =>
                        setSelectedRow(selectedRow === year ? null : year)
                      }
                    >
                      <td
                        className={`px-6 print:px-3 py-1 font-bold ${selectedCol === "year" ? "bg-slate-200" : ""}`}
                      >
                        {year}
                      </td>
                      <td
                        className={`px-6 print:px-3 py-1 ${selectedCol === "age" ? "bg-slate-200" : ""}`}
                      >
                        {data.people
                          .map((p) => year - splitDate(p.birthday).year)
                          .join("/")}
                      </td>
                      <td
                        className={`px-6 print:px-3 py-1 ${selectedCol === "base" && "bg-slate-200"}`}
                      >
                        {printNumber(
                          baseSpending[year - currentYear].amount / factor,
                        )}
                      </td>
                      {preSpending.map((item, index) => (
                        <td
                          className={`px-6 print:px-3 py-1 ${selectedCol?.startsWith("pre-") &&
                              selectedCol ===
                              `pre-${spending.preSpending[index].category}`
                              ? "bg-slate-200"
                              : ""
                            }`}
                        >
                          {printNumber(
                            item[year - currentYear].amount / factor,
                          )}
                        </td>
                      ))}
                      {postSpending.map((item, index) => (
                        <td
                          className={`px-6 print:px-3 py-1 ${selectedCol?.startsWith("post-") &&
                              selectedCol ===
                              `post-${spending.postSpending[index].category}`
                              ? "bg-slate-200"
                              : ""
                            }`}
                        >
                          {printNumber(
                            item[year - currentYear].amount / factor,
                          )}
                        </td>
                      ))}

                      {client.taxesFlag &&
                        (() => {
                          const calculateOne = (
                            income: Income,
                            currentYear: number,
                          ) => {
                            const result = calculate({
                              people: settings.people,
                              income,
                              startYear: nowYear,
                              currentYear,
                              deathYears: settings.deathYears as any,
                              dead: settings.whoDies,
                              inflation: settings.inflation,
                              incomes: settings.incomes.filter(
                                (income) => income.enabled,
                              ),
                              ssSurvivorAge: settings.ssSurvivorAge,
                              inflationType: settings.inflationType,
                            });

                            return result.amount;
                          };
                          const income = client.incomes
                            .filter((income) => income.enabled)
                            .map((income) => calculateOne(income, year))
                            .filter((t) => typeof t === "number")
                            .reduce((a, b) => a + b, 0);

                          const taxRate = getTaxRate(client, settings, year);

                          const taxes = (income * taxRate) / factor;
                          return (
                            <td
                              className={`px-6 py-1 print:px-3 ${selectedCol === "taxes" ? "bg-slate-200" : ""}`}
                            >
                              {printNumber(taxes)}
                            </td>
                          );
                        })()}
                      <td
                        className={`px-6 py-1 print:px-3 ${selectedCol === "total" ? "bg-slate-200" : ""}`}
                      >
                        {printNumber(
                          results
                            .map((item) => item[year - currentYear].amount)
                            .reduce((a, b) => a + b, 0) / factor,
                        )}
                      </td>
                    </tr>
                  ))}
                  {/*yearRange(
                    currentYear + tableInd * l,
                    Math.min(
                      currentYear + (tableInd + 1) * l - 1,
                      currentYear + settings.maxYearsShown,
                    ),
                  ).map((line) => (
                    <tr className="">
                      <td className="px-6 py-1  font-bold">{line}</td>
                      <td className="px-6 py-1 ">
                        {data.people
                          .map((p) => line - splitDate(p.birthday).year)
                          .join("/")}
                      </td>

                      {calculateSingleSpending(
                        data,
                        spending,
                        settings,
                        currentYear,
                      ).map((line) => (
                        <td className="px-2 py-1">
                          {printNumber(line.amount / factor)}
                        </td>
                      ))}

                      <td className="px-2 py-1">
                        {printNumber(
                          calculateSpendingYear(
                            data,
                            spending,
                            settings,
                            line,
                          ) / factor,
                        )}
                      </td>
                    </tr>
                  ))*/}
                </tbody>
              </table>
            </div>
          ),
      )}
    </div>
  );
};

export default SpendingTable;
