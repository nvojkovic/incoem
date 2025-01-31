import { useState } from "react";
import Input from "../Inputs/Input";
import { CalculatorSettings } from "./versatileTypes";
import { useInfo } from "src/useData";
import Button from "../Inputs/Button";
import { ArrowDownIcon, TableCellsIcon } from "@heroicons/react/24/outline";
import Select from "../Inputs/Select";
import Modal from "../Modal";
import { yearRange } from "src/utils";
import { Tooltip } from "flowbite-react";

const VersatileSettings = () => {
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

  return (
    <div className="flex flex-col gap-6 sticky top-[100px]">
      <div className="flex flex-col gap-4 border p-4 rounded-lg shadow-md bg-white">
        <div className="col-span-3">
          <h2 className="text-xl font-semibold">User Settings</h2>
        </div>
        <div className="flex gap-3 justify-between">
          <div className="flex flex-col gap-3">
            <Input
              labelLength={100}
              width="!w-[130px]"
              label="Present Value"
              subtype="money"
              value={settings.user.presentValue}
              setValue={(value) =>
                updateSettings("user", "presentValue", value)
              }
            />{" "}
            <Input
              labelLength={100}
              width="!w-[130px]"
              label="End Value"
              subtype="money"
              value={settings.user.endValue}
              setValue={(value) => updateSettings("user", "endValue", value)}
            />
          </div>
          <div className="flex flex-col gap-3">
            <Input
              label="Start Age"
              labelLength={80}
              width="!w-[50px]"
              subtype="number"
              value={settings.user.startAge}
              setValue={(value) => updateSettings("user", "startAge", value)}
            />
            <Input
              label="Years"
              subtype="number"
              labelLength={80}
              width="!w-[50px]"
              value={settings.user.endYear}
              setValue={(value) => updateSettings("user", "endYear", value)}
            />
          </div>
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

              <Tooltip
                content="Copy payment to every year in Detailed."
                theme={{ target: "" }}
              >
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
              </Tooltip>
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
      <div className="flex flex-col gap-4 border p-4 rounded-lg shadow-md bg-white">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Return</h2>
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
            <div
              className={`w-full text-center py-1 ${settings.other.returnType === "detailed" ? "bg-main-orange-light" : ""} cursor-pointer rounded-md`}
              onClick={() => updateSettings("other", "returnType", "detailed")}
            >
              Random
            </div>
          </div>
        </div>
        {settings.other.returnType === "detailed" && (
          <div className="w-32 mx-auto mt-1 mb-1">
            <Button type="primary" onClick={() => setOpenReturns(true)}>
              Open Years
            </Button>
          </div>
        )}
        {settings.other.returnType === "simple" && (
          <div className="flex flex-col gap-6 w-full">
            <div className="flex gap-2 w-[230px]">
              <Input
                label="Return (%)"
                labelLength={80}
                subtype="percent"
                value={Math.round(settings.other.rateOfReturn * 100) / 100}
                setValue={(value) =>
                  updateSettings("other", "rateOfReturn", value)
                }
              />
              <div className="w-10">
                <Tooltip
                  content="Copy returns to every year in Detailed."
                  theme={{ target: "" }}
                >
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
                </Tooltip>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4 border p-4 rounded-lg shadow-md bg-white">
        <div className="col-span-3">
          <h2 className="text-xl font-semibold mb-4">Other Settings</h2>
        </div>
        <div className="grid grid-cols-2 gap-6 flex-col">
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
            tooltip="Half of fee is applied at the beginning of year, half at end of year"
            labelLength={150}
            width="!w-[100px]"
            subtype="percent"
            value={settings.other.investmentFee}
            setValue={(value) =>
              updateSettings("other", "investmentFee", value)
            }
          />
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
              {yearRange(1, settings.user.endYear).map((year) => (
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

export default VersatileSettings;
