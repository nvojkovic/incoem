import { useState } from "react";
import Input from "../Inputs/Input";
import { CalculatorSettings, calculateProjection } from "./versatileTypes";
import { useInfo } from "src/useData";
import Button from "../Inputs/Button";
import { ArrowDownIcon, TableCellsIcon } from "@heroicons/react/24/outline";
import Select from "../Inputs/Select";
import Modal from "../Modal";
import { yearRange } from "src/utils";

const Header = () => {
  const { data: client, setField } = useInfo();
  const settings = client.versatileCalculator as CalculatorSettings;
  console.log("calc", settings);
  const [openYears, setOpenYears] = useState(false);
  const [openReturns, setOpenReturns] = useState(false);

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

  const solveOptions = [
    { id: "return", name: "Rate of Return" },
    { id: "presentValue", name: "Present Value" },
  ];
  const handleSolveRateOfReturn = () => {
    const targetEndingBalance = settings.user.endValue || 0;
    let low = 0;
    let high = 100;
    let mid = 0;
    let iteration = 0;
    const maxIterations = 200;
    const tolerance = 0.001;

    const testSettings = structuredClone(settings);
    testSettings.other.returnType = "simple";
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
        returnType: "simple",
      },
    });
  };

  const handleSolvePresentValue = () => {
    const targetEndingBalance = settings.user.endValue || 0;
    let low = 0;
    let high = 10000000;
    let mid = 0;
    let iteration = 0;
    const maxIterations = 200;
    const tolerance = 0.001;

    const testSettings = structuredClone(settings);
    while (iteration < maxIterations) {
      mid = (low + high) / 2;
      testSettings.user.presentValue = mid;
      setField("versatileCalculator")({
        ...settings,
        user: { ...settings.other, presentValue: mid },
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
      user: {
        ...settings.user,
        presentValue: Math.round(mid),
      },
    });
  };

  const solve = () => {
    if (settings.solve.field === "return" || !settings.solve.field) {
      handleSolveRateOfReturn();
    } else if (settings.solve.field === "presentValue") {
      handleSolvePresentValue();
    }
  };
  return (
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
            setValue={(value) => updateSettings("user", "presentValue", value)}
          />
          <Input
            labelLength={100}
            width="!w-[130px]"
            label="End Value"
            subtype="money"
            value={settings.user.endValue}
            setValue={(value) => updateSettings("user", "endValue", value)}
          />
        </div>

        <div className="flex gap-6">
          <Input
            label="Start Age"
            labelLength={60}
            width="!w-[50px]"
            subtype="number"
            value={settings.user.startAge}
            setValue={(value) => updateSettings("user", "startAge", value)}
          />
          <Input
            label="Years"
            subtype="number"
            labelLength={40}
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
            <div className="flex gap-2">
              <Input
                labelLength={90}
                label="Payment ($)"
                subtype="money"
                size="md"
                width="!w-[100px]"
                value={settings.payment.amount}
                setValue={(value) => updateSettings("payment", "amount", value)}
              />
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
                      ).map((i) => [i, settings.payment.amount]),
                    ) as any,
                  );
                }}
              >
                <TableCellsIcon className="h-5 w-5" />
              </Button>
            </div>
            <Input
              label="Increase (%)"
              labelLength={100}
              width="!w-[80px]"
              subtype="percent"
              value={settings.payment.increase}
              setValue={(value) => updateSettings("payment", "increase", value)}
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
            setValue={(value) => updateSettings("payment", "startYear", value)}
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
                name: settings.payment.timing === "beginning" ? "BoY" : "EoY",
              }}
              setSelected={(option) =>
                updateSettings("payment", "timing", option.id)
              }
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 border p-4 rounded-lg shadow-md bg-white max-w-[320px]">
        <div className="flex flex-col justify-between items-center">
          <h2 className="text-xl font-semibold mb-4">Return</h2>
          <div className="flex w-48 text-sm">
            <div
              className={`w-full text-center py-1 ${settings.other.returnType === "simple" ? "bg-main-orange-light" : ""} cursor-pointer rounded-md`}
              onClick={() => updateSettings("other", "returnType", "simple")}
            >
              Simple
            </div>
            <div
              className={`w-full text-center py-1 ${settings.other.returnType === "detailed" ? "bg-main-orange-light" : ""} cursor-pointer rounded-md`}
              onClick={() => updateSettings("other", "returnType", "detailed")}
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
            <div className="flex flex-col gap-2">
              <Input
                label="Return (%)"
                vertical
                subtype="percent"
                value={Math.round(settings.other.rateOfReturn * 100) / 100}
                setValue={(value) =>
                  updateSettings("other", "rateOfReturn", value)
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
                        yearRange(0, settings.user.endYear).map((i) => [
                          i,
                          Math.round(100 * settings.other.rateOfReturn) / 100,
                        ]),
                      ) as any,
                    );
                  }}
                >
                  <TableCellsIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4 border p-4 rounded-lg shadow-md bg-white">
        <div className="col-span-3">
          <h2 className="text-xl font-semibold mb-4">Other Settings</h2>
        </div>
        <div className="flex gap-6 flex-col">
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
            setValue={(value) => updateSettings("other", "inflation", value)}
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

      <div className="flex flex-col gap-4 border p-4 rounded-lg shadow-md bg-white ">
        <div className="col-span-3">
          <h2 className="text-xl font-semibold mb-4">Solve</h2>
        </div>
        <div className="flex gap-6 flex-col">
          <Select
            vertical
            width="!w-[160px]"
            label="Field"
            options={solveOptions}
            selected={
              solveOptions.find((o) => o.id === settings.solve.field) || {
                id: "return",
                name: "Rate of Return",
              }
            }
            setSelected={(option) =>
              updateSettings("solve", "field", option.id)
            }
          />
        </div>
        <div className="">
          <Button type="primary" onClick={solve}>
            Solve
          </Button>
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
                        } as any);
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
                                  Math.round(
                                    settings.payment.years[i] *
                                    Math.pow(
                                      1 +
                                      (settings.payment.detailedIncrease ||
                                        0) /
                                      100,
                                      k - i,
                                    ),
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
    </div>
  );
};

export default Header;
