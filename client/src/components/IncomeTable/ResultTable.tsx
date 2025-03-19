import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import calculate from "src/calculator/calculate";
import title from "src/calculator/title";
import { getTaxRate, printNumber, splitDate, yearRange } from "src/utils";
import { useMemo, useState } from "react";
import { Tooltip } from "flowbite-react";
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
import { useInfo } from "src/hooks/useData";
import { generateColumns } from "src/components/IncomeTable/tableData";
import DraggableTable from "./DraggableTable";
import { calculateSpendingYear } from "../Spending/calculate";
import { Client, Income, ScenarioSettings, SelectedColumn } from "src/types";
import { useFullscreen } from "src/hooks/useFullScreen";
import LongevityTooltip from "./LongevityTooltip";

const ResultTable = ({
  client,
  settings,
  selectedYear,
  setSelectedYear,
  setSelectedColumn,
  selectedColumn,
  setSettings,
}: {
  client: Client;
  settings: ScenarioSettings;
  selectedYear: number;
  setSelectedYear: any;
  selectedColumn: SelectedColumn;
  setSelectedColumn: any;
  setSettings?: (data: any) => void;
}) => {
  const { isFullscreen } = useFullscreen();
  const startYear = new Date().getFullYear();
  const incomes = settings.incomes.filter((inc) => inc.enabled);
  const [openModal, setOpenModal] = useState(-1);
  const [hoverRow, setHoverRow] = useState(-1);
  const incomeMapData = {
    people: settings.people,
    incomes: settings.incomes,
    version: 1 as const,
  };

  const columns = React.useMemo<ColumnDef<any>[]>(
    () => generateColumns(incomes, incomeMapData, selectedColumn),
    [selectedColumn, settings, selectedYear, incomeMapData, incomes],
  );
  const [columnOrder, setColumnOrder] = React.useState<string[]>(() =>
    columns.map((c) => c.id!),
  );

  const divisionFactor =
    client.liveSettings.monthlyYearly === "monthly" ? 12 : 1;

  const { setField } = useInfo();

  const updateIncomes = (incomes: Income[]) => setField("incomes")(incomes);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 1,
      },
    }),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  const calculateOne = (income: Income, currentYear: number) => {
    const result = calculate({
      people: settings.people,
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

    return {
      ...result,
      amount: result.amount / divisionFactor,
    };
  };

  const tableData = useMemo(
    () =>
      yearRange(startYear, startYear + settings.maxYearsShown - 1).map(
        (currentYear) => ({
          year: currentYear,
          selectedColumn,
          age: (
            <div className="flex gap-2">
              <div className="w-20 relative">
                <LongevityTooltip client={client} currentYear={currentYear}>
                  <div>
                    {settings.people
                      .map((p) => currentYear - splitDate(p.birthday).year)
                      .join("/")}
                  </div>
                </LongevityTooltip>
              </div>
            </div>
          ),
          ...Object.fromEntries(
            incomes.map((income, i) => {
              const result = calculateOne(income, currentYear);
              return [
                title(incomes, settings.people, i),
                <div className="flex gap-2">
                  {printNumber(result.amount)}
                  {result.note ? (
                    <Tooltip
                      content={result.note}
                      theme={{ target: "" }}
                      placement="top"
                      className="!z-[50000]  print:hidden "
                    >
                      <div className="cursor-pointer flex items-center gap-2 ">
                        <QuestionMarkCircleIcon className="h-5 w-5 text-[#D0D5DD] print:hidden" />
                      </div>
                    </Tooltip>
                  ) : null}
                </div>,
              ];
            }),
          ),
          total: (
            <div className="flex gap-2">
              <div className="w-24 relative">
                <Tooltip
                  content={(() => {
                    const needs =
                      calculateSpendingYear(
                        incomeMapData,
                        client.spending,
                        settings,
                        currentYear,
                      ) / divisionFactor;
                    const income = incomes
                      .map((income) => calculateOne(income, currentYear).amount)
                      .filter((t) => typeof t === "number")
                      .reduce((a, b) => a + b, 0);
                    const stableIncome = incomes
                      .filter((item) => item.stable)
                      .map((income) => calculateOne(income, currentYear).amount)
                      .filter((t) => typeof t === "number")
                      .reduce((a, b) => a + b, 0);

                    const taxRate = getTaxRate(client, settings, currentYear);
                    const gap = income - needs - taxRate * income;
                    const stabilityRatio = Math.round(
                      (stableIncome / income) * 100,
                    );
                    const needsStable = Math.round(
                      ((stableIncome * (1 - taxRate)) / needs) * 100,
                    );
                    return (
                      <div className="z-[5000000] bg-white w-44 sticky">
                        {client.taxesFlag && (
                          <>
                            <div>Total Income: {printNumber(income)}</div>
                            <div>Taxes: {printNumber(taxRate * income)}</div>
                          </>
                        )}
                        {client.spending && client.needsFlag && (
                          <>
                            <div>
                              Spending: {client.spending && printNumber(needs)}
                            </div>

                            <div>
                              Gap:{" "}
                              <span
                                className={
                                  gap < 0 ? "text-red-500" : "text-green-500"
                                }
                              >
                                {printNumber(gap)}
                              </span>{" "}
                            </div>
                          </>
                        )}
                        {!isNaN(stabilityRatio) &&
                          client.stabilityRatioFlag && (
                            <div>
                              Income Stability:{" "}
                              {Math.round((stableIncome / income) * 100)}%
                            </div>
                          )}
                        {client.spending &&
                          client.stabilityRatioFlag &&
                          client.needsFlag && (
                            <div>Spending Stability: {needsStable}%</div>
                          )}
                      </div>
                    );
                  })()}
                  theme={{ target: "" }}
                  placement="right"
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
                        .reduce((a, b) => a + b, 0) *
                      (client.taxesFlag &&
                        settings.taxType == "Post-Tax" &&
                        settings.retirementYear
                        ? 1 -
                        (currentYear >= settings.retirementYear
                          ? client.spending.postTaxRate
                          : client.spending.preTaxRate) /
                        100
                        : 1),
                    )}
                  </div>
                </Tooltip>
              </div>
            </div>
          ),
        }),
      ),
    [settings, incomeMapData, divisionFactor, client],
  );

  const handleDragEnd = (moved: any) => {
    const { active, over } = moved;

    const oldIndex = columnOrder.indexOf(active.id as string);
    const newIndex = columnOrder.indexOf(over.id as string);
    if (
      newIndex === 0 ||
      newIndex === 1 ||
      newIndex == settings.incomes.length + 2
    )
      return;
    setColumnOrder((columnOrder) => {
      return arrayMove(columnOrder, oldIndex, newIndex); //this is just a splice util
    });
    if (active && over && active.id !== over.id) {
      if (setSettings) {
        const oldIndex = settings.incomes.findIndex((x) => x.id == active.id);
        const newIndex = settings.incomes.findIndex((x) => x.id == over.id);
        const incomes = arrayMove(settings.incomes, oldIndex, newIndex);
        updateIncomes(incomes);
      }
    }
  };

  return (
    <>
      <div className="print:hidden"></div>
      {settings.id === -1 &&
        incomes?.map((income) => (
          <IncomeModal
            income={income}
            setOpen={() => setOpenModal(-1)}
            open={openModal === income.id}
            i={income.id}
            key={income.id}
          />
        ))}
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToHorizontalAxis]}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <div className="rounded-xl border-[#EAECF0] border print:border-0 ">
          <div className="flex">
            <DraggableTable
              columns={columns}
              setSelectedYear={setSelectedYear}
              fullScreen={isFullscreen}
              tableData={tableData}
              selectedYear={selectedYear}
              hoverRow={hoverRow}
              setHoverRow={setHoverRow}
              columnOrder={columnOrder}
              setColumnOrder={setColumnOrder}
              setSelectedColumn={setSelectedColumn}
              selectedColumn={selectedColumn}
              setOpenModal={setOpenModal}
            />
            <table className="pr-3 ml-[-3px]">
              <thead
                className={`text-xs cursor-pointer print:static bg-[#F9FAFB] text-black font-medium text-left sticky z-50 print:border-transparent print:border-b-gray-500 print:border-2 border-1 ${isFullscreen ? "top-[110px]" : "top-[180px]"}`}
              >
                <tr>
                  <td
                    className={`font-medium   ${selectedColumn.type == "total" ? "bg-slate-200" : ""
                      }`}
                  >
                    <div
                      className={`flex flex-col items-start px-2 ${client.people.length > 1 && settings.incomes.filter((i) => i.enabled).length > 0 ? "py-[0.95rem]" : "py-[0.45rem]"} px-2`}
                      onClick={(e) => {
                        if (e.detail === 1) {
                          setTimeout(() => {
                            selectedColumn.type === "total"
                              ? setSelectedColumn({ type: "none", id: 0 })
                              : setSelectedColumn({ type: "total", id: 0 });
                          }, 200);
                        }
                      }}
                    >
                      {client.taxesFlag ? settings.taxType : ""} Total
                    </div>
                  </td>
                </tr>
              </thead>
              <tbody className="text-sm">
                {tableData.map((row, i) => (
                  <tr
                    key={i}
                    onMouseEnter={() => {
                      setHoverRow(i);
                    }}
                    onMouseLeave={() => {
                      setHoverRow(-1);
                    }}
                    className={`${i % 2 == 1 ? "bg-[#F9FAFB]" : "bg-white"} ${hoverRow === i ? "!bg-slate-100" : ""}  border-y border-[#EAECF0] ${selectedYear === 0 && ""}`}
                  >
                    <td
                      onClick={() =>
                        selectedYear == row.year
                          ? setSelectedYear(-1)
                          : setSelectedYear(row.year)
                      }
                      className={`${["year", "age", "total"].includes("total") ? "font-medium text-black " : "text-[#475467]"} px-2 py-[0.45rem] print:py-[0.2rem] ${selectedColumn.type == "total" || selectedYear === row.year ? "bg-slate-200" : ""}`}
                    >
                      {row.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DndContext>
    </>
  );
};

export default ResultTable;
