import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  PrinterIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import calculate from "../calculator/calculate";
import title from "../calculator/title";
import Input from "./Inputs/Input";
import { splitDate } from "../utils";
import Confirm from "./Confirm";
import { useState } from "react";
import StackedChart from "./Chart";
import Button from "./Inputs/Button";
import { Spinner } from "flowbite-react";
import IncomeModal from "./Info/IncomeModal";

const yearRange: (start: number, end: number) => number[] = (start, end) => {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const printNumber = (a: number | string) => {
  if (typeof a === "number") {
    return `${formatter.format(a)}`;
  }
  return a;
};

const ResultTable = ({
  data,
  clientId,
  settings,
  removeScenario,
  fullScreen,
  name,
  selectedYear,
  changeFullScreen,
  setSelectedYear,
  setSelectedColumn,
  selectedColumn,
  toPrint,
}: {
  data: IncomeMapData;
  clientId: any;
  settings: ScenarioSettings;
  removeScenario: any;
  name?: string;
  fullScreen: boolean;
  id: number;
  selectedYear: number;
  setSelectedYear: any;
  selectedColumn: SelectedColumn;
  changeFullScreen: any;
  setSelectedColumn: any;
  toPrint?: boolean;
}) => {
  if (!data) return null;
  const startYear = new Date().getFullYear();
  const [removeOpen, setRemoveOpen] = useState(false);
  const [printing, setPrinting] = useState(false);
  const incomes = data.incomes.filter((inc) => inc.enabled);
  const [openModal, setOpenModal] = useState(-1);
  const [timer, setTimer] = useState<any>(0);

  const print = async () => {
    setPrinting(true);
    let pdfFile;
    pdfFile = await fetch(
      import.meta.env.VITE_API_URL +
        "print/client/pdf/" +
        clientId +
        "/" +
        Math.max(settings.id, 0).toString(),
    ).then((res) => res.json());
    setPrinting(false);
    window.open(
      import.meta.env.VITE_API_URL + "report/?report=" + pdfFile.file,
      "_blank",
    );
  };

  return (
    <div className="rounded-xl border-[#EAECF0] border print:border-0">
      {name && (
        <div
          className={`flex p-5 py-8 gap-5 items-center justify-between sticky ${fullScreen ? "top-[45px]" : "top-[115px]"} bg-white h-32`}
        >
          <div className="text-[#101828] font-semibold text-[18px]">
            {name || " "}
          </div>
          <div className="hidden print:block"></div>
          {toPrint && (
            <div>
              <table className="border border-gray-400">
                <tbody>
                  <tr className="border-b border-gray-400">
                    <td className="border border-gray-400 p-2">Inflation</td>
                    <td className="p-2">{settings.inflation.toString()}%</td>
                  </tr>

                  {data.people.length > 1 &&
                    data.people.map(
                      (person, i) =>
                        settings.whoDies == i && (
                          <tr>
                            <td className="border border-gray-400 p-2">{`${person.name}'s Death`}</td>
                            <td className="p-2">
                              {settings.deathYears[i]?.toString()}
                            </td>
                          </tr>
                        ),
                    )}
                </tbody>
              </table>
            </div>
          )}
          {!toPrint && (
            <div className="flex gap-5 items-end">
              {data.people.length > 1 &&
                data.people.map(
                  (person, i) =>
                    settings.whoDies == i && (
                      <div className="w-36" key={person.id}>
                        <Input
                          subtype="number"
                          vertical
                          disabled
                          label={`${person.name}'s Death`}
                          value={settings.deathYears[i]?.toString()}
                          setValue={() => {}}
                        />
                      </div>
                    ),
                )}

              <div className="">
                <Input
                  label="Years"
                  subtype="number"
                  size="xs"
                  vertical
                  disabled
                  value={settings.maxYearsShown?.toString()}
                  setValue={() => {}}
                />
              </div>
              <div className="print:mr-[-20px]">
                <Input
                  label="Inflation"
                  disabled
                  size="xs"
                  vertical
                  subtype="percent"
                  value={settings.inflation?.toString()}
                  setValue={() => {}}
                />
              </div>
              <div className="print:hidden">
                <Button type="secondary" onClick={changeFullScreen}>
                  <div className="flex gap-3">
                    <div className="flex items-center">
                      {fullScreen ? (
                        <ArrowsPointingInIcon className="h-6 w-6" />
                      ) : (
                        <ArrowsPointingOutIcon className="h-6 w-6" />
                      )}
                    </div>
                  </div>
                </Button>
              </div>
              <div className="print:hidden">
                <Button type="secondary" onClick={print}>
                  <div className="flex gap-2">
                    <PrinterIcon className="h-6 w-6" />
                    {printing && <Spinner className="h-5" />}
                  </div>
                </Button>
              </div>
              <div className="flex items-center print:hidden">
                <Button type="secondary">
                  <TrashIcon
                    className="h-6 w-6 text-[#FF6C47] cursor-pointer "
                    onClick={() => setRemoveOpen(true)}
                  />
                </Button>
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
          )}
        </div>
      )}
      {!toPrint &&
        incomes?.map((income, i) => (
          <IncomeModal
            income={income}
            setOpen={() => setOpenModal(-1)}
            open={openModal === i}
            i={i}
          />
        ))}
      <table className=" w-full">
        <thead
          className={`text-xs cursor-pointer bg-[#F9FAFB] text-black font-medium text-left sticky z-50 print:border-transparent print:border-b-black print:border-2 border-1 ${fullScreen ? "top-[172px]" : "top-[243px]"} ${fullScreen ? "a" : "b"}`}
        >
          <td
            className="px-6 py-3"
            onClick={() =>
              selectedColumn.type === "year"
                ? setSelectedColumn({ type: "none", id: 0 })
                : setSelectedColumn({ type: "year", id: 0 })
            }
          >
            Year
          </td>
          <td
            className="px-6 py-3"
            onClick={() =>
              selectedColumn.type === "age"
                ? setSelectedColumn({ type: "none", id: 0 })
                : setSelectedColumn({ type: "age", id: 0 })
            }
          >
            Age
          </td>
          {incomes.map((income, i) => (
            <td
              className="px-6 py-3 select-none"
              onClick={(e) => {
                if (e.detail === 1) {
                  setTimer(
                    setTimeout(() => {
                      selectedColumn.type === "income" &&
                      selectedColumn.id == income.id
                        ? setSelectedColumn({ type: "none", id: 0 })
                        : setSelectedColumn({ type: "income", id: income.id });
                    }, 200),
                  );
                }
                if (e.detail === 2) {
                  clearTimeout(timer);
                  setOpenModal(i);
                }
              }}
              onDoubleClick={() => {
                clearTimeout(timer);
                setOpenModal(i);
              }}
            >
              {title(incomes, data.people, i)
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
            onClick={() =>
              selectedColumn.type === "total"
                ? setSelectedColumn({ type: "none", id: 0 })
                : setSelectedColumn({ type: "total", id: 0 })
            }
          >
            Total
          </td>
        </thead>
        <tbody className="text-sm">
          {yearRange(startYear, startYear + settings.maxYearsShown - 1).map(
            (currentYear, i) => (
              <tr
                className={`${i % 2 == 1 ? "bg-[#F9FAFB]" : "bg-white"} border-y border-[#EAECF0] hover:bg-slate-100 ${selectedYear === currentYear && "!bg-slate-200"}`}
                onClick={() =>
                  currentYear == selectedYear
                    ? setSelectedYear(0)
                    : setSelectedYear(currentYear)
                }
              >
                <td
                  className={`font-medium px-6 py-[0.45rem] ${selectedColumn.type == "year" ? "bg-slate-200" : ""}`}
                >
                  {currentYear}
                </td>
                <td
                  className={`font-medium px-6 py-[0.45rem] ${selectedColumn.type == "age" ? "bg-slate-200" : ""}`}
                >
                  {data.people
                    .map((p) => currentYear - splitDate(p.birthday).year)
                    .join("/")}
                </td>
                {incomes.map((income) => (
                  <td
                    className={`px-6 py-[0.45rem] text-[#475467] ${selectedColumn.type == "income" && selectedColumn.id == income.id ? "bg-slate-200" : ""}`}
                  >
                    {printNumber(
                      calculate({
                        people: data.people,
                        income,
                        startYear,
                        currentYear,
                        deathYears: settings.deathYears as any,
                        dead: settings.whoDies,
                        inflation: settings.inflation,
                        incomes: incomes,
                        ssSurvivorAge: settings.ssSurvivorAge,
                      }),
                    )}
                  </td>
                ))}
                <td
                  className={`font-medium px-6 py-[0.45rem] text-black ${selectedColumn.type == "total" ? "bg-slate-200" : ""}`}
                >
                  {formatter.format(
                    incomes
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
                            incomes: incomes,
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
        incomes={incomes.map((income, i) => ({
          name: title(incomes, data.people, i),
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
                incomes: incomes,
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
