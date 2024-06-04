import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  PrinterIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import calculate from "../calculator/calculate";
import title from "../calculator/title";
import Input from "./Inputs/Input";
import { printNumber, printReport, splitDate, yearRange } from "../utils";
import Confirm from "./Confirm";
import { CSSProperties, useMemo, useState } from "react";
import StackedChart from "./Chart";
import Button from "./Inputs/Button";
import { Spinner } from "flowbite-react";
import IncomeModal from "./Info/IncomeModal";
import {
  Cell,
  ColumnDef,
  Header,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
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
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";
import { useInfo } from "../useData";
import { generateColumns } from "./tableData";

const DraggableTableHeader = ({
  header,
  timer,
  setTimer,
  setOpenModal,
  setSelectedColumn,
}: {
  header: Header<SelectedColumn, unknown>;
  timer: any;
  setTimer: any;
  setOpenModal: any;
  setSelectedColumn: any;
}) => {
  const data: any = (header.column.columnDef as any).header();
  const fixed = ["age", "year", "total"].includes(data.column.type);
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({
      id: header.column.id,
      disabled: fixed,
    });

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: fixed ? "" : CSS.Translate.toString(transform),
    transition: "width transform 0.2s ease-in-out",
    whiteSpace: "nowrap",
    width: header.column.getSize(),
    zIndex: isDragging ? 1 : 0,
  };

  const selectedColumn = data.selectedColumn;
  return (
    <td
      className={`font-medium  ${
        selectedColumn.type == data.column.type &&
        selectedColumn.id == data.column.id
          ? "bg-slate-200"
          : ""
      }`}
      colSpan={header.colSpan}
      ref={setNodeRef}
      style={style}
      onDoubleClick={() => {
        console.log("double");
        clearTimeout(timer);
        setOpenModal(data.incomeId);
      }}
    >
      <div
        className="flex flex-col items-start px-6 py-[0.45rem]"
        onClick={(e) => {
          console.log("clcc", e.detail);
          if (e.detail === 1) {
            setTimer(
              setTimeout(() => {
                selectedColumn.type === data.column.type &&
                selectedColumn.id == data.column.id
                  ? setSelectedColumn({ type: "none", id: 0 })
                  : setSelectedColumn(data.column);
              }, 200),
            );
          }
          if (e.detail === 2) {
            clearTimeout(timer);
            setOpenModal(data.index);
          }
        }}
        {...attributes}
        {...listeners}
      >
        {header.isPlaceholder ? null : data.value}
      </div>
    </td>
  );
};
const DragAlongCell = ({
  cell,
  selectedColumn,
  selectedYear,
  setSelectedYear,
}: {
  cell: Cell<any, unknown>;
  selectedColumn: SelectedColumn;
  setSelectedYear: any;
  selectedYear: number;
}) => {
  const data = cell.getValue() as any;
  const column = (cell.getValue() as any).column;
  const { isDragging, setNodeRef, transform } = useSortable({
    id: cell.column.id,
  });
  const fixed = ["age", "year", "total"].includes(column.type);

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: fixed ? "" : CSS.Translate.toString(transform),
    transition: "width transform 0.2s ease-in-out",
    width: cell.column.getSize(),
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <td
      className={`${["year", "age", "total"].includes(column.type) ? "font-medium text-black " : "text-[#475467]"} px-6 py-[0.45rem] ${(selectedColumn.type == column.type && selectedColumn.id === column.id) || selectedYear === data.year ? "bg-slate-200" : ""}`}
      ref={setNodeRef}
      onClick={() => {
        console.log(data.year, cell);
        if (selectedYear === data.year) setSelectedYear(0);
        else setSelectedYear(data.year);
      }}
      style={style}
    >
      {(cell.getValue() as any).value}
    </td>
  );
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
  setSettings,
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
  setSettings?: (data: any) => void;
}) => {
  if (!data) return null;
  const startYear = new Date().getFullYear();
  const [removeOpen, setRemoveOpen] = useState(false);
  const [printing, setPrinting] = useState(false);
  const incomes = data.incomes.filter((inc) => inc.enabled);
  const [openModal, setOpenModal] = useState(-1);

  const columns = React.useMemo<ColumnDef<any>[]>(
    () => generateColumns(incomes, data, selectedColumn),
    [selectedColumn, settings, selectedYear],
  );
  const [columnOrder, setColumnOrder] = React.useState<string[]>(() =>
    columns.map((c) => c.id!),
  );

  const { updateIncomes } = useInfo();

  const print = async () => {
    setPrinting(true);
    const url = await printReport(clientId, settings.id);
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

  const tableData = useMemo(
    () =>
      yearRange(startYear, startYear + settings.maxYearsShown - 1).map(
        (currentYear) => ({
          year: currentYear,
          selectedColumn,
          age: data.people
            .map((p) => currentYear - splitDate(p.birthday).year)
            .join("/"),
          ...Object.fromEntries(
            incomes.map((income, i) => [
              title(incomes, data.people, i),
              printNumber(
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
              ),
            ]),
          ),
          total: printNumber(
            incomes
              .map((income) =>
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
              )
              .filter((t) => typeof t === "number")
              .reduce((a, b) => a + b, 0),
          ),
        }),
      ),
    [settings, data],
  );
  console.log("rerender", selectedYear);

  const handleDragEnd = (moved: any) => {
    console.log("move", moved);
    const { active, over } = moved;

    const oldIndex = columnOrder.indexOf(active.id as string);
    const newIndex = columnOrder.indexOf(over.id as string);
    if (newIndex === 0 || newIndex === 1 || newIndex == data.incomes.length + 2)
      return;
    setColumnOrder((columnOrder) => {
      return arrayMove(columnOrder, oldIndex, newIndex); //this is just a splice util
    });
    if (active && over && active.id !== over.id) {
      console.log(
        "settings",
        active.id,
        over.id,
        settings.data.incomes.map((i) => i.id),
      );
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
        setSettings({
          ...settings,
          data: {
            ...settings.data,
            incomes,
          },
        });
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
                <table className="border border-gray-400 text-xs">
                  <tbody>
                    <tr className="border-b border-gray-400">
                      <td className="border border-gray-400 px-2">Inflation</td>
                      <td className="px-2 py-1">
                        {settings.inflation.toString()}%
                      </td>
                    </tr>

                    {data.people.length > 1 &&
                      data.people.map(
                        (person, i) =>
                          settings.whoDies == i && (
                            <tr>
                              <td className="border border-gray-400 px-2">{`${person.name}'s Death`}</td>
                              <td className="px-2 py-1">
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
            )}
          </div>
        )}
        {!toPrint &&
          !removeScenario &&
          incomes?.map((income) => (
            <IncomeModal
              income={income}
              setOpen={() => setOpenModal(-1)}
              open={openModal === income.id}
              i={income.id}
            />
          ))}
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
    </DndContext>
  );
};

export default ResultTable;

const DraggableTable = ({
  fullScreen,
  tableData,
  columns,
  columnOrder,
  setColumnOrder,
  selectedYear,
  setSelectedColumn,
  selectedColumn,
  setSelectedYear,
  setOpenModal,
}: {
  fullScreen: boolean;
  tableData: any;
  columns: any[];
  columnOrder: string[];
  setColumnOrder: any;
  selectedYear: number;
  setSelectedColumn: any;
  setSelectedYear: any;
  selectedColumn: SelectedColumn;
  setOpenModal: any;
}) => {
  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnOrder,
    },
    onColumnOrderChange: setColumnOrder,
  });

  const [timer, setTimer] = useState<any>(0);

  return (
    <table className="w-full">
      <thead
        className={`text-xs cursor-pointer bg-[#F9FAFB] text-black font-medium text-left sticky z-50 print:border-transparent print:border-b-gray-500 print:border-2 border-1 ${fullScreen ? "top-[172px]" : "top-[243px]"} ${fullScreen ? "a" : "b"}`}
      >
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            <SortableContext
              items={columnOrder}
              strategy={horizontalListSortingStrategy}
            >
              {headerGroup.headers.map((header) => (
                <DraggableTableHeader
                  key={header.id}
                  header={header}
                  timer={timer}
                  setTimer={setTimer}
                  setOpenModal={setOpenModal}
                  setSelectedColumn={setSelectedColumn}
                />
              ))}
            </SortableContext>
          </tr>
        ))}
      </thead>
      <tbody className="text-sm">
        {table.getRowModel().rows.map((row, i) => (
          <tr
            key={row.id}
            className={`${i % 2 == 1 ? "bg-[#F9FAFB]" : "bg-white"} border-y border-[#EAECF0] hover:bg-slate-100 ${selectedYear === 0 && ""}`}
          >
            {row.getVisibleCells().map((cell) => (
              <SortableContext
                key={cell.id}
                items={columnOrder}
                strategy={horizontalListSortingStrategy}
              >
                <DragAlongCell
                  key={cell.id}
                  cell={cell}
                  selectedColumn={selectedColumn}
                  selectedYear={selectedYear}
                  setSelectedYear={setSelectedYear}
                />
              </SortableContext>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
