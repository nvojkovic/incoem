import React, { useState, useEffect } from "react";
import Button from "../Inputs/Button";
import { convertToParens, printNumber } from "../../utils";
import {
  CalculationRow,
  CalculatorSettings,
  calculateProjection,
  initialVersatileSettings,
} from "./versatileTypes";
import {
  ArrowLeftIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { useInfo } from "../../useData";
import Layout from "../Layout";
import { Link } from "react-router-dom";
import { Tooltip } from "flowbite-react";
import VersatileBalance from "../Charts/VersatileBalance";
import Header from "./Header";

const VersatileCalculator: React.FC = () => {
  const { data: client, setField } = useInfo();
  const settings = client.versatileCalculator as CalculatorSettings;
  console.log("calc", settings);
  const [selectedCol, setSelectedCol] = useState(null as any);
  const [selectedRow, setSelectedRow] = useState(null as any);
  const [calculations, setCalculations] = useState<CalculationRow[]>([]);

  useEffect(() => {
    const rows = calculateProjection(settings);
    setCalculations(rows);
  }, [settings]);

  return (
    <Layout page="calculator">
      <div className="container mx-auto px-4 pb-8  ml-[-200px]">
        <div className="flex gap-3 items-center mb-8 justify-between">
          <div className="flex gap-3 items-baseline">
            <Link to={`/client/${client.id}/calculator`}>
              <div className="rounded-full border border-gray-400 h-8 w-8 flex justify-center items-center cursor-pointer">
                <ArrowLeftIcon className="h-5 text-gray-500" />
              </div>
            </Link>
            <h1 className="text-3xl font-bold">Versatile Calculator</h1>
          </div>
          <div className="w-40">
            <Button
              type="secondary"
              onClick={() => {
                console.log("setting to", initialVersatileSettings);
                setField("versatileCalculator")(initialVersatileSettings);
              }}
            >
              Reset
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <div>
            <Header />
          </div>
          <div className="w-[1200px]">
            <div className="sticky top-[72px] bg-[#f3f4f6] w-[1500px]">
              <div className="flex w-full mb-10 gap-5 justify-center  pb-3">
                <div className="flex flex-col items-center justify-center bg-white px-6 py-3 rounded-lg shadow-md border">
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
                <div className="flex flex-col items-center justify-center bg-white px-6 py-3 rounded-lg shadow-md border">
                  <div className="uppercase tracking-wide text-sm text-gray-800">
                    Total Payments
                  </div>
                  <div className="font-semibold text-lg mt-[2px]">
                    {printNumber(
                      Math.abs(
                        calculations
                          .map((i) => i.totalPayments)
                          .reduce((a, b) => a + b, 0),
                      ),
                    )}{" "}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-[-15px]">
              <VersatileBalance data={calculations} />
            </div>
            {/*<VersatileChart
          data={calculations.map((i) => ({
            year: i.year,
            balance: i.endingBalance,
            residual: i.return - i.taxes - i.investmentFee,
            payment: Math.abs(i.totalPayments),
            tax: i.taxes,
            investmentFee: i.investmentFee,
          }))}
        />*/}
            <div className="">
              <table className="text-sm w-full bg-white shadow-lg">
                <thead
                  className={`text-xs cursor-pointer bg-[#F9FAFB] text-black font-medium text-left sticky z-50 border-1 top-[410px] rounded-none !border-none`}
                >
                  <tr>
                    <th
                      className="px-4 py-2 !rounded-none"
                      onClick={() =>
                        selectedCol === "year"
                          ? setSelectedCol(null)
                          : setSelectedCol("year")
                      }
                    >
                      Year
                    </th>
                    <th
                      className="px-4 py-2 !rounded-none"
                      onClick={() =>
                        selectedCol === "age"
                          ? setSelectedCol(null)
                          : setSelectedCol("age")
                      }
                    >
                      Age
                    </th>
                    <th
                      className="px-4 py-2"
                      onClick={() =>
                        selectedCol === "beginning"
                          ? setSelectedCol(null)
                          : setSelectedCol("beginning")
                      }
                    >
                      Beginning Balance
                    </th>
                    <th
                      className="px-4 py-2"
                      onClick={() =>
                        selectedCol === "total"
                          ? setSelectedCol(null)
                          : setSelectedCol("total")
                      }
                    >
                      Payment
                    </th>
                    <th
                      className="px-4 py-2"
                      onClick={() =>
                        selectedCol === "return"
                          ? setSelectedCol(null)
                          : setSelectedCol("return")
                      }
                    >
                      Return
                    </th>
                    <th
                      className="px-4 py-2"
                      onClick={() =>
                        selectedCol === "return-percent"
                          ? setSelectedCol(null)
                          : setSelectedCol("return-percent")
                      }
                    >
                      Return (%)
                    </th>
                    <th
                      className="px-4 py-2"
                      onClick={() =>
                        selectedCol === "fees"
                          ? setSelectedCol(null)
                          : setSelectedCol("fees")
                      }
                    >
                      Investment Fees
                    </th>
                    <th
                      className="px-4 py-2"
                      onClick={() =>
                        selectedCol === "taxes"
                          ? setSelectedCol(null)
                          : setSelectedCol("taxes")
                      }
                    >
                      Taxes
                    </th>
                    <th
                      className="px-4 py-2 !rounded-none"
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
                        className={`border px-4 py-2 ${selectedCol === "return-percent" ? "bg-slate-200" : ""}  ${row.return < 0 ? "text-red-500" : ""}`}
                        onClick={() =>
                          setSelectedRow(selectedRow === index ? null : index)
                        }
                      >
                        {row.beginning
                          ? `${convertToParens((Math.round((10000 * row.return) / row.beginning) / 100).toString() + `%`)}`
                          : ""}
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
