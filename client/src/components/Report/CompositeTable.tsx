import { getTaxRate, printNumber, splitDate, yearRange } from "src/utils";
import { jointTable, makeTable } from "../Longevity/calculate";
import calculate from "src/calculator/calculate";
import { useFullscreen } from "src/hooks/useFullScreen";
import { calculateSpendingYear } from "../Spending/calculate";
import { Client, Income, ScenarioSettings, SelectedColumn } from "src/types";

interface Props {
  scenario: ScenarioSettings;
  client: Client;
  selectedYear?: number;
  selectedColumn?: SelectedColumn;
  setSelectedColumn?: any;
  setSelectedYear?: any;
}

const CompositeTable = ({
  scenario,
  client,
  setSelectedYear,
  selectedYear,
  setSelectedColumn,
  selectedColumn,
}: Props) => {
  const currentYear = new Date().getFullYear();
  const height = 100;
  const { isFullscreen } = useFullscreen();

  const tables = scenario.people.map((person) => makeTable(person));
  const joint =
    scenario.people.length > 1
      ? jointTable(scenario.people[0], scenario.people[1])
      : [];
  console.log("joint", joint);

  const setColumn = (name: string) => () => {
    console.log(name);
    selectedColumn?.type === name
      ? setSelectedColumn({ type: "none", id: 0 })
      : setSelectedColumn({ type: name, id: 0 });
  };
  const setRow = (year: number) => () => {
    selectedYear === year ? setSelectedYear(-1) : setSelectedYear(year);
  };

  const divisionFactor =
    client.liveSettings.monthlyYearly === "monthly" ? 12 : 1;
  return (
    <div className="flex justify-between flex-wrap">
      {[0, 1, 2, 3, 4].map((tableInd) => {
        return (
          currentYear + scenario.maxYearsShown >
          currentYear + tableInd * height && (
            <div className="w-full">
              <table className="border bg-white !text-sm w-full">
                <thead
                  className={`text-xs cursor-pointer bg-[#F9FAFB] text-black font-medium text-left sticky z-50 border-1 ${isFullscreen ? "top-[111px]" : "top-[184px]"} border-separate`}
                >
                  <tr>
                    <th
                      className={`px-6 py-[0.45rem] font-medium ${selectedColumn?.type === "year" ? "!bg-slate-200" : ""}`}
                      onClick={setColumn("year")}
                    >
                      Year
                    </th>
                    <th
                      className={` font-medium ${selectedColumn?.type === "age" ? "!bg-slate-200" : ""} border-r border-gray-700 border-solid`}
                      onClick={setColumn("age")}
                    >
                      <div className="px-2 h-full w-full">Age</div>
                    </th>

                    {client.longevityFlag &&
                      scenario.people.every((p) => p.sex) &&
                      scenario.people.map((person, i) => (
                        <th
                          className={`px-2 py-[0.45rem] text-center font-medium ${selectedColumn?.type === `${i}-alive` ? "!bg-slate-200" : ""} ${scenario.people.length == 1 ? "border-r border-gray-700" : ""}`}
                          onClick={setColumn(`${i}-alive`)}
                        >
                          {person.name} <br /> alive
                        </th>
                      ))}
                    {client.longevityFlag &&
                      scenario.people.every((p) => p.sex) &&
                      scenario.people.length > 1 && (
                        <th
                          className={`px-2 py-[0.45rem] text-center font-medium ${selectedColumn?.type === "joint-alive" ? "!bg-slate-200" : ""} ${scenario.people.length > 1 ? "border-r border-gray-700" : ""}`}
                          onClick={setColumn("joint-alive")}
                        >
                          At least one <br /> alive
                        </th>
                      )}
                    <th
                      className={`px-2 font-medium ${selectedColumn?.type === "total" ? "!bg-slate-200" : ""}`}
                      onClick={setColumn("total")}
                    >
                      Income
                    </th>

                    {client.taxesFlag && scenario.taxType == "Post-Tax" && (
                      <th
                        className={`px-2 font-medium  ${selectedColumn?.type === "taxes" ? "!bg-slate-200" : ""}`}
                        onClick={setColumn("taxes")}
                      >
                        Taxes
                      </th>
                    )}

                    {client.taxesFlag && scenario.taxType == "Post-Tax" && (
                      <th
                        className={`px-2 font-medium  ${selectedColumn?.type === "posttax" ? "!bg-slate-200" : ""}`}
                        onClick={setColumn("posttax")}
                      >
                        Post-Tax Income
                      </th>
                    )}

                    {client.needsFlag && (
                      <th
                        className={`px-2 font-medium ${selectedColumn?.type === "spending" ? "!bg-slate-200" : ""}`}
                        onClick={setColumn("spending")}
                      >
                        Spending
                      </th>
                    )}
                    {client.needsFlag && (
                      <th
                        className={`px-2 font-medium border-r border-gray-700  ${selectedColumn?.type === "gap" ? "!bg-slate-200" : ""}`}
                        onClick={setColumn("gap")}
                      >
                        Gap
                      </th>
                    )}
                    {client.stabilityRatioFlag && (
                      <th
                        className={`px-2  font-medium text-center ${selectedColumn?.type === "income-stability" ? "!bg-slate-200" : ""}`}
                        onClick={setColumn("income-stability")}
                      >
                        Income <br /> Stability
                      </th>
                    )}
                    {client.stabilityRatioFlag && client.needsFlag && (
                      <th
                        className={`px-2 font-medium text-center py-[0.45rem] ${selectedColumn?.type === "spending-stability" ? "!bg-slate-200" : ""}`}
                        onClick={setColumn("spending-stability")}
                      >
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
                    const needs =
                      calculateSpendingYear(
                        {
                          people: scenario.people,
                          incomes: scenario.incomes,
                          version: 1,
                        },
                        client.spending,
                        scenario,
                        line,
                      ) / divisionFactor;
                    const income = client.incomes
                      .filter((income) => income.enabled)
                      .map((income) => calculateOne(income, line).amount)
                      .filter((t) => typeof t === "number")
                      .reduce((a, b) => a + b, 0);

                    const stableIncome = client.incomes
                      .filter((item) => item.stable)
                      .filter((income) => income.enabled)
                      .map((income) => calculateOne(income, line).amount)
                      .filter((t) => typeof t === "number")
                      .reduce((a, b) => a + b, 0);
                    const stabilityRatio = Math.round(
                      (stableIncome / income) * 100,
                    );

                    const taxRate = getTaxRate(client, scenario, line);

                    const spendingStability = Math.round(
                      ((stableIncome * (1 - taxRate)) / needs) * 100,
                    );

                    const taxes = income * taxRate;

                    const gap = income - needs - taxes;
                    return (
                      <tr
                        className={`${index % 2 == 1 ? "bg-[#F9FAFB]" : "bg-white"} border-y border-[#EAECF0] ${selectedYear === line ? "!bg-slate-200" : ""}`}
                        onClick={setRow(line)}
                      >
                        <td
                          className={`px-6 py-[6px] font-medium ${selectedColumn?.type === "year" ? "!bg-slate-200" : ""}`}
                        >
                          {line}
                        </td>
                        <td
                          className={`px-2 py-[0.45rem] font-medium border-r border-gray-700 ${selectedColumn?.type === "age" ? "!bg-slate-200" : ""}`}
                        >
                          {scenario.people
                            .map((p) => line - splitDate(p.birthday).year)
                            .join("/")}
                        </td>

                        {client.longevityFlag &&
                          scenario.people.every((p) => p.sex) &&
                          scenario.people.map((_, i) => (
                            <td
                              className={`px-2 py-[6px] text-center ${selectedColumn?.type === `${i}-alive` ? "!bg-slate-200" : ""} ${scenario.people.length == 1 ? "border-r border-gray-700" : ""}`}
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
                              className={`px-2 py-[6px] text-center ${selectedColumn?.type === `joint-alive` ? "!bg-slate-200" : ""} ${scenario.people.length > 1 ? "border-r border-gray-700" : ""}`}
                            >
                              {Math.round(
                                (joint.find((entry) => entry.year === line)
                                  ?.oneAlive || 0) * 100,
                              )}
                              %
                            </td>
                          )}
                        <td
                          className={`px-2 py-1 ${selectedColumn?.type === "total" ? "!bg-slate-200" : ""}`}
                        >
                          {printNumber(income)}
                        </td>

                        {client.taxesFlag && scenario.taxType == "Post-Tax" && (
                          <td
                            className={`px-2 py-1 ${selectedColumn?.type === "taxes" ? "!bg-slate-200" : ""}`}
                          >
                            {printNumber(taxes)}
                          </td>
                        )}

                        {client.taxesFlag && scenario.taxType == "Post-Tax" && (
                          <td
                            className={`px-2 py-1 ${selectedColumn?.type === "posttax" ? "!bg-slate-200" : ""}`}
                          >
                            {printNumber(income - taxes)}
                          </td>
                        )}
                        {client.needsFlag && (
                          <td
                            className={`px-2 py-1 ${selectedColumn?.type === "spending" ? "!bg-slate-200" : ""}`}
                          >
                            {printNumber(needs)}
                          </td>
                        )}
                        {client.needsFlag && (
                          <td
                            className={`px-2 py-1 border-r border-gray-700 ${gap >= 0 ? "text-green-500" : "text-red-500"} ${selectedColumn?.type === "gap" ? "!bg-slate-200" : ""}`}
                          >
                            {printNumber(gap)}
                          </td>
                        )}
                        {client.stabilityRatioFlag && (
                          <td
                            className={`px-2 py-[6px] text-center ${selectedColumn?.type === `income-stability` ? "!bg-slate-200" : ""}`}
                          >
                            {stabilityRatio}%
                          </td>
                        )}
                        {client.stabilityRatioFlag && client.needsFlag && (
                          <td
                            className={`px-2 py-[6px] text-center ${selectedColumn?.type === `spending-stability` ? "!bg-slate-200" : ""}`}
                          >
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
  );
};

export default CompositeTable;
