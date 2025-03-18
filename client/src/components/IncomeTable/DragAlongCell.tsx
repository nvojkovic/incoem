import { useSortable } from "@dnd-kit/sortable";
import { Cell } from "@tanstack/react-table";
import { CSSProperties } from "react";
import { CSS } from "@dnd-kit/utilities";
import { SelectedColumn } from "src/types";
import { useInfo } from "src/hooks/useData";
import { hoverTaxColors, selectedTaxColors, taxColors } from "src/utils";

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
  const {
    data: { liveSettings },
  } = useInfo();
  const data = cell.getValue() as any;
  const column = (cell.getValue() as any).column;
  const { isDragging, setNodeRef, transform } = useSortable({
    id: cell.column.id,
  });
  const fixed = ["age", "year", "total"].includes(column.type);

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    transform: fixed ? "" : CSS.Translate.toString(transform),
    transition: "width transform 0.2s ease-in-out",
    width: cell.column.getSize(),
  };

  const selected =
    (selectedColumn.type == column.type && selectedColumn.id === column.id) ||
    selectedYear === data.year;

  const taxStatus = (cell.getValue() as any).taxStatus || "Taxable";

  return (
    <td
      className={` ${["year", "age", "total"].includes(column.type) ? "font-medium text-black " : "text-[#475467]"} ${column.type === "year" ? "px-6" : "px-2"} py-[0.45rem] print:py-[0.2rem] ${(cell as any).hoverRow && !selected && liveSettings.showTaxType && hoverTaxColors[taxStatus]} ${liveSettings.showTaxType ? (selected ? selectedTaxColors[taxStatus] : liveSettings.showTaxType && taxColors[taxStatus]) : selected && "bg-slate-200"}`}
      ref={setNodeRef}
      onClick={() => {
        if (selectedYear === data.year) setSelectedYear(0);
        else setSelectedYear(data.year);
      }}
      style={style}
    >
      <div className="bg-[#e8d3df]"></div>
      {(cell.getValue() as any).value}
    </td>
  );
};

export default DragAlongCell;
