import {
  DocumentDuplicateIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useInfo } from "../../useData";
import Button from "../Inputs/Button";
import Input from "../Inputs/Input";
import MapSection from "../MapSection";
import YearlyIncrease from "./YearlyIncrease";
import { updateAtIndex, yearRange } from "../../utils";
import { calculateAge } from "../Info/PersonInfo";
import Layout from "../Layout";
import SpendingTable from "./SpendingTable";
import WhoDies from "../WhoDies";
import MainChart from "../Charts/MainChart";
import Confirm from "../Confirm";
import { useState } from "react";

export const calculateSpendingYear = (
  data: IncomeMapData,
  spending: RetirementSpendingSettings | undefined,
  settings: ScenarioSettings,
  year: number,
) => {
  if (!spending) return 0;
  const years = year - 2024;

  const inflationRate = (inflation: YearlyIncrease) => {
    if (!inflation || inflation.type == "none") return 0;
    else if (inflation.type == "custom") return (inflation.percent || 0) / 100;
    else if (inflation.type == "general") return settings.inflation / 100 || 0;
    else return -10e9;
  };

  const inflateAmount = (amount: number, inflation: YearlyIncrease) => {
    return amount * Math.pow(1 + inflationRate(inflation), years);
  };

  // back out existing spending
  const existing = spending.preSpending
    .map((item) => item.amount || 0)
    .reduce((a, b) => a + b, 0);

  let result = spending.currentSpending - existing;

  //back out death reduction
  if (settings.whoDies != -1 && settings.deathYears[settings.whoDies]) {
    const age =
      calculateAge(new Date(data.people[settings.whoDies].birthday)) + years;
    if (age > (settings.deathYears[settings.whoDies] as any)) {
      result = result * (1 - spending.decreaseAtDeath[settings.whoDies] / 100);
    }
  }
  // inflate by general
  result = inflateAmount(result, spending.yearlyIncrease);

  // add pre back in
  const pre = spending.preSpending
    ?.filter((item) => year <= item.endYear)
    .map((item) => inflateAmount(item.amount || 0, item.increase))
    .reduce((a, b) => a + b, 0);
  result += pre;

  // add post spending
  const post = spending.postSpending
    ?.filter(
      (item) => (item.endYear || 2100) >= year && (item.startYear || 0) <= year,
    )
    .map((item) => {
      let amount = item.amount || 0;
      if (settings.whoDies !== -1 && settings.deathYears[settings.whoDies]) {
        const age =
          calculateAge(new Date(data.people[settings.whoDies].birthday)) +
          years;
        if (age > (settings.deathYears[settings.whoDies] as any)) {
          amount *= 1 - item.changeAtDeath[settings.whoDies] / 100;
        }
      }
      return inflateAmount(amount, item.increase);
    })
    .reduce((a, b) => a + b, 0);
  result += post;

  if (settings.taxType == "Pre-Tax") {
    if (year <= (settings.retirementYear || 0)) {
      result /= 1 - (spending.preTaxRate || 0) / 100;
    } else {
      result /= 1 - (spending.postTaxRate || 0) / 100;
    }
  }
  if (settings.inflationType == "Real") {
    result = calculatePV(result, (settings.inflation || 0) / 100, years);
  }

  return Math.round(isNaN(result) ? 0 : result);
};
export const calculateSendingYear = (
  data: IncomeMapData,
  spending: RetirementSpendingSettings | undefined,
  settings: ScenarioSettings,
  year: number,
) => {
  if (!spending) return 0;
  const years = year - 2024;
  let result = 0;
  const inflationRate = (inflation: any) => {
    if (!inflation || inflation.type == "none") return 0;
    else if (inflation.type == "custom") return (inflation.percent || 0) / 100;
    else if (inflation.type == "general") return settings.inflation / 100 || 0;
    else return -10e9;
  };

  const inflateAmount = (amount: number, inflation: number) => {
    return amount * Math.pow(1 + inflation, years);
  };

  const pre = spending.preSpending
    ?.filter((item) => year > item.endYear)
    .map((item) =>
      inflateAmount(item.amount || 0, inflationRate(item.increase)),
    )
    .reduce((a, b) => a + b, 0);

  const uninflatedPre = spending.preSpending
    ?.map((item) => item.amount || 0)
    .reduce((a, b) => a + b, 0);
  const inflatedPre = spending.preSpending
    ?.map((item) =>
      inflateAmount(item.amount || 0, inflationRate(item.increase)),
    )
    .reduce((a, b) => a + b, 0);
  const post = spending.postSpending
    ?.filter(
      (item) => (item.endYear || 2100) >= year && (item.startYear || 0) <= year,
    )
    .map((item) => {
      let amount = item.amount || 0;
      if (settings.whoDies !== -1 && settings.deathYears[settings.whoDies]) {
        const age =
          calculateAge(new Date(data.people[settings.whoDies].birthday)) +
          years;
        if (age > (settings.deathYears[settings.whoDies] as any)) {
          amount *= 1 - item.changeAtDeath[settings.whoDies] / 100;
        }
      }
      return inflateAmount(amount, inflationRate(item.increase));
    })
    .reduce((a, b) => a + b, 0);

  result -= pre;
  result += post;

  let current = spending.currentSpending;
  if (settings.whoDies != -1 && settings.deathYears[settings.whoDies]) {
    const age =
      calculateAge(new Date(data.people[settings.whoDies].birthday)) + years;
    if (age > (settings.deathYears[settings.whoDies] as any)) {
      current =
        (current + result) * 1 -
        spending.decreaseAtDeath[settings.whoDies] / 100;
    }
  }

  result +=
    inflateAmount(
      current - uninflatedPre,
      inflationRate(spending.yearlyIncrease),
    ) + inflatedPre;
  if (settings.taxType == "Pre-Tax") {
    if (year <= (settings.retirementYear || 0)) {
      result /= 1 - (spending.preTaxRate || 0) / 100;
    } else {
      result /= 1 - (spending.postTaxRate || 0) / 100;
    }
  }
  if (settings.inflationType == "Real") {
    result = calculatePV(result, (settings.inflation || 0) / 100, years);
  }

  return Math.round(isNaN(result) ? 0 : result);
};

