import React, { useState, useEffect } from "react";
import Input from "../Inputs/Input";
import Button from "../Inputs/Button";
import Select from "../Inputs/Select";
import { convertToParens, printNumber, yearRange } from "../../utils";
import Modal from "../Modal";
import { CalculatorSettings, initialVersatileSettings } from "./versatileTypes";
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { useInfo } from "../../useData";
import Layout from "../Layout";
import { Link } from "react-router-dom";
import { Tooltip } from "flowbite-react";
import VersatileBalance from "../Charts/VersatileBalance";

interface CalculationRow {
  age: number;
  ranOut: boolean;
  year: number;
  beginning: number;
  totalPayments: number;
  return: number;
  growth: number;
  taxes: number;
  endingBalance: number;
  realBalance: number;
}

const VersatileCalculator: React.FC = () => {
  const { data: client, setField } = useInfo();
  const settings = client.versatileCalculator as CalculatorSettings;
  console.log("calc", settings);
  const [openYears, setOpenYears] = useState(false);
  const [openReturns, setOpenReturns] = useState(false);
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
      const realBalance = beginning;

      // Calculate payment
      let payment = 0;
      if (year >= settings.payment.startYear) {
        const yearsFromStart = year - settings.payment.startYear;
        if (settings.payment.type === "simple") {
          payment =
            -(
              settings.payment.amount *
              Math.pow(1 + settings.payment.increase / 100, yearsFromStart)
            ) / Math.pow(1 + settings.other.inflation / 100, yearsFromStart);
        } else {
          payment = -settings.payment.years[year] || 0;
        }
      }

      // Handle beginning of year payment
      let ending = beginning;
      if (settings.payment.timing === "beginning") {
        if (beginning <= 0 || -payment >= ending) {
          rows.push({
            age: settings.user.startAge + year,
            year,
            beginning: beginning <= 0 ? 0 : beginning,
            totalPayments: 0,
            return: 0,
            growth: 0,
            taxes: 0,
            endingBalance: 0,
            realBalance: realBalance + payment,
            ranOut: true,
          });
          balance = 0;
          continue;
        }
        ending += payment;
      }

      // Apply inflation
      ending /= 1 + settings.other.inflation / 100;

      // Calculate returns and taxes
      let returnRate = settings.other.rateOfReturn;
      if (settings.other.returnType === "detailed") {
        returnRate = settings.other.yearlyReturns[year] || 0;
      }
      const returnAmount = ending > 0 ? ending * (returnRate / 100) : 0;
      const taxes = Math.max(returnAmount * (settings.other.taxRate / 100), 0);
      const growth = returnAmount - taxes;

      // Handle end of year payment
      if (settings.payment.timing === "end") {
        if (ending <= 0 || -payment >= ending) {
          rows.push({
            age: settings.user.startAge + year,
            year,
            beginning: beginning <= 0 ? 0 : beginning,
            totalPayments: 0,
            return: 0,
            growth: 0,
            taxes: 0,
            endingBalance: 0,
            realBalance: realBalance + payment,
            ranOut: true,
          });
          balance = 0;
          continue;
        }
        ending += payment;
      }

      ending += growth;

      rows.push({
        age: settings.user.startAge + year,
        year,
        beginning: beginning <= 0 ? 0 : beginning,
        totalPayments: beginning <= 0 ? 0 : payment,
        return: returnAmount,
        growth,
        taxes,
        endingBalance: ending,
        realBalance: ending,
        ranOut: false,
      });

      balance = ending;
    }
    return rows;
  };

  const handleSolveRateOfReturn = () => {
    const targetEndingBalance = settings.user.endValue || 0;
    let low = 0;
    let high = 100;
    let mid = 0;
    let iteration = 0;
    const maxIterations = 200;
    const tolerance = 0.001;

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

      console.log(mid, low, high, lastRow.realBalance);
      if (Math.abs(lastRow.realBalance - targetEndingBalance) < tolerance) {
        break;
      }

      if (lastRow.realBalance > targetEndingBalance) {
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
        rateOfReturn: mid,
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
        <div className="sticky top-[72px] bg-[#f3f4f6]">
          <div className="flex lg:flex-row flex-col gap-6 pb-8 py-4 ">
            <div className="flex flex-col gap-4 border p-4 rounded-lg shadow-md bg-white">
              <div className="col-span-3">
                <h2 className="text-xl font-semibold mb-4">User Settings</h2>
              </div>
              <div className="flex gap-6 flex-col">
                <Input
                  labelLength={100}
                  width="!w-[130px]"
                  label="Present Value"
                  subtype="money"
                  value={settings.user.presentValue}
                  setValue={(value) =>
                    updateSettings("user", "presentValue", value)
                  }
                />
                <Input
                  labelLength={100}
                  width="!w-[130px]"
                  label="End Value"
                  subtype="money"
                  value={settings.user.endValue}
                  setValue={(value) =>
                    updateSettings("user", "endValue", value)
                  }
                />
              </div>

              <div className="flex gap-6">
                <Input
                  label="Start Age"
                  labelLength={100}
                  subtype="number"
                  value={settings.user.startAge}
                  setValue={(value) =>
                    updateSettings("user", "startAge", value)
                  }
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
                    onClick={() =>
                      updateSettings("payment", "type", "detailed")
                    }
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
                    width="!w-[100px]"
                    value={settings.payment.amount}
                    setValue={(value) =>
                      updateSettings("payment", "amount", value)
                    }
                  />
                  <Input
                    label="Increase (%)"
                    labelLength={100}
                    width="!w-[80px]"
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
                  labelLength={80}
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
            <div className="flex flex-col gap-4 border p-4 rounded-lg shadow-md bg-white max-w-[320px]">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold mb-4">Return</h2>
                <div className="flex w-48 text-sm">
                  <div
                    className={`w-full text-center py-1 ${settings.other.returnType === "simple" ? "bg-main-orange-light" : ""} cursor-pointer rounded-md`}
                    onClick={() =>
                      updateSettings("other", "returnType", "simple")
                    }
                  >
                    Simple
                  </div>
                  <div
                    className={`w-full text-center py-1 ${settings.other.returnType === "detailed" ? "bg-main-orange-light" : ""} cursor-pointer rounded-md`}
                    onClick={() =>
                      updateSettings("other", "returnType", "detailed")
                    }
                  >
                    Detailed
                  </div>
                </div>
              </div>
              <div className="flex gap-7 justify-between items-center mb-[16px]"></div>
              {settings.other.returnType === "detailed" && (
                <div className="w-32 mx-auto mt-1 mb-1">
                  <Button type="primary" onClick={() => setOpenReturns(true)}>
                    Open Years
                  </Button>
                </div>
              )}
              {settings.other.returnType === "simple" && (
                <div className="flex flex-col gap-6">
                  <Input
                    label="Return (%)"
                    labelLength={80}
                    subtype="percent"
                    value={
                      Math.round(settings.other.rateOfReturn * 1000) / 1000
                    }
                    setValue={(value) =>
                      updateSettings("other", "rateOfReturn", value)
                    }
                  />
                  <div className="">
                    <Button type="primary" onClick={handleSolveRateOfReturn}>
                      Solve
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-4 border p-4 rounded-lg shadow-md bg-white ">
              <div className="col-span-3">
                <h2 className="text-xl font-semibold mb-4">Other Settings</h2>
              </div>
              <div className="flex gap-6 flex-col">
                <Input
                  label="Taxes (%)"
                  labelLength={80}
                  subtype="percent"
                  value={settings.other.taxRate}
                  setValue={(value) =>
                    updateSettings("other", "taxRate", value)
                  }
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
                <Input
                  label="Investment Fee (%)"
                  labelLength={90}
                  subtype="percent"
                  value={settings.other.investmentFee}
                  setValue={(value) =>
                    updateSettings("other", "investmentFee", value)
                  }
                />
              </div>
            </div>
          </div>
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
            residual: i.return - i.taxes,
            payment: Math.abs(i.totalPayments),
            tax: i.taxes,
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
      <Modal isOpen={openYears} onClose={() => setOpenYears(false)}>
        <div>
          <div className="mb-3 font-semibold text-lg">Manual Input</div>
          <div className="mb-5 w-64 mx-auto">
            <Input
              label="Increase (%)"
              subtype="percent"
              value={settings.payment.detailedIncrease}
              setValue={(value) =>
                updateSettings("payment", "detailedIncrease", value)
              }
            />
          </div>
          <div className="flex flex-col max-h-[500px] overflow-scroll gap-2 mb-4">
            {yearRange(settings.payment.startYear, settings.user.endYear).map(
              (i) => (
                <div className="flex gap-3">
                  <Input
                    label={`Year ${i}`}
                    subtype="money"
                    onPaste={(e: any) => {
                      e.preventDefault();
                      const text = e.clipboardData.getData("text");
                      const values = text.split("\n") as any[];
                      const newValues = values
                        .filter((i) => i)
                        .map((v) => parseFloat(v))
                        .filter((i) => !isNaN(i));
                      console.log(text, values, newValues);
                      if (newValues.length === 1) {
                        updateSettings("payment", "years", {
                          ...settings.payment.years,
                          [i + settings.payment.startYear]: newValues[0],
                        });
                      } else {
                        updateSettings("payment", "years", {
                          ...settings.payment.years,
                          ...(Object.fromEntries(
                            newValues.map((v, j) => [j + i, v]),
                          ) as any),
                        });
                      }
                    }}
                    value={settings.payment.years[i]}
                    setValue={(value) =>
                      updateSettings("payment", "years", {
                        ...settings.payment.years,
                        [i]: value,
                      } as any)
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
                            yearRange(
                              settings.payment.startYear,
                              settings.user.endYear,
                            ).map((k) => {
                              if (k > i)
                                return [
                                  k,
                                  settings.payment.years[i] *
                                  Math.pow(
                                    1 +
                                    (settings.payment.detailedIncrease ||
                                      0) /
                                    100,
                                    k - i,
                                  ),
                                ];
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
              ),
            )}
          </div>
        </div>
      </Modal>
      <Modal isOpen={openReturns} onClose={() => setOpenReturns(false)}>
        {settings.other.returnType === "detailed" && (
          <div>
            <div className="mb-3 font-semibold text-lg">
              Return Rates by Year
            </div>
            <div className="flex flex-col max-h-[500px] overflow-scroll gap-2 mb-4">
              {[...Array(settings.user.endYear + 1).keys()].map((year) => (
                <div className="flex gap-3" key={year}>
                  <Input
                    label={`Year ${year}`}
                    subtype="percent"
                    value={settings.other.yearlyReturns[year]}
                    setValue={(value) =>
                      updateSettings("other", "yearlyReturns", {
                        ...settings.other.yearlyReturns,
                        [year]: value,
                      } as any)
                    }
                  />
                  <div className="w-12">
                    <Button
                      type="secondary"
                      onClick={() => {
                        updateSettings(
                          "other",
                          "yearlyReturns",
                          Object.fromEntries(
                            [...Array(settings.user.endYear + 1).keys()].map(
                              (k) => {
                                if (k > year)
                                  return [
                                    k,
                                    settings.other.yearlyReturns[year],
                                  ];
                                return [k, settings.other.yearlyReturns[k]];
                              },
                            ),
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
        )}
      </Modal>
    </Layout>
  );
};

export default VersatileCalculator;
