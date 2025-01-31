import { useState } from "react";
import { printNumber, splitDate, yearRange } from "src/utils";
import { getSpendingItemOverYears } from "./calculate";
import {
  IncomeMapData,
  RetirementSpendingSettings,
  ScenarioSettings,
} from "src/types";

interface SpendingTableProps {
  settings: ScenarioSettings;
  spending: RetirementSpendingSettings;
  data: IncomeMapData;
}

const SpendingTable = ({ settings, spending, data }: SpendingTableProps) => {
  const [selectedCol, setSelectedCol] = useState(null as any);
  const [selectedRow, setSelectedRow] = useState(null as any);
  const currentYear = new Date().getFullYear();
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
              <table className="w-full border bg-white">
                <thead
                  className={`text-xs cursor-pointer bg-[#F9FAFB] text-black font-medium text-left sticky z-50 border-1`}
                >
                  <tr>
                    <th 
                      className={`px-6 print:px-3 py-3 ${selectedCol === "year" ? "bg-slate-200" : ""}`}
                      onClick={() => setSelectedCol(selectedCol === "year" ? null : "year")}
                    >
                      Year
                    </th>
                    <th 
                      className={`px-6 print:px-3 py-3 ${selectedCol === "age" ? "bg-slate-200" : ""}`}
                      onClick={() => setSelectedCol(selectedCol === "age" ? null : "age")}
                    >
                      Age
                    </th>
                    <th 
                      className={`px-6 print:px-3 py-3 ${selectedCol === "base" ? "bg-slate-200" : ""}`}
                      onClick={() => setSelectedCol(selectedCol === "base" ? null : "base")}
                    >
                      Base Spending
                    </th>
                    {spending.preSpending.map((i) => (
                      <th 
                        className={`px-6 print:px-3 py-3 ${selectedCol === `pre-${i.category}` ? "bg-slate-200" : ""}`}
                        onClick={() => setSelectedCol(selectedCol === `pre-${i.category}` ? null : `pre-${i.category}`)}
                      >
                        {i.category}
                      </th>
                    ))}
                    {spending.postSpending.map((i) => (
                      <th 
                        className={`px-6 print:px-3 py-3 ${selectedCol === `post-${i.category}` ? "bg-slate-200" : ""}`}
                        onClick={() => setSelectedCol(selectedCol === `post-${i.category}` ? null : `post-${i.category}`)}
                      >
                        {i.category}
                      </th>
                    ))}
                    <th 
                      className={`px-6 print:px-3 py-3 ${selectedCol === "total" ? "bg-slate-200" : ""}`}
                      onClick={() => setSelectedCol(selectedCol === "total" ? null : "total")}
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
                      onClick={() => setSelectedRow(selectedRow === year ? null : year)}
                    >
                      <td className={`px-6 print:px-3 py-1 font-bold ${selectedCol === "year" ? "bg-slate-200" : ""}`}>
                        {year}
                      </td>
                      <td className={`px-6 print:px-3 py-1 ${selectedCol === "age" ? "bg-slate-200" : ""}`}>
                        {data.people
                          .map((p) => year - splitDate(p.birthday).year)
                          .join("/")}
                      </td>
                      {results.map((item, index) => (
                        <td 
                          className={`px-6 print:px-3 py-1 ${
                            selectedCol === "base" && index === 0 ? "bg-slate-200" : 
                            selectedCol?.startsWith("pre-") && index - 1 < spending.preSpending.length && 
                            selectedCol === `pre-${spending.preSpending[index - 1].category}` ? "bg-slate-200" :
                            selectedCol?.startsWith("post-") && index - 1 - spending.preSpending.length < spending.postSpending.length &&
                            selectedCol === `post-${spending.postSpending[index - 1 - spending.preSpending.length].category}` ? "bg-slate-200" : ""
                          }`}
                        >
                          {printNumber(
                            item[year - currentYear].amount / factor,
                          )}
                        </td>
                      ))}
                      <td className={`px-6 py-1 print:px-3 ${selectedCol === "total" ? "bg-slate-200" : ""}`}>
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
