import React, { useState, useEffect } from "react";
import Input from "../Inputs/Input";
import Button from "../Inputs/Button";
import Select from "../Inputs/Select";
import { printNumber as printNumberOld } from "../../utils";
import Modal from "../Modal";

const printNumber = (s: number) =>
  s < 0 ? `(${printNumberOld(s).replace("-", "")})` : printNumberOld(s);

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

interface CalculatorSettings {
  user: {
    startAge: number;
    presentValue: number;
    endYear: number;
  };
  payment: {
    amount: number;
    timing: "beginning" | "end";
    increase: number;
    startYear: number;
    years: any;
    type: "simple" | "detailed";
  };
  other: {
    rateOfReturn: number;
    taxRate: number;
    inflation: number;
  };
}

const initialSettings = {
  user: {
    startAge: 0,
    presentValue: 0,
    endYear: 10,
  },
  payment: {
    amount: 0,
    timing: "beginning" as const,
    increase: 0,
    startYear: 0,
    years: {},
    type: "simple" as const,
  },
  other: {
    rateOfReturn: 0,
    taxRate: 0,
    inflation: 0,
  },
};

const VersatileCalculator: React.FC = () => {
  const [openYears, setOpenYears] = useState(false);
  const [selectedCol, setSelectedCol] = useState(null as any);
  const [selectedRow, setSelectedRow] = useState(null as any);
  const [settings, setSettings] = useState<CalculatorSettings>(initialSettings);
  const [calculations, setCalculations] = useState<CalculationRow[]>([]);
  console.log("init", initialSettings.other);

  useEffect(() => {
    const rows = calculateProjection(settings);
    setCalculations(rows);
  }, [settings]);

  const updateSettings = (
    category: keyof CalculatorSettings,
    field: string,
    value: number | string,
  ) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [category]: {
        ...prevSettings[category],
        [field]: value,
      },
    }));
  };

  const calculateProjection = (settings: CalculatorSettings) => {
    const rows: CalculationRow[] = [];
    let balance = settings.user.presentValue;

    for (let year = 1; year <= settings.user.endYear; year++) {
      const beginning = balance;

      let payment = 0;
      if (year >= settings.payment.startYear) {
        const yearsFromStart = year - settings.payment.startYear;
        if (settings.payment.type === "simple")
          payment =
            settings.payment.amount *
            Math.pow(1 + settings.payment.increase / 100, yearsFromStart) *
            -1;
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
        age: settings.user.startAge + year - 1,
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
      setSettings((prevSettings) => ({
        ...prevSettings,
        other: { ...prevSettings.other, rateOfReturn: mid },
      }));
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
    setSettings({
      ...settings,
      other: {
        ...settings.other,
        rateOfReturn: parseFloat(mid.toFixed(3)),
      },
    });
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Versatile Calculator</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="flex flex-col gap-4">
            <div className="col-span-3">
              <h2 className="text-xl font-semibold mb-4">User Settings</h2>
            </div>
            <Input
              label="Start Age"
              subtype="number"
              value={settings.user.startAge}
              setValue={(value) => updateSettings("user", "startAge", value)}
            />
            <Input
              label="Present Value"
              subtype="money"
              value={settings.user.presentValue}
              setValue={(value) =>
                updateSettings("user", "presentValue", value)
              }
            />
            <Input
              label="End Year"
              subtype="number"
              value={settings.user.endYear}
              setValue={(value) => updateSettings("user", "endYear", value)}
            />
            <Input
              label="Final Balance"
              subtype="text"
              value={printNumber(
                calculations.length &&
                calculations[calculations.length - 1].endingBalance,
              )}
              size="full"
              setValue={() => { }}
              disabled
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex gap-7 justify-between items-center mb-[16px]">
              <h2 className="text-xl font-semibold">Payment</h2>
              <div className="flex w-60 text-sm">
                <div
                  className={`w-full text-center py-1 ${settings.payment.type === "simple" ? "bg-orange-200" : ""} cursor-pointer rounded-md`}
                  onClick={() => updateSettings("payment", "type", "simple")}
                >
                  Simple
                </div>
                <div
                  className={`w-full text-center py-1 ${settings.payment.type === "detailed" ? "bg-orange-200" : ""} cursor-pointer rounded-md`}
                  onClick={() => updateSettings("payment", "type", "detailed")}
                >
                  Detailed
                </div>
              </div>
            </div>
            {settings.payment.type === "detailed" && (
              <div className="w-32 mx-auto mt-8 mb-8">
                <Button type="primary" onClick={() => setOpenYears(true)}>
                  Open Years{" "}
                </Button>
              </div>
            )}
            {settings.payment.type === "simple" && (
              <div className="flex flex-col gap-4">
                <Input
                  label="Payment Amount"
                  subtype="money"
                  value={settings.payment.amount}
                  setValue={(value) =>
                    updateSettings("payment", "amount", value)
                  }
                />
                <Input
                  label="Payment Increase (%)"
                  subtype="percent"
                  value={settings.payment.increase}
                  setValue={(value) =>
                    updateSettings("payment", "increase", value)
                  }
                />
              </div>
            )}{" "}
            <Select
              label="Payment Timing"
              options={[
                { id: "beginning", name: "Beginning of Year" },
                { id: "end", name: "End of Year" },
              ]}
              selected={{
                id: settings.payment.timing,
                name:
                  settings.payment.timing === "beginning"
                    ? "Beginning of Year"
                    : "End of Year",
              }}
              setSelected={(option) =>
                updateSettings("payment", "timing", option.id)
              }
            />
            <Input
              label="Payment Start Year"
              subtype="number"
              value={settings.payment.startYear}
              setValue={(value) =>
                updateSettings("payment", "startYear", value)
              }
            />
          </div>
          <div className="flex flex-col gap-4">
            <div className="col-span-3">
              <h2 className="text-xl font-semibold mb-4">Other Settings</h2>
            </div>
            <Input
              label="Rate of Return (%)"
              subtype="percent"
              value={settings.other.rateOfReturn}
              setValue={(value) =>
                updateSettings("other", "rateOfReturn", value)
              }
            />
            <Input
              label="Tax Rate (%)"
              subtype="percent"
              value={settings.other.taxRate}
              setValue={(value) => updateSettings("other", "taxRate", value)}
            />
            <Input
              label="Inflation (%)"
              subtype="percent"
              value={settings.other.inflation}
              setValue={(value) => updateSettings("other", "inflation", value)}
            />
            <div className="flex gap-4">
              <Button type="primary" onClick={handleSolveRateOfReturn}>
                Solve Rate of Return
              </Button>
              <Button
                type="secondary"
                onClick={() => {
                  console.log("setting to", initialSettings.other);
                  setSettings(initialSettings);
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
        <div className="">
          <table className="text-sm w-full">
            <thead
              className={`text-xs cursor-pointer bg-[#F9FAFB] text-black font-medium text-left sticky z-50 border-1 top-[72px]`}
            >
              <tr>
                <th
                  className="px-4 py-2"
                  onClick={() =>
                    selectedCol === "age"
                      ? setSelectedCol(null)
                      : setSelectedCol("age")
                  }
                >
                  Age/Year
                </th>
                <th
                  className="px-4 py-2"
                  onClick={() =>
                    selectedCol === "beginning"
                      ? setSelectedCol(null)
                      : setSelectedCol("beginning")
                  }
                >
                  Beginning
                </th>
                <th
                  className="px-4 py-2"
                  onClick={() =>
                    selectedCol === "total"
                      ? setSelectedCol(null)
                      : setSelectedCol("total")
                  }
                >
                  Total Payments
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
                    selectedCol === "growth"
                      ? setSelectedCol(null)
                      : setSelectedCol("growth")
                  }
                >
                  Growth
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
                  className="px-4 py-2"
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
                  <td
                    className={`border px-4 py-2 ${selectedCol === "age" ? "bg-slate-200" : ""}`}
                    onClick={() =>
                      setSelectedRow(selectedRow === index ? null : index)
                    }
                  >{`${row.age}/${row.year}`}</td>
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
                    className={`border px-4 py-2 ${selectedCol === "growth" ? "bg-slate-200" : ""}`}
                    onClick={() =>
                      setSelectedRow(selectedRow === index ? null : index)
                    }
                  >
                    {printNumber(row.growth)}
                  </td>
                  <td
                    className={`border px-4 py-2 ${selectedCol === "taxes" ? "bg-slate-200" : ""}`}
                    onClick={() =>
                      setSelectedRow(selectedRow === index ? null : index)
                    }
                  >
                    {printNumber(row.taxes)}
                  </td>
                  <td
                    className={`border px-4 py-2 ${selectedCol === "end" ? "bg-slate-200" : ""}`}
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
                  (settings.user.endYear || 0) - settings.payment.startYear,
                ),
                0,
              ).keys(),
            ].map((i) => (
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
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default VersatileCalculator;
