import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  PrinterIcon,
  QuestionMarkCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import calculate from "src/calculator/calculate";
import title from "src/calculator/title";
import Input from "src/components/Inputs/Input";
import {
  formatter,
  printNumber,
  printReport,
  splitDate,
  yearRange,
} from "src/utils";
import Confirm from "src/components/Confirm";
import { useMemo, useState } from "react";
import Button from "src/components/Inputs/Button";
import { Spinner, Tooltip } from "flowbite-react";
import IncomeModal from "src/components/Info/IncomeModal";
import { ColumnDef } from "@tanstack/react-table";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { arrayMove } from "@dnd-kit/sortable";

import React from "react";
import { useInfo } from "src/useData";
import { generateColumns } from "src/components/IncomeTable/tableData";
import { calculateSpendingYear } from "src/components/Spending/SpendingPage";
import DraggableTable from "./DraggableTable";

const ResultTable = ({
  client,
  settings,
  removeScenario,
  fullScreen,
  name,
  selectedYear,
  changeFullScreen,
  setSelectedYear,
  setSelectedColumn,
  selectedColumn,
  setSettings,
}: {
  client: Client;
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
  setSettings?: (data: any) => void;
}) => {
  const startYear = new Date().getFullYear();
  const [removeOpen, setRemoveOpen] = useState(false);
  const [printing, setPrinting] = useState(false);
  const incomes = settings.data.incomes.filter((inc) => inc.enabled);
  const [openModal, setOpenModal] = useState(-1);

  const columns = React.useMemo<ColumnDef<any>[]>(
    () => generateColumns(incomes, settings.data, selectedColumn),
    [selectedColumn, settings, selectedYear, settings.data],
  );
  const [columnOrder, setColumnOrder] = React.useState<string[]>(() =>
    columns.map((c) => c.id!),
  );

  const { updateIncomes } = useInfo();

  const print = async () => {
    setPrinting(true);
    const url = await printReport(client.id, settings.id);
    setPrinting(false);
    window.open(url, "_blank");
  };

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 1,
      },
    }),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  const calculateOne = (income: Income, currentYear: number) =>
    calculate({
      people: settings.data.people,
      income,
      startYear,
      currentYear,
      deathYears: settings.deathYears as any,
      dead: settings.whoDies,
      inflation: settings.inflation,
      incomes: incomes,
      ssSurvivorAge: settings.ssSurvivorAge,

      inflationType: settings.inflationType,
    });

  const tableData = useMemo(
    () =>
      yearRange(startYear, startYear + settings.maxYearsShown - 1).map(
        (currentYear) => ({
          year: currentYear,
          selectedColumn,
          age: settings.data.people
            .map((p) => currentYear - splitDate(p.birthday).year)
            .join("/"),
          ...Object.fromEntries(
            incomes.map((income, i) => {
              const result = calculate({
                people: settings.data.people,
                income,
                startYear,
                currentYear,
                deathYears: settings.deathYears as any,
                dead: settings.whoDies,
                inflation: settings.inflation,
                incomes: incomes,
                inflationType: settings.inflationType,
                ssSurvivorAge: settings.ssSurvivorAge,
              });
              return [
                title(incomes, settings.data.people, i),
                <div>
                  {result.note ? (
                    <Tooltip
                      content={result.note}
                      theme={{ target: "" }}
                      placement="top"
                      style="light"
                      className="!z-[50000] bg-white print:hidden"
                    >
                      <div className="cursor-pointer flex items-center gap-2 ">
                        {printNumber(result.amount)}
                        <QuestionMarkCircleIcon className="h-5 w-5 text-[#D0D5DD] print:hidden" />
                      </div>
                    </Tooltip>
                  ) : (
                    printNumber(result.amount)
                  )}
                </div>,
              ];
            }),
          ),
          total: (
            <div className="flex gap-2">
              <div className="w-20 relative">
                <Tooltip
                  content={(() => {
                    const needs = calculateSpendingYear(
                      settings.data,
                      client.spending,
                      settings,
                      currentYear,
                    );
                    const income = incomes
                      .map((income) => calculateOne(income, currentYear).amount)
                      .filter((t) => typeof t === "number")
                      .reduce((a, b) => a + b, 0);
                    const stableIncome = incomes
                      .filter((item) => item.stable)
                      .map((income) => calculateOne(income, currentYear).amount)
                      .filter((t) => typeof t === "number")
                      .reduce((a, b) => a + b, 0);
                    const gap = income - needs;
                    const stabilityRatio = Math.round(
                      (stableIncome / income) * 100,
                    );
                    const needsStable = Math.round(
                      (stableIncome / needs) * 100,
                    );
                    return (
                      <div className="z-[5000000] bg-white  sticky">
                        {client.spending && client.needsFlag && (
                          <>
                            <div>
                              Spending:{" "}
                              {client.spending && formatter.format(needs)}
                            </div>

                            <div>
                              Gap:{" "}
                              <span
                                className={
                                  gap < 0 ? "text-red-500" : "text-green-500"
                                }
                              >
                                {formatter.format(gap)}
                              </span>{" "}
                            </div>
                          </>
                        )}
                        {!isNaN(stabilityRatio) &&
                          client.stabilityRatioFlag && (
                            <div>
                              Stability Ratio:{" "}
                              {Math.round((stableIncome / income) * 100)}%
                            </div>
                          )}
                        {client.spending &&
                          client.stabilityRatioFlag &&
                          client.needsFlag && (
                            <div>Spending Stable: {needsStable}%</div>
                          )}
                      </div>
                    );
                  })()}
                  theme={{ target: "" }}
                  placement="left"
                  style="light"
                  arrow={false}
                  className={`border-2 border-main-orange bg-white print:hidden ${client.stabilityRatioFlag || client.needsFlag ? "" : "hidden"}`}
                >
                  <div className="cursor-pointer flex items-center gap-2 z-5000 ">
                    {printNumber(
                      incomes
                        .map(
                          (income) => calculateOne(income, currentYear).amount,
                        )
                        .filter((t) => typeof t === "number")
                        .reduce((a, b) => a + b, 0),
                    )}
                  </div>
                </Tooltip>
              </div>
            </div>
          ),
        }),
      ),
    [settings, settings.data],
  );

  const handleDragEnd = (moved: any) => {
    const { active, over } = moved;

    const oldIndex = columnOrder.indexOf(active.id as string);
    const newIndex = columnOrder.indexOf(over.id as string);
    if (
      newIndex === 0 ||
      newIndex === 1 ||
      newIndex == settings.data.incomes.length + 2
    )
      return;
    setColumnOrder((columnOrder) => {
      return arrayMove(columnOrder, oldIndex, newIndex); //this is just a splice util
    });
    if (active && over && active.id !== over.id) {
      if (setSettings) {
        const oldIndex = settings.data.incomes.findIndex(
          (x) => x.id == active.id,
        );
        const newIndex = settings.data.incomes.findIndex(
          (x) => x.id == over.id,
        );
        const incomes = arrayMove(settings.data.incomes, oldIndex, newIndex);
        console.log(
          "new ",
          oldIndex,
          newIndex,
          incomes.map((i) => i.id),
        );
        updateIncomes(incomes);
      }
    }
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToHorizontalAxis]}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <div className="rounded-xl border-[#EAECF0] border print:border-0 ">
        {name && (
          <div
            className={`z-[500] flex p-5 py-8 gap-5 items-center justify-between sticky ${fullScreen ? "top-[45px]" : "top-[115px]"} bg-white h-32 print:hidden`}
          >
            <div className="text-[#101828] font-semibold text-[18px]">
              {name || " "}
            </div>
            <div className="hidden print:block"></div>

            <div className="flex gap-5 items-end print:hidden">
              {settings.data.people.length > 1 &&
                settings.data.people.map(
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
                  subtype="text"
                  size="xs"
                  vertical
                  disabled
                  value={settings.maxYearsShown}
                  setValue={() => {}}
                />
              </div>
              <div className="print:mr-[-20px]">
                <Input
                  label="Inflation"
                  disabled
                  size="xs"
                  vertical
                  subtype="text"
                  value={`${settings.inflation?.toString()}%`}
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
                    className="h-6 w-6 text-red-500 cursor-pointer "
                    onClick={() => setRemoveOpen(true)}
                  />
                </Button>
                <Confirm
                  isOpen={removeOpen}
                  onClose={() => setRemoveOpen(false)}
                  onConfirm={() => {
                    if (removeScenario) removeScenario();
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
        {!removeScenario &&
          incomes?.map((income) => (
            <IncomeModal
              income={income}
              setOpen={() => setOpenModal(-1)}
              open={openModal === income.id}
              i={income.id}
            />
          ))}
        <div className="flex flex-col print:flex-col-reverse">
          <DraggableTable
            columns={columns}
            setSelectedYear={setSelectedYear}
            fullScreen={fullScreen}
            tableData={tableData}
            selectedYear={selectedYear}
            columnOrder={columnOrder}
            setColumnOrder={setColumnOrder}
            setSelectedColumn={setSelectedColumn}
            selectedColumn={selectedColumn}
            setOpenModal={setOpenModal}
          />
        </div>
      </div>
    </DndContext>
  );
};

export default ResultTable;
