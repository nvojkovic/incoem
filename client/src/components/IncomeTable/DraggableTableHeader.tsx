import { useSortable } from "@dnd-kit/sortable";
import { Header } from "@tanstack/react-table";
import { CSS } from "@dnd-kit/utilities";
import { CSSProperties } from "react";

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
      className={`font-medium  ${selectedColumn.type == data.column.type &&
          selectedColumn.id == data.column.id
          ? "bg-slate-200"
          : ""
        }

      `}
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
        className={`flex flex-col items-start px-2 py-[0.45rem] ${data.column.type === "year" ? "px-6" : "px-2"}`}
        onClick={(e) => {
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

export default DraggableTableHeader;
