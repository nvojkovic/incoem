import React, { useState, useEffect } from "react";
import Input from "../Inputs/Input";
import Button from "../Inputs/Button";
import Select from "../Inputs/Select";
import { printNumber } from "../../utils";
import Modal from "../Modal";
import { CalculatorSettings, initialVersatileSettings } from "./versatileTypes";
import { ArrowDownIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useInfo } from "../../useData";
import Layout from "../Layout";
import { Link } from "react-router-dom";
import VersatileChart from "../Charts/VersatileChart";

interface CalculationRow {
  age: number;
  year: number;
  beginning: number;
  totalPayments: number;
  return: number;
  growth: number;
  taxes: number;
  endingBalance: number;
}

const VersatileCalculator: React.FC = () => {
  const { data: client, setField } = useInfo();
  const settings = client.versatileCalculator;
  console.log("calc", settings);
  const [openYears, setOpenYears] = useState(false);
  const [selectedCol, setSelectedCol] = useState(null as any);
  const [selectedRow, setSelectedRow] = useState(null as any);
  const [calculations, setCalculations] = useState<CalculationRow[]>([]);

  useEffect(() => {
    const rows = calculateProjection(settings);
    setCalculations(rows);
  }, [settings]);

  const updateSettings = (
    category: keyof CalculatorSettings,
    field: string,
    value: number | string,
  ) => {
    setField("versatileCalculator")({
      ...settings,
      [category]: {
        ...settings[category],
        [field]: value,
      },
    });
  };

  const calculateProjection = (settings: CalculatorSettings) => {
    const rows: CalculationRow[] = [];
    let balance = settings.user.presentValue;

    for (let year = 0; year <= settings.user.endYear; year++) {
      const beginning = balance;

      let payment = 0;
      if (year >= settings.payment.startYear) {
        const yearsFromStart = year - settings.payment.startYear;
        if (settings.payment.type === "simple")
          payment =
            -(
              settings.payment.amount *
              Math.pow(1 + settings.payment.increase / 100, yearsFromStart) *
              1
            ) / Math.pow(1 + settings.other.inflation / 100, yearsFromStart);
        else payment = -settings.payment.years[year] || 0;
      }

      let ending = beginning;
      if (settings.payment.timing === "beginning") ending += payment;

      ending /= 1 + settings.other.inflation / 100;

      const returnAmount = ending * (settings.other.rateOfReturn / 100);
      const taxes = returnAmount * (settings.other.taxRate / 100);
      const growth = returnAmount - taxes;

      if (settings.payment.timing === "end") ending += payment;
      ending += growth;

      rows.push({
        age: settings.user.startAge + year,
        year,
        beginning,
        totalPayments: payment,
        return: returnAmount,
        growth,
        taxes,
        endingBalance: ending,
      });

      balance = ending;
    }
    return rows;
  };
  const handleSolveRateOfReturn = () => {
    const targetEndingBalance = 0;
    let low = 0;
    let high = 100;
    let mid = 0;
    let iteration = 0;
    const maxIterations = 100;
    const tolerance = 100;

    const testSettings = structuredClone(settings);
    while (iteration < maxIterations) {
      mid = (low + high) / 2;
      testSettings.other.rateOfReturn = mid;
      setField("versatileCalculator")({
        ...settings,
        other: { ...settings.other, rateOfReturn: mid },
      });
      const calculations = calculateProjection(testSettings);

      const lastRow = calculations[calculations.length - 1];

      console.log(mid, low, high, lastRow.endingBalance);
      if (Math.abs(lastRow.endingBalance - targetEndingBalance) < tolerance) {
        break;
      }

      if (lastRow.endingBalance > targetEndingBalance) {
        high = mid;
      } else {
        low = mid;
      }

      iteration++;
    }
    setField("versatileCalculator")({
      ...settings,
      other: {
        ...settings.other,
        rateOfReturn: parseFloat(mid.toFixed(3)),
      },
    });
  };
  console.log("current", settings);

  return (
    <Layout page="calculator">
      <div className="container mx-auto px-4 pb-8">
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
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 pb-8 sticky top-[72px] bg-[#f3f4f6] py-4 pt-8">
          <div className="flex flex-col gap-4 border p-4 rounded-lg shadow-md bg-white">
            <div className="col-span-3">
              <h2 className="text-xl font-semibold mb-4">User Settings</h2>
            </div>
            <div className="flex gap-6">
              <Input
                labelLength={100}
                label="Present Value"
                subtype="money"
                value={settings.user.presentValue}
                setValue={(value) =>
                  updateSettings("user", "presentValue", value)
                }
              />
            </div>

            <div className="flex gap-6">
              <Input
                label="Start Age"
                labelLength={100}
                subtype="number"
                value={settings.user.startAge}
                setValue={(value) => updateSettings("user", "startAge", value)}
              />
              <Input
                label="Years"
                subtype="number"
                labelLength={60}
                value={settings.user.endYear}
                setValue={(value) => updateSettings("user", "endYear", value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 border p-4 rounded-lg shadow-md bg-white">
            <div className="flex gap-7 justify-between items-center mb-[16px]">
              <h2 className="text-xl font-semibold">Payment</h2>
              <div className="flex w-60 text-sm">
                <div
                  className={`w-full text-center py-1 ${settings.payment.type === "simple" ? "bg-main-orange-light" : ""} cursor-pointer rounded-md`}
                  onClick={() => updateSettings("payment", "type", "simple")}
                >
                  Simple
                </div>
                <div
                  className={`w-full text-center py-1 ${settings.payment.type === "detailed" ? "bg-main-orange-light" : ""} cursor-pointer rounded-md`}
                  onClick={() => updateSettings("payment", "type", "detailed")}
                >
                  Detailed
                </div>
              </div>
            </div>
            {settings.payment.type === "detailed" && (
              <div className="w-32 mx-auto mt-1 mb-1">
                <Button type="primary" onClick={() => setOpenYears(true)}>
                  Open Years{" "}
                </Button>
              </div>
            )}
            {settings.payment.type === "simple" && (
              <div className="flex gap-6">
                <Input
                  labelLength={90}
                  label="Payment ($)"
                  subtype="money"
                  size="md"
                  value={settings.payment.amount}
                  setValue={(value) =>
                    updateSettings("payment", "amount", value)
                  }
                />
                <Input
                  label="Increase (%)"
                  labelLength={90}
                  subtype="percent"
                  value={settings.payment.increase}
                  setValue={(value) =>
                    updateSettings("payment", "increase", value)
                  }
                />
              </div>
            )}
            <div className="flex gap-6">
              {" "}
              <Input
                label="Start Year"
                subtype="number"
                labelLength={90}
                value={settings.payment.startYear}
                setValue={(value) =>
                  updateSettings("payment", "startYear", value)
                }
              />
              <div className="w-[208px]">
                <Select
                  labelLength={163}
                  label="Timing"
                  options={[
                    { id: "beginning", name: "BoY" },
                    { id: "end", name: "EoY" },
                  ]}
                  selected={{
                    id: settings.payment.timing,
                    name:
                      settings.payment.timing === "beginning" ? "BoY" : "EoY",
                  }}
                  setSelected={(option) =>
                    updateSettings("payment", "timing", option.id)
                  }
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 border p-4 rounded-lg shadow-md bg-white">
            <div className="col-span-3">
              <h2 className="text-xl font-semibold mb-4">Other Settings</h2>
            </div>

            <div className="flex gap-6">
              <Input
                label="Return (%)"
                labelLength={80}
                subtype="percent"
                value={settings.other.rateOfReturn}
                setValue={(value) =>
                  updateSettings("other", "rateOfReturn", value)
                }
              />
              <div className="w-[440px]">
                <Button type="primary" onClick={handleSolveRateOfReturn}>
                  Solve
                </Button>
              </div>
            </div>
            <div className="flex gap-6">
              <Input
                label="Taxes (%)"
                labelLength={80}
                subtype="percent"
                value={settings.other.taxRate}
                setValue={(value) => updateSettings("other", "taxRate", value)}
              />
              <Input
                label="Inflation (%)"
                labelLength={90}
                subtype="percent"
                value={settings.other.inflation}
                setValue={(value) =>
                  updateSettings("other", "inflation", value)
                }
              />
            </div>
          </div>
        </div>
        <div className="flex w-full mb-10 gap-5 justify-center sticky top-[315px] bg-[#f3f4f6] pb-3">
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
        <VersatileChart
          data={calculations.map((i) => ({
            year: i.year,
            balance: i.endingBalance,
            residual: i.return - i.taxes,
            payment: Math.abs(i.totalPayments),
            tax: i.taxes,
          }))}
        />
        <div className="">
          <table className="text-sm w-full bg-white shadow-lg">
            <thead
              className={`text-xs cursor-pointer bg-[#F9FAFB] text-black font-medium text-left sticky z-50 border-1 top-[400px] rounded-none !border-none`}
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
                    {printNumber(row.totalPayments)}
                  </td>
                  <td
                    className={`border px-4 py-2 ${selectedCol === "return" ? "bg-slate-200" : ""}`}
                    onClick={() =>
                      setSelectedRow(selectedRow === index ? null : index)
                    }
                  >
                    {printNumber(row.return)}
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
                    {printNumber(row.endingBalance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal isOpen={openYears} onClose={() => setOpenYears(false)}>
        <div>
          <div className="mb-3 font-semibold text-lg">Manual Input</div>
          <div className="flex flex-col max-h-[500px] overflow-scroll gap-2 mb-4">
            {[
              ...Array(
                Math.max(
                  (settings.user.endYear || 0) - settings.payment.startYear + 1,
                  0,
                ),
              ).keys(),
            ].map((i) => (
              <div className="flex gap-3">
                <Input
                  label={`Year ${i + settings.payment.startYear}`}
                  subtype="money"
                  value={settings.payment.years[i + settings.payment.startYear]}
                  setValue={(value) =>
                    updateSettings("payment", "years", {
                      ...settings.payment.years,
                      [i + settings.payment.startYear]: value,
                    })
                  }
                />
                <div className="w-12">
                  <Button
                    type="secondary"
                    onClick={() => {
                      updateSettings(
                        "payment",
                        "years",
                        Object.fromEntries(
                          [
                            ...Array(
                              Math.max(
                                (settings.user.endYear || 0) -
                                settings.payment.startYear +
                                1,
                              ),
                            ).keys(),
                          ].map((k) => {
                            console.log(k);
                            if (k > i) return [k, settings.payment.years[i]];
                            else return [k, settings.payment.years[k]];
                          }),
                        ) as any,
                      );
                    }}
                  >
                    <div className="flex items-center justify-center h-6">
                      <ArrowDownIcon className="w-4 h-4" />
                    </div>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default VersatileCalculator;
