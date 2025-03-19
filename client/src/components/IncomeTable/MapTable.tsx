import { Tooltip } from "flowbite-react";
import calculate from "src/calculator/calculate";
import title from "src/calculator/title";
import { useFullscreen } from "src/hooks/useFullScreen";
import { Client, Income, ScenarioSettings, SelectedColumn } from "src/types";
import { getTaxRate, printNumber, yearRange } from "src/utils";

interface Props {
  client: Client;
  selectedYear?: number;
  selectedColumn?: SelectedColumn;
  setSelectedColumn?: any;
  setSelectedYear?: any;
  print?: boolean;
  columns: { name: string; key: string }[];
  data: {
    value: React.ReactElement;
    key: string;
    tooltip?: React.ReactElement;
    selectedClass?: string;
    normalClass?: string;
  }[][];
}
const MapTable = ({
  setSelectedYear,
  selectedYear,
  setSelectedColumn,
  print,
  selectedColumn,
  client,
  columns,
  data,
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

  return (
    <div className="flex justify-between flex-wrap">
      {[0, 1, 2, 3, 4].map((tableInd) => {
        return (
          currentYear + client.liveSettings.maxYearsShown >
          currentYear + tableInd * height && (
            <div className="w-full">
              <table className="border bg-white !text-sm w-full">
                <thead
                  className={`text-xs cursor-pointer bg-[#F9FAFB] text-black font-medium text-left sticky z-50 border-1 ${isFullscreen ? "top-[111px]" : !print && "top-[184px]"} border-separate`}
                >
                  <tr>
                    {columns.map(({ name, key }) => {
                      return (
                        <th
                          className={`px-6 py-[0.45rem] font-medium text-black`}
                          onClick={setColumn(key)}
                        >
                          {name}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="print:text-sm">
                  {yearRange(
                    currentYear + tableInd * height,
                    Math.min(
                      currentYear + (tableInd + 1) * height - 1,
                      currentYear + client.liveSettings.maxYearsShown - 1,
                    ),
                  ).map((line, index) => {
                    const tableLine = data[index];
                    return (
                      <tr
                        className={`${index % 2 == 1 ? "bg-[#F9FAFB]" : "bg-white"} border-y border-[#EAECF0] hover:bg-slate-100`}
                        onClick={setRow(line)}
                      >
                        {tableLine.map((item) => {
                          const selected =
                            selectedYear == line ||
                            selectedColumn?.type === item.key;
                          return (
                            <td
                              className={`px-2 py-[0.45rem] text-[#475467] ${selected
                                  ? item.selectedClass || "bg-slate-200"
                                  : item.normalClass || ""
                                } ${!!item.tooltip ? "cursor-pointer" : ""}`}
                            >
                              <Tooltip
                                content={item.tooltip}
                                theme={{ target: "" }}
                                style="light"
                                arrow={false}
                                hidden={!!item.tooltip}
                                className={`border-2 border-main-orange ${!!item.tooltip ? "" : "hidden"} w-72`}
                                placement="bottom"
                              >
                                {item.value}
                              </Tooltip>
                            </td>
                          );
                        })}
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

export const IncomeTooltip = ({
  scenario,
  selectedIncomes,
  year,
  client,
}: {
  scenario: ScenarioSettings;
  selectedIncomes: Income[];
  year: number;
  client: Client;
}) => {
  if (!selectedIncomes.length) return null;
  const divisionFactor =
    client.liveSettings.monthlyYearly === "monthly" ? 12 : 1;

  const taxRate = getTaxRate(client, scenario, year);
  const calculateOne = (income: Income, currentYear: number) => {
    const result = calculate({
      people: scenario.people,
      income,
      startYear: new Date().getFullYear(),
      currentYear,
      deathYears: scenario.deathYears as any,
      dead: scenario.whoDies,
      inflation: scenario.inflation,
      incomes: scenario.incomes.filter((income) => income.enabled),
      ssSurvivorAge: scenario.ssSurvivorAge,
      inflationType: scenario.inflationType,
    });

    return {
      ...result,
      amount: result.amount / divisionFactor,
    };
  };
  return (
    <>
      <div className="text-lg mb-2">{year}</div>
      {selectedIncomes.map((income) => {
        const incomeIndex = scenario.incomes.findIndex(
          (inc) => inc.id === income.id,
        );
        return (
          <>
            {calculateOne(income, year).amount != 0 && (
              <div className="flex justify-between gap-3">
                <div className="font-bold">
                  {title(scenario.incomes, scenario.people, incomeIndex)}:{" "}
                </div>
                {printNumber(calculateOne(income, year).amount * (1 - taxRate))}{" "}
              </div>
            )}
          </>
        );
      })}
    </>
  );
};

export default MapTable;
