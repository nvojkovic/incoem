import { useSortable } from "@dnd-kit/sortable";
import { Cell } from "@tanstack/react-table";
import { CSSProperties } from "react";
import { CSS } from "@dnd-kit/utilities";
import { SelectedColumn } from "src/types";

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
    // position: "relative",
    transform: fixed ? "" : CSS.Translate.toString(transform),
    transition: "width transform 0.2s ease-in-out",
    width: cell.column.getSize(),
    // zIndex: isDragging ? 1 : 0,
  };

  return (
    <td
      className={`${["year", "age", "total"].includes(column.type) ? "font-medium text-black " : "text-[#475467]"} ${column.type === "year" ? "px-6" : "px-2"} py-[0.45rem] print:py-[0.2rem] ${(selectedColumn.type == column.type && selectedColumn.id === column.id) || selectedYear === data.year ? "bg-slate-200" : ""}`}
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

export default DragAlongCell;