const currentYear = new Date().getFullYear();

const SpendingPage = () => {
  const { data, setSpending, setField: set } = useInfo();

  const settings = data.liveSettings;
  const setSettings = set("liveSettings");
  const setField = (key: string) => (val: any) => {
    setSpending({ ...spending, [key]: val });
  };

  const setPreSpending = (index: number, field: string, value: any) => {
    setField("preSpending")(
      spending.preSpending.map((item, i) =>
        index === i ? { ...item, [field]: value } : item,
      ),
    );
  };

  const setPostSpending = (index: number, field: string, value: any) => {
    setField("postSpending")(
      spending.postSpending.map((item, i) =>
        index === i ? { ...item, [field]: value } : item,
      ),
    );
  };

  const spending = data.spending || { yearlyIncrease: {} };

  const currentYearRange = yearRange(
    currentYear,
    currentYear + settings.maxYearsShown,
  );
  const calcSett = (settings: any) =>
    Math.max(
      ...currentYearRange.map((year) =>
        calculateSpendingYear(data.data, spending, settings, year),
      ),
    );

  const maxY = Math.max(
    ...[
      calcSett({ ...settings, whoDies: -1 }),
      // calcSett({ ...settings, whoDies: 0 }),
      // calcSett({ ...settings, whoDies: 1 }),
    ],
  );

  const [postDeleteOpen, setPostDeleteOpen] = useState(-1);
  const [preDeleteOpen, setPreDeleteOpen] = useState(-1);

  return (
    <Layout page="spending">
      <div className="flex flex-col gap-8">
        <MapSection
          title={<div className="py-2 px-3">Current Spending</div>}
          defaultOpen
        >
          <div className="flex gap-4">
            <div>
              <Input
                vertical
                size="lg"
                value={spending.currentSpending}
                setValue={(v) =>
                  setSpending({ ...spending, currentSpending: v })
                }
                subtype="money"
                label="Amount (Today's Dollars)"
              />
            </div>
            <YearlyIncrease
              labels
              increase={spending.yearlyIncrease}
              setYearlyIncrease={setField("yearlyIncrease")}
            />
            {data.data.people.map((v, i) => (
              <div>
                <Input
                  vertical
                  size="lg"
                  value={spending.decreaseAtDeath[i]}
                  setValue={(value) =>
                    setSpending({
                      ...spending,
                      decreaseAtDeath: spending.decreaseAtDeath.map(
                        (val, ind) => (ind == i ? value : val),
                      ) as any,
                    })
                  }
                  subtype="percent"
                  label={`Decrease at ${v.name} Death`}
                />
              </div>
            ))}
          </div>
        </MapSection>
        <MapSection
          title={
            <div className="flex gap-6 items-center w-full p-2">
              <div>Current Spending That Ends </div>
              <div className="w-32">
                <Button
                  type="primary"
                  className="!py-1"
                  onClick={(e) => {
                    e.stopPropagation();

                    setField("preSpending")([
                      ...spending.preSpending,
                      { increase: { type: "general" } },
                    ]);
                  }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <PlusIcon className="h-4" />
                    Add
                  </div>
                </Button>
              </div>
            </div>
          }
          toggleabble
          defaultOpen
        >
          <table className="w-full">
            <thead
              className={`text-xs cursor-pointer text-left sticky z-50 border-1 !font-normal`}
            >
              <tr>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">
                  Amount <br />
                  (Today's Dollars)
                </th>
                <th className="px-6 py-3 font-medium">
                  Ends <br />
                  (Cal Year)
                </th>
                <th className="px-6 py-3 font-medium">
                  Yearly <br /> Increase{" "}
                  {spending.preSpending.find(
                    (i) => i.increase.type === "custom",
                  ) && (
                      <div className="inline-block ml-16">Increase (%)</div>
                    )}{" "}
                </th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {spending.preSpending.map((line, index) => (
                <tr className="">
                  <td className="px-2 py-2 w-[500px]">
                    <Input
                      vertical
                      value={line.category}
                      setValue={(v) => setPreSpending(index, "category", v)}
                      size="full"
                      subtype="text"
                      label={``}
                    />
                  </td>
                  <td className="px-2 py-2">
                    <Input
                      label=""
                      vertical
                      size="full"
                      value={line.amount}
                      setValue={(v) => setPreSpending(index, "amount", v)}
                      subtype="money"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <Input
                      label=""
                      vertical
                      size="full"
                      value={line.endYear}
                      setValue={(v) => setPreSpending(index, "endYear", v)}
                      subtype="number"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <YearlyIncrease
                      labels={false}
                      increase={line.increase}
                      setYearlyIncrease={(v: any) =>
                        setPreSpending(index, "increase", v)
                      }
                    />
                  </td>
                  <td className="px-2 py-2">
                    <div className="flex gap-3">
                      <Button
                        type="secondary"
                        onClick={() => {
                          setField("preSpending")(
                            spending.preSpending.flatMap((item, ind) =>
                              ind === index ? [item, { ...item }] : [item],
                            ),
                          );
                        }}
                      >
                        <div className="flex justify-center">
                          <DocumentDuplicateIcon className="h-5 text-black" />
                        </div>
                      </Button>

                      <Confirm
                        isOpen={preDeleteOpen === index}
                        onClose={() => setPreDeleteOpen(-1)}
                        onConfirm={(_: any) => {
                          setPreDeleteOpen(-1);
                          setField("preSpending")(
                            spending.preSpending.filter(
                              (_, ind) => ind !== index,
                            ),
                          );
                        }}
                      >
                        <TrashIcon className="text-slate-400 w-10 m-auto mb-5" />
                        <div className="mb-5">
                          Are you sure you want to delete this spending?
                        </div>
                      </Confirm>
                      <Button
                        type="secondary"
                        onClick={() => {
                          return setPreDeleteOpen(index);
                          if (
                            confirm(
                              "Are you sure you want to delete this spending?",
                            )
                          )
                            setField("preSpending")(
                              spending.preSpending.filter(
                                (_, ind) => ind !== index,
                              ),
                            );
                        }}
                      >
                        <div className="flex justify-center">
                          <TrashIcon className="h-5 text-red-500" />
                        </div>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </MapSection>
        <MapSection
          title={
            <div className="flex gap-6 items-center w-full p-2">
              <div>New Spending </div>
              <div className="w-32">
                <Button
                  type="primary"
                  className="!py-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setField("postSpending")([
                      ...spending.postSpending,
                      {
                        increase: { type: "general" },
                        changeAtDeath: data.data.people.map((_) => 0),
                      },
                    ]);
                  }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <PlusIcon className="h-4" />
                    Add
                  </div>
                </Button>
              </div>
            </div>
          }
          toggleabble
          defaultOpen
        >
          <table className=" w-full bg-white">
            <thead
              className={`text-xs cursor-pointer text-left sticky z-50 border-1 text-black font-medium`}
            >
              <tr>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">
                  Amount
                  <br /> (Today's Dollars)
                </th>
                <th className="px-6 py-3 font-medium">
                  Starts <br />
                  (Cal Year)
                </th>
                <th className="px-6 py-3 font-medium">
                  Ends <br />
                  (Cal Year)
                </th>
                <th
                  className={`px-6 py-3 font-medium ${spending.postSpending.find(
                    (i) => i.increase.type === "custom",
                  ) && "w-64"
                    }`}
                >
                  Yearly <br /> Increase{" "}
                  {spending.postSpending.find(
                    (i) => i.increase.type === "custom",
                  ) && (
                      <div className="inline-block ml-8">Increase (%)</div>
                    )}{" "}
                </th>

                {data.data.people.map((i) => (
                  <th className="px-6 py-3 font-medium">
                    Decrease at <br />
                    {i.name} Death
                  </th>
                ))}

                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {spending.postSpending.map((line, index) => (
                <tr className="">
                  <td className="px-2 py-2 w-[500px]">
                    <Input
                      vertical
                      value={line.category}
                      setValue={(v) => setPostSpending(index, "category", v)}
                      size="full"
                      subtype="text"
                      label={``}
                    />
                  </td>
                  <td className="px-2 py-2">
                    <Input
                      label=""
                      vertical
                      size="md"
                      value={line.amount}
                      setValue={(v) => setPostSpending(index, "amount", v)}
                      subtype="money"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <Input
                      label=""
                      vertical
                      width="!w-[128px]"
                      value={line.startYear}
                      setValue={(v) => setPostSpending(index, "startYear", v)}
                      subtype="number"
                    />
                  </td>

                  <td className="px-2 py-2">
                    <Input
                      label=""
                      vertical
                      size="md"
                      value={line.endYear}
                      width="!w-[122px]"
                      setValue={(v) => setPostSpending(index, "endYear", v)}
                      subtype="number"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <YearlyIncrease
                      labels={false}
                      increase={line.increase}
                      setYearlyIncrease={(v: any) =>
                        setPostSpending(index, "increase", v)
                      }
                    />
                  </td>
                  {data.data.people.map((_, index2) => (
                    <td className="px-2 py-2">
                      <Input
                        vertical
                        size="md"
                        value={line.changeAtDeath[index2]}
                        setValue={(v) =>
                          setPostSpending(
                            index,
                            "changeAtDeath",
                            line.changeAtDeath.map((i, ind) =>
                              ind == index2 ? v : i,
                            ),
                          )
                        }
                        subtype="percent"
                        label={``}
                      />
                    </td>
                  ))}
                  <td className="px-2 py-3 flex gap-2 items-center">
                    <Button
                      type="secondary"
                      onClick={() => {
                        setField("postSpending")(
                          spending.postSpending.flatMap((item, ind) =>
                            ind === index ? [item, { ...item }] : [item],
                          ),
                        );
                      }}
                    >
                      <div className="flex justify-center">
                        <DocumentDuplicateIcon className="h-5 text-black" />
                      </div>
                    </Button>

                    <Confirm
                      isOpen={postDeleteOpen === index}
                      onClose={() => setPostDeleteOpen(-1)}
                      onConfirm={(_: any) => {
                        setPostDeleteOpen(-1);
                        setField("postSpending")(
                          spending.postSpending.filter(
                            (_, ind) => ind !== index,
                          ),
                        );
                      }}
                    >
                      <TrashIcon className="text-slate-400 w-10 m-auto mb-5" />
                      <div className="mb-5">
                        Are you sure you want to delete this spending?
                      </div>
                    </Confirm>
                    <Button
                      type="secondary"
                      onClick={() => {
                        return setPostDeleteOpen(index);
                        if (
                          confirm(
                            "Are you sure you want to delete this spending?",
                          )
                        )
                          setField("postSpending")(
                            spending.postSpending.filter(
                              (_, ind) => ind !== index,
                            ),
                          );
                      }}
                    >
                      <div className="flex justify-center">
                        <TrashIcon className="h-5 text-red-500" />
                      </div>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </MapSection>
        <MapSection
          title={<div className="py-2 px-3">Spending Needs</div>}
          toggleabble
          defaultOpen
        >
          <div className="flex gap-6 p-3">
            <div className="border rounded-lg p-3 h-[96px] bg-white">
              <div className="flex gap-4">
                <div>
                  <MultiToggle
                    options={["Real", "Nominal"]}
                    label="Inflation"
                    value={settings.inflationType}
                    setValue={(v: any) =>
                      setSettings({ ...settings, inflationType: v })
                    }
                  />
                </div>
                <div className="mt-1">
                  <Input
                    label="Amount"
                    width="!w-16"
                    value={settings.inflation}
                    setValue={(v: any) =>
                      setSettings({ ...settings, inflation: v })
                    }
                    subtype="percent"
                    vertical
                    size="md"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-6 mb-5 w-full">
              <div className="border rounded-lg p-3 flex gap-3 bg-white">
                <div className="w-60">
                  <MultiToggle
                    options={["Pre-Tax", "Post-Tax"]}
                    label="Taxation"
                    value={settings.taxType}
                    setValue={(v: any) =>
                      setSettings({ ...settings, taxType: v })
                    }
                  />
                </div>
                <div className="mt-1">
                  <Input
                    vertical
                    size="lg"
                    value={spending.preTaxRate}
                    setValue={(v) =>
                      setSpending({ ...spending, preTaxRate: v })
                    }
                    subtype="percent"
                    label={"Pre-Retirement Tax Rate"}
                  />
                </div>
                <div className="mt-1">
                  <Input
                    vertical
                    size="lg"
                    value={spending.postTaxRate}
                    setValue={(v) =>
                      setSpending({ ...spending, postTaxRate: v })
                    }
                    subtype="percent"
                    label={"Post-Retirement Tax Rate"}
                  />
                </div>
                <div className="mt-1">
                  <Input
                    label="Retirement Year"
                    value={settings.retirementYear}
                    setValue={(v: any) =>
                      setSettings({ ...settings, retirementYear: v })
                    }
                    subtype="number"
                    vertical
                    size="md"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-6 mb-10">
            {data.data.people.length > 1 ? (
              <div className="border rounded-lg p-3 bg-white">
                <div className="flex flex-col">
                  <div className="text-sm text-[#344054] mb-1">Mortality</div>
                  <div className="flex">
                    <WhoDies
                      active={settings.whoDies == -1}
                      setWhoDies={(i: number) =>
                        setSettings({
                          ...settings,
                          whoDies: i,
                        })
                      }
                      i={-1}
                      title="Both Alive"
                    />

                    {data.data.people.map((person, i) => (
                      <WhoDies
                        active={settings.whoDies == i}
                        key={person.id}
                        age={settings.deathYears[i]}
                        setAge={(e: any) =>
                          setSettings({
                            ...settings,
                            deathYears: updateAtIndex(
                              settings.deathYears,
                              i,
                              parseInt(e),
                            ),
                          })
                        }
                        setWhoDies={(i: number) =>
                          setSettings({
                            ...settings,
                            whoDies: i,
                          })
                        }
                        i={i}
                        title={`${person.name} Dies At`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
            <div className="border rounded-lg p-3 bg-white">
              <Input
                label="Years Shown"
                value={settings.maxYearsShown}
                setValue={(v: any) =>
                  setSettings({ ...settings, maxYearsShown: v })
                }
                subtype="number"
                vertical
                size="md"
              />
            </div>
          </div>
          <div className="bg-white pb-[2px]">
            <MainChart
              maxY={maxY}
              longevityFlag={false}
              people={[]}
              initialHeight={window.innerHeight - 400}
              stability={data.stabilityRatioFlag}
              needsFlag={data.needsFlag}
              years={yearRange(
                currentYear,
                currentYear + settings.maxYearsShown,
              )}
              lineData={yearRange(
                currentYear,
                currentYear + settings.maxYearsShown,
              ).map((_) => 0)}
              stackedData={[
                {
                  name: "Spending",
                  stable: true,
                  values: yearRange(
                    currentYear,
                    currentYear + settings.maxYearsShown,
                  ).map((year) =>
                    calculateSpendingYear(data.data, spending, settings, year),
                  ),
                },
              ]}
              spending={true}
            />
          </div>
        </MapSection>
        <MapSection defaultOpen title="">
          <SpendingTable
            settings={settings}
            spending={spending}
            data={data.data}
          />
        </MapSection>
      </div>
    </Layout>
  );
};

export const MultiToggle = ({ label, value, options, setValue }: any) => {
  return (
    <div className="">
      <label className="text-sm text-[#344054] w-36 ">{label}</label>
      <div className="flex gap-2 mt-[6px]">
        {options.map((item: any) => (
          <button
            key={item}
            className={`text-sm flex-1 py-[7px] px-4 rounded ${value === item ? "bg-main-orange text-white" : "bg-gray-200"
              }`}
            onClick={() => setValue(item)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

function calculatePV(futureValue: any, interestRate: any, periods: any) {
  return futureValue / Math.pow(1 + interestRate, periods);
}

export default SpendingPage;
