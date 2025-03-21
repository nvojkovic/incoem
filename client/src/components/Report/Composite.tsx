import { getTaxRate, printNumber, splitDate, yearRange } from "src/utils";
import Header from "./Header";
import calculate from "src/calculator/calculate";
import { jointTable, makeTable } from "../Longevity/calculate";
import { calculateSpendingYear } from "../Spending/calculate";
import {
  Income,
  PrintClient,
  RetirementSpendingSettings,
  ScenarioSettings,
} from "src/types";

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
  const height = 100; //Math.floor(scenario.maxYearsShown / 2);

  const tables = scenario.people.map((person) => makeTable(person));
  const joint =
    scenario.people.length > 1
      ? jointTable(scenario.people[0], scenario.people[1])
      : [];

  const divisionFactor =
    client.liveSettings.monthlyYearly === "monthly" ? 12 : 1;
  return (
    <div className="mx-10 flex justify-center flex-col pt-6">
      <Header client={client} scenario={scenario} />
      <div className="text-2xl mx-auto mb-5">Composite</div>
      <div className="flex justify-between flex-wrap">
        {[0, 1, 2, 3, 4].map((tableInd) => {
          return (
            currentYear + scenario.maxYearsShown >
            currentYear + tableInd * height && (
              <div className="w-full">
                <table className="bg-white !text-sm w-full">
                  <thead
                    className={`text-xs cursor-pointer bg-[#F9FAFB] text-black font-medium text-left sticky z-50 border-1 print:border-b-black print:border-b-2`}
                  >
                    <tr>
                      <th className="px-2 py-3">Year</th>
                      <th className="px-2 py-3 border-r border-black border-solid">
                        Age
                      </th>

                      {client.longevityFlag &&
                        scenario.people.every((p) => p.sex) &&
                        scenario.people.map((person) => (
                          <th
                            className={`px-2 py-3 text-center ${scenario.people.length == 1 ? "border-r border-black" : ""}`}
                          >
                            {person.name} <br /> alive
                          </th>
                        ))}
                      {client.longevityFlag &&
                        scenario.people.every((p) => p.sex) &&
                        scenario.people.length > 1 && (
                          <th
                            className={`px-2 py-3 text-center ${scenario.people.length > 1 ? "border-r border-black" : ""}`}
                          >
                            At least one <br /> alive
                          </th>
                        )}
                      <th className="px-2 py-3">Income</th>

                      {client.taxesFlag && scenario.taxType == "Post-Tax" && (
                        <th className="px-2 py-3">Taxes</th>
                      )}

                      {client.taxesFlag && scenario.taxType == "Post-Tax" && (
                        <th
                          className={`px-2 py-3 ${!client.needsFlag && client.stabilityRatioFlag && "border-r border-gray-700"}`}
                        >
                          Post-Tax Income
                        </th>
                      )}
                      {client.needsFlag && (
                        <th className="px-2 py-3">Spending</th>
                      )}
                      {client.needsFlag && (
                        <th className="px-2 py-3 border-r border-black">Gap</th>
                      )}
                      {client.stabilityRatioFlag && (
                        <th className="px-2 py-3 text-center">
                          Income <br /> Stability
                        </th>
                      )}
                      {client.stabilityRatioFlag && client.needsFlag && (
                        <th className="px-2 py-3 text-center">
                          Spending <br /> Stability
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="print:text-sm">
                    {yearRange(
                      currentYear + tableInd * height,
                      Math.min(
                        currentYear + (tableInd + 1) * height - 1,
                        currentYear + scenario.maxYearsShown,
                      ),
                    ).map((line, index) => {
                      const startYear = new Date().getFullYear();
                      const calculateOne = (
                        income: Income,
                        currentYear: number,
                      ) =>
                        calculate({
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

                      const needs =
                        calculateSpendingYear(
                          {
                            people: scenario.people,
                            incomes: scenario.incomes,
                            version: 1,
                          },
                          spending,
                          scenario,
                          line,
                        ) / divisionFactor;
                      const income = scenario.incomes
                        .filter((income) => income.enabled)
                        .map(
                          (income) =>
                            calculateOne(income, line).amount / divisionFactor,
                        )
                        .filter((t) => typeof t === "number")
                        .reduce((a, b) => a + b, 0);
                      const stableIncome = scenario.incomes
                        .filter((item) => item.stable)
                        .filter((income) => income.enabled)
                        .map(
                          (income) =>
                            calculateOne(income, line).amount / divisionFactor,
                        )
                        .filter((t) => typeof t === "number")
                        .reduce((a, b) => a + b, 0);
                      const stabilityRatio = Math.round(
                        (stableIncome / income) * 100,
                      );
                      const spendingStability = Math.round(
                        (stableIncome / needs) * 100,
                      );

                      const taxRate = getTaxRate(client, scenario, line);
                      const taxes = income * taxRate;
                      const gap = income - needs - taxes;

                      return (
                        <tr
                          className={`${index % 2 == 0 ? "bg-[#F9FAFB]" : "bg-white"} border-y border-[#EAECF0]`}
                        >
                          <td className="px-2 py-[6px] font-bold">{line}</td>
                          <td className="px-2 py-1 border-r border-black">
                            {scenario.people
                              .map((p) => line - splitDate(p.birthday).year)
                              .join("/")}
                          </td>

                          {client.longevityFlag &&
                            scenario.people.every((p) => p.sex) &&
                            scenario.people.map((_, i) => (
                              <td
                                className={`px-2 py-[6px] text-center ${scenario.people.length == 1 ? "border-r border-black" : ""}`}
                              >
                                {Math.round(
                                  (tables[i].table.find(
                                    (entry) => entry.year === line,
                                  )?.probability || 0) * 100,
                                )}
                                %
                              </td>
                            ))}
                          {client.longevityFlag &&
                            scenario.people.every((p) => p.sex) &&
                            scenario.people.length > 1 && (
                              <td
                                className={`px-2 py-[6px] text-center ${scenario.people.length > 1 ? "border-r border-black" : ""}`}
                              >
                                {Math.round(
                                  (joint.find((entry) => entry.year === line)
                                    ?.oneAlive || 0) * 100,
                                )}
                                %
                              </td>
                            )}
                          <td className="px-2 py-1">{printNumber(income)}</td>
                          {client.taxesFlag &&
                            scenario.taxType == "Post-Tax" && (
                              <td className="px-2 py-1">
                                {printNumber(taxes)}
                              </td>
                            )}
                          {client.taxesFlag &&
                            scenario.taxType == "Post-Tax" && (
                              <td
                                className={`px-2 py-1 ${!client.needsFlag && client.stabilityRatioFlag && "border-r border-gray-700"}`}
                              >
                                {printNumber(income - taxes)}
                              </td>
                            )}
                          {client.needsFlag && (
                            <td className="px-2 py-1">{printNumber(needs)}</td>
                          )}
                          {client.needsFlag && (
                            <td
                              className={`px-2 py-1 ${gap >= 0 ? "text-green-500" : "text-red-500"}  border-r border-black`}
                            >
                              {printNumber(gap)}
                            </td>
                          )}
                          {client.stabilityRatioFlag && (
                            <td className="px-2 py-1 text-center">
                              {stabilityRatio}%
                            </td>
                          )}
                          {client.stabilityRatioFlag && client.needsFlag && (
                            <td className="px-2 py-1 text-center">
                              {spendingStability}%
                            </td>
                          )}
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
