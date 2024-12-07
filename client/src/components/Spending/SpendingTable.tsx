import { printNumber, splitDate, yearRange } from "src/utils";
import { calculateSpendingYear } from "./SpendingPage";
interface SpendingTableProps {
  settings: ScenarioSettings;
  spending: RetirementSpendingSettings;
  data: IncomeMapData;
}

const SpendingTable = ({ settings, spending, data }: SpendingTableProps) => {
  const currentYear = new Date().getFullYear();
  const factor = settings.monthlyYearly === "monthly" ? 12 : 1;
  return (
    <div className="flex gap-4 p-3">
      {[0, 1, 2, 3, 4].map(
        (tableInd) =>
          currentYear + settings.maxYearsShown >
          currentYear + tableInd * 16 && (
            <div>
              <table className=" w-full border bg-white">
                <thead
                  className={`text-xs cursor-pointer bg-[#F9FAFB] text-black font-medium text-left sticky z-50 border-1`}
                >
                  <tr>
                    <th className="px-6 py-3">Year</th>
                    <th className="px-6 py-3">Age</th>
                    <th className="px-6 py-3">Spending</th>
                  </tr>
                </thead>
                <tbody className="print:text-sm">
                  {yearRange(
                    currentYear + tableInd * 16,
                    Math.min(
                      currentYear + (tableInd + 1) * 16 - 1,
                      currentYear + settings.maxYearsShown,
                    ),
                  ).map((line) => (
                    <tr className="">
                      <td className="px-6 py-1 w-[500px] font-bold">{line}</td>
                      <td className="px-6 py-1 w-[500px]">
                        {data.people
                          .map((p) => line - splitDate(p.birthday).year)
                          .join("/")}
                      </td>

                      <td className="px-2 py-1 w-[500px]">
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
                  ))}
                </tbody>
              </table>
            </div>
          ),
      )}
    </div>
  );
};

export default SpendingTable;
