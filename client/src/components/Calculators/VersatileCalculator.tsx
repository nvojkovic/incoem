import React, { useState, useMemo } from "react";
import Button from "../Inputs/Button";
import { convertToParens, printNumber } from "../../utils";
import {
  CalculatorSettings,
  cagr,
  calculateProjection,
  getReturns,
  initialVersatileSettings,
} from "./versatileTypes";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { useInfo } from "../../useData";
import Layout from "../Layout";
import { Tooltip } from "flowbite-react";
import VersatileBalance from "../Charts/VersatileBalance";
import VersatileSettings from "./VersatileSettings";
import Solve from "./Solve";

const VersatileCalculator: React.FC = () => {
  const { data: client, setField } = useInfo();
  const settings = client.versatileCalculator as CalculatorSettings;
  console.log("calc", settings);
  const [selectedCol, setSelectedCol] = useState(null as any);
  const [selectedRow, setSelectedRow] = useState(null as any);
  const calculations = calculateProjection(settings);
  const [open, setOpen] = useState(true);

  const chartData =
    settings.returns.returnType === "random"
      ? [
        {
          label: "Best",
          data: calculateProjection({
            ...settings,
            returns: {
              ...settings.returns,
              selectedRandom: "best",
            },
          }),
          color: "#2ecc71", // Indigo color
        },
        {
          label: "Median",
          data: calculateProjection({
            ...settings,
            returns: {
              ...settings.returns,
              selectedRandom: "mean",
            },
          }),
          color: "#3498db", // Indigo color
        },
        {
          label: "Worst",
          data: calculateProjection({
            ...settings,
            returns: {
              ...settings.returns,
              selectedRandom: "worst",
            },
          }),
          color: "#e74c3c", // Indigo color
        },
      ]
      : [
        {
          label: "Balance",
          data: calculations,
          color: "#3498db", // Indigo color
        },
      ];

  const returnsMemo = useMemo(() => getReturns(settings), [settings]);
  console.log("RERERE");

  return (
    <Layout page="calculator" wide>
      <div className="container mx-auto px-4 mt-[-25px]">
        <div className="flex gap-12">
          <div>
            <VersatileSettings />
          </div>
          <div className="w-[1200px]">
            <div className="sticky top-[50px] bg-[#f3f4f6] flex justify-between items-center gap-5 pb-8 z-[10] pt-12 mt-[-150px]">
              <div className="flex gap-4">
                <div className="flex flex-col items-center  bg-white px-6 py-3 rounded-lg shadow-md border">
                  <div className="uppercase tracking-wide text-sm text-gray-800">
                    Ending Balance
                  </div>
                  <div className="font-semibold text-lg mt-[2px]">
                    <span
                      className={
                        calculations.length &&
                          calculations[calculations.length - 1].endingBalance < 0
                          ? "text-red-500"
                          : ""
                      }
                    >
                      {printNumber(
                        calculations.length &&
                        calculations[calculations.length - 1].endingBalance,
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-center  bg-white px-6 py-3 rounded-lg shadow-md border">
                  <div className="uppercase tracking-wide text-sm text-gray-800">
                    Total Payments
                  </div>
                  <div className="font-semibold text-lg mt-[2px]">
                    {printNumber(
                      calculations
                        .map((i) => i.totalPayments)
                        .reduce((a, b) => a + b, 0),
                    )}{" "}
                  </div>
                </div>
                <div className="flex flex-col items-center  bg-white px-6 py-3 rounded-lg shadow-md border w-40">
                  <div className="uppercase tracking-wide text-sm text-gray-800">
                    CAGR
                  </div>
                  <div className="font-semibold text-lg mt-[2px]">
                    {cagr(calculations.map((y) => returnsMemo(y.year)))}%
                  </div>
                </div>
              </div>
              <div className="flex gap-4 items-end">
                <Solve />
                <div className="w-40">
                  <Button
                    type="secondary"
                    onClick={() => {
                      console.log("setting to", initialVersatileSettings);
                      setField("versatileCalculator")(initialVersatileSettings);
                    }}
                  >
                    Reset Inputs
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-white p-3 border rounded-lg mt-20 shadow-md sticky top-[200px]">
              {
                <div
                  className={`flex justify-end border-b border-[#EAECF0] font-semibold text-2xl cursor-pointer ${"z-50 sticky top-[72px]"}`}
                  onClick={() => setOpen(!open)}
                >
                  {open ? (
                    <ChevronUpIcon className="text-[#475467] w-6" />
                  ) : (
                    <ChevronDownIcon className="text-[#475467] w-6" />
                  )}
                </div>
              }
              <div
                className={` transition-maxHeight w-full duration-500 ease-in-out ${open ? "max-h-[1500px]" : "max-h-0 overflow-hidden"}`}
              >
                <VersatileBalance datasets={chartData} />
              </div>
            </div>
            <div className=""></div>

            <div className="mt-[40px]">
              <table className="text-sm w-full bg-white shadow-lg">
                <thead
                  className={`text-xs cursor-pointer bg-[#F9FAFB] text-black font-medium text-left sticky border-1 ${open ? "top-[600px]" : "top-[250px]"} rounded-none !border-none`}
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
                      Return
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
                        className={`border px-4 py-2 ${selectedCol === "return-percent" ? "bg-slate-200" : ""}  ${row.return < 0 ? "text-red-500" : ""}`}
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
                              style="light"
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
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VersatileCalculator;
