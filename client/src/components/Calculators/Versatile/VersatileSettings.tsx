import { useState } from "react";
import Input from "src/components/Inputs/Input";
import { CalculatorSettings, StoredCalculator } from "./versatileTypes";
import { useInfo } from "src/hooks/useData";
import Button from "src/components/Inputs/Button";
import { ArrowDownIcon, TableCellsIcon } from "@heroicons/react/24/outline";
import Select from "src/components/Inputs/Select";
import Modal from "src/components/Modal";
import { yearRange } from "src/utils";
import { Tooltip } from "flowbite-react";
import SmallToggle, { SmallTroggle } from "src/components/Inputs/SmallToggle";

const VersatileSettings = ({
  settings,
  print,
}: {
  settings: StoredCalculator;
  print: boolean;
}) => {
  const { setField } = useInfo();
  console.log("calc", settings);
  const [openYears, setOpenYears] = useState(false);
  const [openReturns, setOpenReturns] = useState(false);
  const disabled = !!settings.id;

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
    <div
      className={`grid ${print ? "grid-cols-2 grid-rows-2" : "grid-cols-1"} gap-6`}
    >
      <div className="flex flex-col gap-4 border p-4 rounded-lg shadow-md print:shadow-none bg-white">
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
              value={
                settings.user.presentValue !== null
                  ? Math.round(settings.user.presentValue)
                  : null
              }
              setValue={(value) =>
                updateSettings("user", "presentValue", value)
              }
              disabled={disabled}
            />{" "}
            <Input
              labelLength={100}
              width="!w-[130px]"
              size="!w-[130px]"
              label="End Value"
              subtype="money"
              tooltip={
                'Ending value is only used when using "Solve" functionality'
              }
              value={settings.user.endValue}
              setValue={(value) => updateSettings("user", "endValue", value)}
              disabled={disabled}
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
              disabled={disabled}
            />
            <Input
              label="Years"
              subtype="number"
              labelLength={80}
              width="!w-[50px]"
              value={settings.user.endYear}
              setValue={(value) => updateSettings("user", "endYear", value)}
              disabled={disabled}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 border p-4 rounded-lg shadow-md print:shadow-none bg-white">
        <div className="flex gap-7 justify-between items-center">
          <h2 className="text-xl font-semibold">Payment</h2>
          <div className="flex">
            <SmallToggle
              item1="Simple"
              item2="Detailed"
              active={
                settings.payment.type === "simple" ? "Simple" : "Detailed"
              }
              toggle={() =>
                updateSettings(
                  "payment",
                  "type",
                  settings.payment.type === "simple" ? "detailed" : "simple",
                )
              }
              disabled={disabled}
            />
          </div>
        </div>
        {settings.payment.type === "detailed" && (
          <div className="w-32 mx-auto print:hidden">
            <Button type="primary" onClick={() => setOpenYears(true)}>
              Open Years{" "}
            </Button>
          </div>
        )}
        {settings.payment.type === "simple" && (
          <div className="flex gap-6">
            <div className="flex gap-2">
              <Input
                labelLength={86}
                label="Payment ($)"
                subtype="money"
                size="md"
                width="!w-[99px]"
                value={
                  settings.payment.amount !== null
                    ? Math.round(settings.payment.amount)
                    : null
                }
                setValue={(value) => updateSettings("payment", "amount", value)}
                disabled={disabled}
              />

              <div className="print:hidden">
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
            </div>
            <Input
              label="Start Year"
              subtype="number"
              labelLength={72}
              width="!w-[50px]"
              value={settings.payment.startYear}
              setValue={(value) =>
                updateSettings("payment", "startYear", value)
              }
              disabled={disabled}
            />
          </div>
        )}
        <div className="flex gap-6">
          {" "}
          <Input
            label="Increase (%)"
            labelLength={100}
            width="!w-[80px]"
            subtype="percent"
            value={settings.payment.increase}
            setValue={(value) => updateSettings("payment", "increase", value)}
            disabled={disabled}
          />
          <div className="w-[168px]">
            <Select
              labelLength={60}
              label="Timing"
              disabled={disabled}
              width="!w-[80px]"
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
      <div className="flex flex-col gap-4 border p-4 rounded-lg shadow-md print:shadow-none bg-white">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Return</h2>
          <SmallTroggle
            item1="Simple"
            item2="Detailed"
            item3="Random"
            active={(settings.returns.returnType as any).capitalize()}
            set={(value: string) =>
              updateSettings("returns", "returnType", value.toLowerCase())
            }
            disabled={disabled}
          />
        </div>
        {settings.returns.returnType === "detailed" && (
          <div className="w-32 mx-auto mt-1 mb-1 print:invisible">
            <Button type="primary" onClick={() => setOpenReturns(true)}>
              Open Years
            </Button>
          </div>
        )}
        {settings.returns.returnType === "simple" && (
          <div className="flex flex-col gap-6 w-full">
            <div className="flex gap-2 w-[230px]">
              <Input
                label="Return (%)"
                labelLength={80}
                subtype="percent"
                value={Math.round(settings.returns.rateOfReturn * 100) / 100}
                setValue={(value) =>
                  updateSettings("returns", "rateOfReturn", value)
                }
                disabled={disabled}
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
                        "returns",
                        "yearlyReturns",
                        Object.fromEntries(
                          yearRange(0, settings.user.endYear).map((i) => [
                            i,
                            Math.round(100 * settings.returns.rateOfReturn) /
                              100,
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

        {settings.returns.returnType === "random" && (
          <div className="flex gap-6 w-full items-center justify-between min-w-[300px]">
            <div className="flex gap-4 flex-col">
              <Input
                label="Mean"
                labelLength={70}
                width="!w-[60px]"
                subtype="percent"
                value={settings.returns.mean}
                setValue={(value) => updateSettings("returns", "mean", value)}
                disabled={disabled}
              />
              <Input
                label="Std. Dev."
                labelLength={70}
                width="!w-[60px]"
                subtype="percent"
                value={settings.returns.std}
                setValue={(value) => updateSettings("returns", "std", value)}
                disabled={disabled}
              />
            </div>
            <div className="flex flex-col gap-4 w-[230px]">
              <div className="w-60">
                <Select
                  tooltip="This will determine what values are used in the Table, Summary, and Solve"
                  labelLength={260}
                  label="Sequence shown"
                  disabled={disabled}
                  options={[
                    { id: "worst", name: "Worst" },
                    { id: "25th", name: "25th" },
                    { id: "median", name: "Median" },
                    { id: "75th", name: "75th" },
                    { id: "best", name: "Best" },
                  ]}
                  selected={{
                    id: settings.returns.selectedRandom,
                    name: (
                      settings.returns.selectedRandom as any
                    )?.capitalize(),
                  }}
                  setSelected={(option) =>
                    updateSettings("returns", "selectedRandom", option.id)
                  }
                />
              </div>
              <div className="print:invisible">
                <Tooltip
                  content="Generate new sequence of returns."
                  theme={{ target: "" }}
                >
                  <Button
                    type="primary"
                    onClick={() => {
                      updateSettings(
                        "returns",
                        "seed",
                        (settings.returns.seed || 0) + 1,
                      );
                    }}
                    disabled={disabled}
                  >
                    Rerun
                  </Button>
                </Tooltip>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4 border p-4 rounded-lg shadow-md print:shadow-none bg-white">
        <div className="col-span-3">
          <h2 className="text-xl font-semibold">Other Settings</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 flex-col">
          <Input
            label="Taxes (%)"
            labelLength={80}
            subtype="percent"
            value={settings.other.taxRate}
            setValue={(value) => updateSettings("other", "taxRate", value)}
            disabled={disabled}
          />
          <Input
            label="Inflation (%)"
            labelLength={90}
            subtype="percent"
            value={settings.other.inflation}
            setValue={(value) => updateSettings("other", "inflation", value)}
            disabled={disabled}
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
            disabled={disabled}
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
              disabled={disabled}
            />
          </div>
          <div className="flex flex-col max-h-[500px] overflow-scroll gap-2 mb-4">
            {yearRange(settings.payment.startYear, settings.user.endYear).map(
              (i) => (
                <div className="flex gap-3">
                  <Input
                    label={`Year ${i}`}
                    subtype="money"
                    onPaste={(_: any) => {
                      // e.preventDefault();
                      // const text = e.clipboardData.getData("text");
                      // const values = text.split("\n") as any[];
                      // const newValues = values
                      //   .filter((i) => i)
                      //   .map((v) => parseFloat(v))
                      //   .filter((i) => !isNaN(i));
                      // console.log(text, values, newValues);
                      // if (newValues.length === 1) {
                      //   updateSettings("payment", "years", {
                      //     ...settings.payment.years,
                      //     [i + settings.payment.startYear]: newValues[0],
                      //   } as any);
                      // } else {
                      //   updateSettings("payment", "years", {
                      //     ...settings.payment.years,
                      //     ...(Object.fromEntries(
                      //       newValues.map((v, j) => [j + i, v]),
                      //     ) as any),
                      //   });
                      // }
                    }}
                    value={settings.payment.years[i]}
                    setValue={(value) =>
                      updateSettings("payment", "years", {
                        ...settings.payment.years,
                        [i]: value,
                      } as any)
                    }
                    disabled={disabled}
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
                      disabled={disabled}
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
        {settings.returns.returnType === "detailed" && (
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
                    value={settings.returns.yearlyReturns[year]}
                    setValue={(value) =>
                      updateSettings("returns", "yearlyReturns", {
                        ...settings.returns.yearlyReturns,
                        [year]: value,
                      } as any)
                    }
                    disabled={disabled}
                  />
                  <div className="w-12">
                    <Button
                      type="secondary"
                      onClick={() => {
                        updateSettings(
                          "returns",
                          "yearlyReturns",
                          Object.fromEntries(
                            [...Array(settings.user.endYear + 1).keys()].map(
                              (k) => {
                                if (k > year)
                                  return [
                                    k,
                                    settings.returns.yearlyReturns[year],
                                  ];
                                return [k, settings.returns.yearlyReturns[k]];
                              },
                            ),
                          ) as any,
                        );
                      }}
                      disabled={disabled}
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
