import { printNumber, splitDate, yearRange } from "src/utils";
import { getSpendingItemOverYears } from "./calculate";
interface SpendingTableProps {
  settings: ScenarioSettings;
  spending: RetirementSpendingSettings;
  data: IncomeMapData;
}

const SpendingTable = ({ settings, spending, data }: SpendingTableProps) => {
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
                    <th className="px-6 py-3">Year</th>
                    <th className="px-6 py-3">Age</th>
                    <th className="px-6 py-3">Base Spending</th>
                    {spending.preSpending.map((i) => (
                      <th className="px-6 py-3">{i.category}</th>
                    ))}
                    {spending.postSpending.map((i) => (
                      <th className="px-6 py-3">{i.category}</th>
                    ))}

                    <th className="px-6 py-3">Total</th>
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
                    <tr className="">
                      <td className="px-6 py-1  font-bold">{year}</td>
                      <td className="px-6 py-1 ">
                        {data.people
                          .map((p) => year - splitDate(p.birthday).year)
                          .join("/")}
                      </td>
                      {results.map((item) => (
                        <td className="px-6 py-1 ">
                          {printNumber(
                            item[year - currentYear].amount / factor,
                          )}
                        </td>
                      ))}
                      <td className="px-6 py-1 ">
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
