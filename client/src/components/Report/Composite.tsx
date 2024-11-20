import { formatter, splitDate, yearRange } from "src/utils";
import Header from "./Header";
import { calculateSpendingYear } from "../Spending/SpendingPage";
import calculate from "src/calculator/calculate";

const Composite = ({
  scenario,
  spending,
  client,
}: {
  scenario: ScenarioSettings;
  spending: RetirementSpendingSettings;
  client: PrintClient;
}) => {
  const currentYear = new Date().getFullYear();
  const height = Math.floor(scenario.maxYearsShown / 2);
  return (
    <div className="mx-10 flex justify-center flex-col mt-6">
      <Header client={client} scenario={scenario} />
      <div className="flex justify-between">
        {[0, 1, 2, 3, 4].map((tableInd) => {
          return (
            currentYear + scenario.maxYearsShown >
            currentYear + tableInd * height && (
              <div>
                <table className="border bg-white !text-sm w-full">
                  <thead
                    className={`text-xs cursor-pointer bg-[#F9FAFB] text-black font-medium text-left sticky z-50 border-1`}
                  >
                    <tr>
                      <th className="px-2 py-3">Year</th>
                      <th className="px-2 py-3">Age</th>
                      <th className="px-2 py-3">Income</th>
                      <th className="px-2 py-3">Spending</th>
                      <th className="px-2 py-3">Gap</th>
                      <th className="px-2 py-3">% of Income Stable</th>
                    </tr>
                  </thead>
                  <tbody className="print:text-sm">
                    {yearRange(
                      currentYear + tableInd * height,
                      Math.min(
                        currentYear + (tableInd + 1) * height - 1,
                        currentYear + scenario.maxYearsShown,
                      ),
                    ).map((line) => {
                      const startYear = new Date().getFullYear();
                      const calculateOne = (
                        income: Income,
                        currentYear: number,
                      ) =>
                        calculate({
                          people: scenario.data.people,
                          income,
                          startYear,
                          currentYear,
                          deathYears: scenario.deathYears as any,
                          dead: scenario.whoDies,
                          inflation: scenario.inflation,
                          incomes: scenario.data.incomes,
                          ssSurvivorAge: scenario.ssSurvivorAge,
                          inflationType: scenario.inflationType,
                        });

                      const needs = calculateSpendingYear(
                        scenario.data,
                        spending,
                        scenario,
                        line,
                      );
                      const income = scenario.data.incomes
                        .map((income) => calculateOne(income, line).amount)
                        .filter((t) => typeof t === "number")
                        .reduce((a, b) => a + b, 0);
                      const stableIncome = scenario.data.incomes
                        .filter((item) => item.stable)
                        .map((income) => calculateOne(income, line).amount)
                        .filter((t) => typeof t === "number")
                        .reduce((a, b) => a + b, 0);
                      const gap = income - needs;
                      const stabilityRatio = Math.round(
                        (stableIncome / income) * 100,
                      );
                      return (
                        <tr className="">
                          <td className="px-2 py-[6px] font-bold">{line}</td>
                          <td className="px-2 py-1">
                            {scenario.data.people
                              .map((p) => line - splitDate(p.birthday).year)
                              .join("/")}
                          </td>

                          <td className="px-2 py-1">
                            {formatter.format(income)}
                          </td>
                          <td className="px-2 py-1">
                            {formatter.format(needs)}
                          </td>
                          <td
                            className={`px-2 py-1 ${gap >= 0 ? "text-green-500" : "text-red-500"}`}
                          >
                            {formatter.format(gap)}
                          </td>
                          <td className="px-2 py-1">{stabilityRatio}%</td>
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
    </div>
  );
};

export default Composite;
