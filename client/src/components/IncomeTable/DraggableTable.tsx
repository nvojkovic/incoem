import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useState } from "react";
import DraggableTableHeader from "./DraggableTableHeader";
import DragAlongCell from "./DragAlongCell";

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
      <tbody className="text-sm print:text-xs">
        {table.getRowModel().rows.map((row, i) => (
          <tr
            key={row.id}
            className={`${i % 2 == 1 ? "bg-[#F9FAFB]" : "bg-white"}  border-y border-[#EAECF0] hover:bg-slate-100 ${selectedYear === 0 && ""}`}
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

export default DraggableTable;
