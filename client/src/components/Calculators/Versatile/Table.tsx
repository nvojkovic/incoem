import { useState } from "react";
import { CalculationRow } from "./versatileTypes";
import { convertToParens, printNumber } from "src/utils";
import { Tooltip } from "flowbite-react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { useFullscreen } from "src/hooks/useFullScreen";

interface TableProps {
  calculations: CalculationRow[];
  open: boolean;
  returnsMemo: any;
}

const Table = ({ calculations, returnsMemo, open }: TableProps) => {
  const [selectedCol, setSelectedCol] = useState(null as any);
  const [selectedRow, setSelectedRow] = useState(null as any);
  let topOffset = 300;
  if (open) {
    topOffset += 356;
  }
  const { isFullscreen } = useFullscreen();
  if (isFullscreen) {
    topOffset -= 63;
  }
  return (
    <table className="text-sm w-full bg-white shadow-lg print:shadow-none">
      <thead
        className={`text-xs cursor-pointer bg-[#F9FAFB] text-black font-medium text-left sticky border-1 rounded-none !border-none`}
        style={{ top: topOffset }}
      >
        <tr>
          <th
            className={`px-4 py-2 !rounded-none ${selectedCol === "year" ? "bg-slate-200" : ""}`}
            onClick={() =>
              selectedCol === "year"
                ? setSelectedCol(null)
                : setSelectedCol("year")
            }
          >
            Year
          </th>
          <th
            className={`px-4 py-2 !rounded-none ${selectedCol === "age" ? "bg-slate-200" : ""}`}
            onClick={() =>
              selectedCol === "age"
                ? setSelectedCol(null)
                : setSelectedCol("age")
            }
          >
            Age
          </th>
          <th
            className={`px-4 py-2 !rounded-none ${selectedCol === "beginning" ? "bg-slate-200" : ""}`}
            onClick={() =>
              selectedCol === "beginning"
                ? setSelectedCol(null)
                : setSelectedCol("beginning")
            }
          >
            Beginning Balance
          </th>
          <th
            className={`px-4 py-2 !rounded-none ${selectedCol === "total" ? "bg-slate-200" : ""}`}
            onClick={() =>
              selectedCol === "total"
                ? setSelectedCol(null)
                : setSelectedCol("total")
            }
          >
            Payment
          </th>
          <th
            className={`px-4 py-2 !rounded-none ${selectedCol === "return-percent" ? "bg-slate-200" : ""}`}
            onClick={() =>
              selectedCol === "return-percent"
                ? setSelectedCol(null)
                : setSelectedCol("return-percent")
            }
          >
            Return (%)
          </th>

          <th
            className={`px-4 py-2 !rounded-none ${selectedCol === "return" ? "bg-slate-200" : ""}`}
            onClick={() =>
              selectedCol === "return"
                ? setSelectedCol(null)
                : setSelectedCol("return")
            }
          >
            Return ($)
          </th>
          <th
            className={`px-4 py-2 !rounded-none ${selectedCol === "fees" ? "bg-slate-200" : ""}`}
            onClick={() =>
              selectedCol === "fees"
                ? setSelectedCol(null)
                : setSelectedCol("fees")
            }
          >
            Investment Fees
          </th>
          <th
            className={`px-4 py-2 !rounded-none ${selectedCol === "taxes" ? "bg-slate-200" : ""}`}
            onClick={() =>
              selectedCol === "taxes"
                ? setSelectedCol(null)
                : setSelectedCol("taxes")
            }
          >
            Taxes
          </th>
          <th
            className={`px-4 py-2 !rounded-none ${selectedCol === "end" ? "bg-slate-200" : ""}`}
            onClick={() =>
              selectedCol === "end"
                ? setSelectedCol(null)
                : setSelectedCol("end")
            }
          >
            Ending Balance
          </th>
        </tr>
      </thead>
      <tbody>
        {calculations.map((row, index) => (
          <tr
            key={index}
            className={` ${selectedRow === index ? "bg-slate-200" : "hover:bg-slate-100"}`}
          >
            {" "}
            <td
              className={`border px-4 py-2 ${selectedCol === "year" ? "bg-slate-200" : ""}`}
              onClick={() =>
                setSelectedRow(selectedRow === index ? null : index)
              }
            >
              {row.year}
            </td>
            <td
              className={`border px-4 py-2 ${selectedCol === "age" ? "bg-slate-200" : ""}`}
              onClick={() =>
                setSelectedRow(selectedRow === index ? null : index)
              }
            >
              {row.age}
            </td>
            <td
              className={`border px-4 py-2 ${selectedCol === "beginning" ? "bg-slate-200" : ""}`}
              onClick={() =>
                setSelectedRow(selectedRow === index ? null : index)
              }
            >
              {printNumber(row.beginning)}
            </td>
            <td
              className={`border px-4 py-2 ${selectedCol === "total" ? "bg-slate-200" : ""}`}
              onClick={() =>
                setSelectedRow(selectedRow === index ? null : index)
              }
            >
              {/* <Input
                      subtype="money"
                      value={settings.payment.years[row.year]}
                      setValue={(e) => {
                        updateSettings("payment", "years", {
                          ...settings.payment.years,
                          [row.year]: e,
                        } as any);
                      }}
                      width="!border-none py-1 !w-full"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    />*/}
              {printNumber(row.totalPayments)}
            </td>{" "}
            <td
              className={`border px-4 py-2 ${selectedCol === "return-percent" ? "bg-slate-200" : ""}  ${returnsMemo(row.year) < 0 ? "text-red-500" : ""}`}
              onClick={() =>
                setSelectedRow(selectedRow === index ? null : index)
              }
            >
              {`${convertToParens((Math.round(100 * returnsMemo(row.year)) / 100).toString() + `%`)}`}
            </td>
            <td
              className={`border px-4 py-2 ${selectedCol === "return" ? "bg-slate-200" : ""} ${row.return < 0 ? "text-red-500" : ""}`}
              onClick={() =>
                setSelectedRow(selectedRow === index ? null : index)
              }
            >
              {printNumber(row.return)}
            </td>
            <td
              className={`border px-4 py-2 ${selectedCol === "fees" ? "bg-slate-200" : ""}`}
              onClick={() =>
                setSelectedRow(selectedRow === index ? null : index)
              }
            >
              {printNumber(-row.investmentFee)}
            </td>
            <td
              className={`border px-4 py-2 ${selectedCol === "taxes" ? "bg-slate-200" : ""}`}
              onClick={() =>
                setSelectedRow(selectedRow === index ? null : index)
              }
            >
              {printNumber(-row.taxes)}
            </td>
            <td
              className={`border px-4 py-2 ${selectedCol === "end" ? "bg-slate-200" : ""} ${row.endingBalance < 0 && "text-red-500"}`}
              onClick={() =>
                setSelectedRow(selectedRow === index ? null : index)
              }
            >
              <div className="flex gap-2">
                {printNumber(row.endingBalance)}
                {row.ranOut && (
                  <Tooltip
                    content={"Account depleted."}
                    theme={{ target: "" }}
                    placement="top"
                    className="!z-[50000] bg-white print:hidden"
                  >
                    <div className="cursor-pointer flex items-center gap-2 ">
                      <QuestionMarkCircleIcon className="h-5 w-5 text-[#D0D5DD] print:hidden" />
                    </div>
                  </Tooltip>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
