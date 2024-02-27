import { TrashIcon } from "@heroicons/react/24/outline";
import calculate from "../calculator/calculate";
import title from "../calculator/title";
import Input from "./Inputs/Input";
import { splitDate } from "../utils";
import Confirm from "./Confirm";
import { useState } from "react";
import StackedChart from "./Chart";

const yearRange: (start: number, end: number) => number[] = (start, end) => {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const print = (a: number | string) => {
  if (typeof a === "number") {
    return `${formatter.format(a)}`;
  }
  return a;
};

const ResultTable = ({
  data,
  settings,
  removeScenario,
  fullScreen,
  name,
}: {
  data: IncomeMapData;
  settings: ScenarioSettings;
  removeScenario: any;
  name?: string;
  fullScreen: boolean;
  id: number;
}) => {
  if (!data) return null;
  const startYear = new Date().getFullYear();
  const [removeOpen, setRemoveOpen] = useState(false);
  const [highlightColumn, setHighlightColumn] = useState(-1);
  const updateHighlightColumn = (i: number) => {
    if (highlightColumn != i) setHighlightColumn(i);
    else setHighlightColumn(-1);
  };
  return (
    <div className="rounded-xl border-[#EAECF0] border">
      {name && (
        <div
          className={`flex p-5 py-8 gap-5 items-center justify-between sticky ${fullScreen ? "top-[45px]" : "top-[115px]"} bg-white h-32`}
        >
          <div className="text-[#101828] font-semibold text-[18px] print:hidden">
            {name || " "}
          </div>
          <div className="hidden print:block"></div>
          <div className="flex gap-5 ">
            {data.people.length > 1 &&
              data.people.map(
                (person, i) =>
                  settings.whoDies == i && (
                    <div className="w-36">
                      <Input
                        subtype="number"
                        vertical
                        disabled
                        label={`${person.name}'s death`}
                        value={settings.deathYears[i]?.toString()}
                        setValue={() => { }}
                      />
                    </div>
                  ),
              )}
            {data.people.length > 1 &&
              data.people.map(
                (person, i) =>
                  settings.whoDies == i &&
                  data.incomes.find(
                    (inc) => inc.type == "social-security" && inc.personId == i,
                  ) && (
                    <div className="w-44">
                      <Input
                        subtype="number"
                        vertical
                        disabled={true}
                        label={`${data.people[1 - i].name}' survivor SS age`}
                        tooltip={`Age when ${data.people[1 - i].name} starts receiving ${person.name}'s Social Security as a survivor`}
                        value={settings.deathYears[1 - i]?.toString()}
                        setValue={() => { }}
                      />
                    </div>
                  ),
              )}
            <div className="w-36">
              <Input
                label="Years"
                subtype="number"
                size="md"
                vertical
                disabled
                value={settings.maxYearsShown?.toString()}
                setValue={() => { }}
              />
            </div>
            <div className="w-36">
              <Input
                label="Inflation"
                disabled
                size="xs"
                vertical
                subtype="percent"
                value={settings.inflation?.toString()}
                setValue={() => { }}
              />
            </div>
            <div className="flex items-center">
              <TrashIcon
                className="h-6 w-6 text-[#FF6C47] cursor-pointer print:hidden"
                onClick={() => setRemoveOpen(true)}
              />
              <Confirm
                isOpen={removeOpen}
                onClose={() => setRemoveOpen(false)}
                onConfirm={() => {
                  removeScenario();
                  setRemoveOpen(false);
                }}
              >
                <TrashIcon className="text-slate-400 w-10 m-auto mb-5" />
                <div className="mb-5">
                  Are you sure you want to delete this scenario?
                </div>
              </Confirm>
            </div>
          </div>
        </div>
      )}
      <table className=" w-full">
        <thead
          className={`text-xs  cursor-pointer bg-[#F9FAFB] text-[#475467] font-medium text-left sticky z-50 ${fullScreen ? "top-[172px]" : "top-[243px]"} ${fullScreen ? "a" : "b"}`}
        >
          <td className="px-6 py-3" onClick={() => updateHighlightColumn(0)}>
            Year
          </td>
          <td className="px-6 py-3" onClick={() => updateHighlightColumn(1)}>
            Age
          </td>
          {data.incomes.map((_, i) => (
            <td
              className="px-6 py-3"
              onClick={() => updateHighlightColumn(i + 2)}
            >
              {title(data.incomes, data.people, i)
                .split("|")
                .map((i) => (
                  <span>
                    {i} <br />
                  </span>
                ))}
            </td>
          ))}
          <td
            className="px-6 py-3"
            onClick={() => updateHighlightColumn(data.incomes.length + 2)}
          >
            Total
          </td>
        </thead>
        <tbody className="text-sm">
          {yearRange(startYear, startYear + settings.maxYearsShown - 1).map(
            (currentYear, i) => (
              <tr
                className={`${i % 2 == 1 ? "bg-[#F9FAFB]" : "bg-white"} border border-[#EAECF0] hover:bg-slate-100`}
              >
                <td
                  className={`font-medium px-6 py-[0.6rem] ${highlightColumn == 0 ? "bg-slate-100" : ""}`}
                >
                  {currentYear}
                </td>
                <td
                  className={`font-medium px-6 py-[0.6rem] ${highlightColumn == 1 ? "bg-slate-100" : ""}`}
                >
                  {data.people
                    .map((p) => currentYear - splitDate(p.birthday).year)
                    .join("/")}
                </td>
                {data.incomes.map((income, i) => (
                  <td
                    className={`px-6 py-[0.6rem] text-[#475467] ${highlightColumn == i + 2 ? "bg-slate-100" : ""}`}
                  >
                    {print(
                      calculate({
                        people: data.people,
                        income,
                        startYear,
                        currentYear,
                        deathYears: settings.deathYears as any,
                        dead: settings.whoDies,
                        inflation: settings.inflation,
                        incomes: data.incomes,
                        ssSurvivorAge: settings.ssSurvivorAge,
                      }),
                    )}
                  </td>
                ))}
                <td
                  className={`font-medium px-6 py-[0.6rem] text-[#475467] ${highlightColumn == data.incomes.length + 2 ? "bg-slate-200" : ""}`}
                >
                  {formatter.format(
                    data?.incomes
                      .map(
                        (income) =>
                          calculate({
                            people: data.people,
                            income,
                            startYear,
                            currentYear,
                            deathYears: settings.deathYears as any,
                            dead: settings.whoDies,
                            inflation: settings.inflation,
                            incomes: data.incomes,
                            ssSurvivorAge: settings.ssSurvivorAge,
                          }) as any,
                      )
                      .filter((t) => typeof t === "number")
                      .reduce((a, b) => a + b, 0)
                      .toFixed(0),
                  )}
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
      <div className="break-after-page"></div>
      <div className="mt-10"></div>
      <StackedChart
        years={yearRange(startYear, startYear + settings.maxYearsShown - 1)}
        incomes={data.incomes.map((income, i) => ({
          name: title(data.incomes, data.people, i),
          data: yearRange(
            startYear,
            startYear + settings.maxYearsShown - 1,
          ).map((year) =>
            Math.round(
              calculate({
                people: data.people,
                income,
                startYear,
                currentYear: year,
                deathYears: settings.deathYears as any,
                dead: settings.whoDies,
                inflation: settings.inflation,
                incomes: data.incomes,
                ssSurvivorAge: settings.ssSurvivorAge,
              }),
            ),
          ),
        }))}
      />
    </div>
  );
};

export default ResultTable;
