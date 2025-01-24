import {
  DocumentDuplicateIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useInfo } from "../../useData";
import Button from "../Inputs/Button";
import Input from "../Inputs/Input";
import MapSection from "../MapSection";
import YearlyIncreaseComponent from "./YearlyIncrease";
import {
  convertToMoYr,
  getTaxRate,
  updateAtIndex,
  yearRange,
} from "../../utils";
import Layout from "../Layout";
import SpendingTable from "./SpendingTable";
import WhoDies from "../WhoDies";
import Confirm from "../Confirm";
import { useState } from "react";
import SpendingChart from "../Charts/SpendingChart";
import { calculateSpendingYear, getSpendingItemOverYears } from "./calculate";
import calculate from "src/calculator/calculate";
import {
  CurrentSpending,
  Income,
  NewSpending,
  ScenarioSettings,
} from "src/types";

const currentYear = new Date().getFullYear();

const SpendingPage = () => {
  const { data, setSpending, setField: set } = useInfo();

  const settings = data.liveSettings;
  const setSettings = set("liveSettings");
  const setField = (key: string) => (val: any) => {
    setSpending({ ...spending, [key]: val });
  };

  const startYear = currentYear;
  const years = yearRange(startYear, startYear + settings.maxYearsShown);

  const divisionFactor = settings.monthlyYearly === "monthly" ? 12 : 1;

  const calculateOne = (income: Income, currentYear: number) => {
    const result = calculate({
      people: data.people,
      income,
      startYear,
      currentYear,
      deathYears: settings.deathYears as any,
      dead: settings.whoDies,
      inflation: settings.inflation,
      incomes: data.incomes.filter((income) => income.enabled),
      ssSurvivorAge: settings.ssSurvivorAge,
      inflationType: settings.inflationType,
    });

    return {
      ...result,
      amount: result.amount / divisionFactor,
    };
  };

  const setPreSpending = (
    index: number,
    field: keyof CurrentSpending,
    value: CurrentSpending[typeof field],
  ) => {
    setField("preSpending")(
      spending.preSpending.map((item, i) =>
        index === i ? { ...item, [field]: value } : item,
      ),
    );
  };

  const setPostSpending = (
    index: number,
    field: keyof NewSpending,
    value: NewSpending[typeof field],
  ) => {
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
  const taxes = years.map((year) => ({
    name: "Taxes",
    year,
    amount:
      data.incomes
        .filter((income) => income.enabled)
        .map((income) => calculateOne(income, year).amount)
        .filter((t) => typeof t === "number")
        .reduce((a, b) => a + b, 0) * getTaxRate(data, settings, year),
  }));

  const calcSett = (settings: ScenarioSettings) =>
    Math.max(
      ...currentYearRange.map((year) =>
        calculateSpendingYear(
          { incomes: data.incomes, people: data.people, version: 1 },
          spending,
          settings,
          year,
        ),
      ),
    );

  const factor = settings.monthlyYearly === "monthly" ? 12 : 1;
  const maxY =
    (Math.max(
      ...[
        calcSett({ ...settings, whoDies: -1 }),
        // calcSett({ ...settings, whoDies: 0 }),
        // calcSett({ ...settings, whoDies: 1 }),
      ],
    ) +
      Math.max(...taxes.map((i) => i.amount))) /
    factor;

  const [postDeleteOpen, setPostDeleteOpen] = useState(-1);
  const [preDeleteOpen, setPreDeleteOpen] = useState(-1);

  const baseSpending = getSpendingItemOverYears(
    { incomes: data.incomes, people: data.people, version: 1 },
    spending,
    settings,
    currentYear,
    currentYear + settings.maxYearsShown,
    "base",
  );
  const preSpending = spending.preSpending.map((item) =>
    getSpendingItemOverYears(
      { incomes: data.incomes, people: data.people, version: 1 },
      spending,
      settings,
      currentYear,
      currentYear + settings.maxYearsShown,
      "pre",
      item.category,
    ),
  );

  const postSpending = spending.postSpending.map((item) =>
    getSpendingItemOverYears(
      { incomes: data.incomes, people: data.people, version: 1 },
      spending,
      settings,
      currentYear,
      currentYear + settings.maxYearsShown,
      "post",
      item.category,
    ),
  );

  // const taxes = yearRange(
  //   startYear,
  //   startYear + settings.maxYearsShown - 1,
  // ).map((year) => {});

  return (
    <Layout page="spending">
      <div className="flex flex-col gap-8">
        <MapSection
          title={<div className="py-2 px-3">Current Spending</div>}
          toggleabble
          defaultOpen
        >
          <div className="flex gap-4">
            <div>
              <Input
                vertical
                size="lg"
                value={
                  spending.newCurrentSpending
                    ? spending.newCurrentSpending
                    : convertToMoYr(spending.currentSpending)
                }
                setValue={(v) =>
                  setSpending({ ...spending, newCurrentSpending: v })
                }
                subtype="mo/yr"
                label="Amount (Today's Dollars)"
              />
            </div>
            <YearlyIncreaseComponent
              labels
              increase={spending.yearlyIncrease}
              setYearlyIncrease={setField("yearlyIncrease")}
            />
            {data.people.map((v, i) => (
              <div>
                <Input
                  vertical
                  size="lg"
                  value={spending.decreaseAtDeath[i]}
                  setValue={(value: number) =>
                    setSpending({
                      ...spending,
                      decreaseAtDeath: spending.decreaseAtDeath.map(
                        (val, ind) => (ind == i ? value : val),
                      ) as [number, number],
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
                      value={
                        line.newAmount
                          ? line.newAmount
                          : { type: "yearly", value: line.amount }
                      }
                      setValue={(v) => setPreSpending(index, "newAmount", v)}
                      subtype="mo/yr"
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
                    <YearlyIncreaseComponent
                      labels={false}
                      increase={line.increase}
                      setYearlyIncrease={(v) =>
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
                        onConfirm={() => {
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
                        changeAtDeath: data.people.map((_) => 0),
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

                {data.people.map((i) => (
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
                      value={
                        line.newAmount
                          ? line.newAmount
                          : { type: "yearly", value: line.amount }
                      }
                      setValue={(v) => setPostSpending(index, "newAmount", v)}
                      subtype="mo/yr"
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
                    <YearlyIncreaseComponent
                      labels={false}
                      increase={line.increase}
                      setYearlyIncrease={(v) =>
                        setPostSpending(index, "increase", v)
                      }
                    />
                  </td>
                  {data.people.map((_, index2) => (
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
                            ) as [number, number],
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
                      onConfirm={() => {
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
          <div className="flex gap-6 p-2">
            <div className="p-3 bg-white w-full">
              <div className="flex justify-between w-full items-center">
                <div className="flex gap-4 items-end">
                  {data.people.length > 1 ? (
                    <div className="flex items-center">
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

                        {data.people.map((person, i) => (
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
                  ) : null}
                  <MultiToggle
                    options={["Real", "Nominal"]}
                    label=""
                    value={settings.inflationType}
                    setValue={(v: any) =>
                      setSettings({ ...settings, inflationType: v })
                    }
                  />

                  <div className="">
                    <Input
                      onFocus={(event: any) => {
                        const input = event.target;
                        setTimeout(() => {
                          input.select();
                        }, 0);
                      }}
                      inlineLabel="Inflation rate"
                      label=""
                      labelLength={85}
                      size="xs"
                      width="!w-[160px] !py-[5px]"
                      subtype="percent"
                      value={settings.inflation}
                      setValue={(e) =>
                        setSettings({ ...settings, inflation: e })
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Input
                    label=""
                    inlineLabel="Years Shown"
                    width="!w-[160px] !py-[4px]"
                    value={settings.maxYearsShown}
                    setValue={(v: any) =>
                      setSettings({ ...settings, maxYearsShown: v })
                    }
                    subtype="number"
                    size="md"
                  />
                  <MultiToggle
                    options={["Monthly", "Annual"]}
                    label=""
                    value={
                      settings.monthlyYearly === "monthly"
                        ? "Monthly"
                        : "Annual"
                    }
                    setValue={() =>
                      setSettings({
                        ...settings,
                        monthlyYearly:
                          settings.monthlyYearly === "monthly"
                            ? "yearly"
                            : "monthly",
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="h-[1px] bg-gray-300 w-full"></div>
          <div className="flex gap-6 ">
            <div className="flex gap-6 w-full mx-3">
              {data.taxesFlag && (
                <div className="p-3 flex gap-3 bg-white">
                  <div className="w-28">
                    <Input
                      subtype="toggle"
                      label="Include Taxes"
                      value={settings.taxType === "Post-Tax"}
                      vertical
                      setValue={(v) =>
                        setSettings({
                          ...settings,
                          taxType: v ? "Post-Tax" : "Pre-Tax",
                        })
                      }
                    />
                  </div>
                  <div className="">
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
                  <div className="">
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
                  <div className="">
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
              )}
            </div>
          </div>
          <div className="h-[1px] bg-gray-300 w-full"></div>
          <div className="bg-white pb-[2px]">
            <SpendingChart
              spending={true}
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
              stackedData={[
                baseSpending,
                ...preSpending,
                ...postSpending,
                taxes,
              ].map((item) => ({
                name: item[0].name,
                stable: true,
                values: item.map((i) =>
                  i.name == "Taxes" ? i.amount : i.amount / factor,
                ),
              }))}
            />
          </div>
        </MapSection>
        <MapSection defaultOpen title="">
          <SpendingTable
            settings={settings}
            spending={spending}
            data={{ incomes: data.incomes, people: data.people, version: 1 }}
          />
        </MapSection>
      </div>
    </Layout>
  );
};

export const MultiToggle = ({
  label,
  value,
  options,
  setValue,
  disabled,
  vertical = true,
}: any) => {
  return (
    <div
      className={`w-full   font-medium flex ${vertical ? "flex-col" : "flex-row items-center gap-2"}`}
    >
      <label className={`text-sm text-[#344054] ${vertical ? "w-36" : ""} `}>
        {label}
      </label>
      <div className={`flex ${vertical ? "mt-[3px]" : ""} border-collapse`}>
        {options.map((item: any, i: any) => (
          <button
            key={item}
            className={`${i == 0 ? "rounded-l-md" : ""} ${i == options.length - 1 ? "rounded-r-md ml-[-1px]" : ""} text-sm flex-1 py-[6px] ${value === item
                ? "bg-main-orange text-white"
                : "bg-gray-200 text-[#555860]"
              } ${vertical ? "" : "w-full"}`}
            onClick={() => !disabled && setValue(item)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SpendingPage;
