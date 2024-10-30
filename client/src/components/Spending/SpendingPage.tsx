import { TrashIcon } from "@heroicons/react/24/outline";
import { useInfo } from "../../useData";
import Button from "../Inputs/Button";
import Input from "../Inputs/Input";
import MapSection from "../MapSection";
import YearlyIncrease from "./YearlyIncrease";
import { formatter, splitDate, yearRange } from "../../utils";
import StackedAreaChart from "../NewChart";
import { calculateAge } from "../Info/PersonInfo";

export const calculateSpendingYear = (
  data: IncomeMapData,
  spending: RetirementSpendingSettings | undefined,
  settings: any,
  year: number,
) => {
  if (!spending) return 0;
  const years = year - 2024;
  let result = 0;
  const inflationRate = (inflation: any) => {
    if (inflation.type == "none") return 0;
    else if (inflation.type == "custom") return (inflation.percent || 0) / 100;
    else if (inflation.type == "general") return settings.inflation / 100 || 0;
    else return -10e9;
  };
  const inflateAmount = (amount: number, inflation: number) => {
    return amount * Math.pow(1 + inflation, years);
  };
  const pre = spending.preSpending
    .filter((item) => year > item.endYear)
    .map((item) => inflateAmount(item.amount, inflationRate(item.increase)))
    .reduce((a, b) => a + b, 0);

  const uninflatedPre = spending.preSpending
    .map((item) => item.amount)
    .reduce((a, b) => a + b, 0);
  const inflatedPre = spending.preSpending
    .map((item) => inflateAmount(item.amount, inflationRate(item.increase)))
    .reduce((a, b) => a + b, 0);
  const post = spending.postSpending
    .filter(
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
  console.log("deaths", settings.whoDies, settings.deathYears);
  if (settings.whoDies !== -1 && settings.deathYears[settings.whoDies]) {
    const age =
      calculateAge(new Date(data.people[settings.whoDies].birthday)) + years;
    console.log("dying", age, settings.deathYears[settings.whoDies]);
    if (age > (settings.deathYears[settings.whoDies] as any)) {
      current *= 1 - spending.decreaseAtDeath[settings.whoDies] / 100;
    }
  }

  result +=
    inflateAmount(
      current - uninflatedPre,
      inflationRate(spending.yearlyIncrease),
    ) + inflatedPre;
  if (settings.taxType == "Pre-Tax") {
    if (year <= settings.retirementYear) {
      result /= 1 - (spending.preTaxRate || 0) / 100;
    } else {
      result /= 1 - (spending.postTaxRate || 0) / 100;
    }
  }
  console.log(year, result);
  if (settings.inflationType == "Real") {
    result = calculatePV(result, (settings.inflation || 0) / 100, years);
  }

  return Math.round(isNaN(result) ? 0 : result);
};

const currentYear = new Date().getFullYear();

const SpendingPage = ({ settings, setSettings }: any) => {
  const { data, setSpending } = useInfo();
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
      calcSett({ ...settings, whoDies: 0 }),
      calcSett({ ...settings, whoDies: 1 }),
    ],
  );

  return (
    <div className="flex flex-col gap-8">
      <MapSection title="Current Spending" toggleabble defaultOpen>
        {maxY}
        <div className="flex gap-4">
          <div>
            <Input
              vertical
              size="lg"
              value={spending.currentSpending}
              setValue={(v) => setSpending({ ...spending, currentSpending: v })}
              subtype="money"
              label="Amount
(Today's Dollars)"
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
                    decreaseAtDeath: spending.decreaseAtDeath.map((val, ind) =>
                      ind == i ? value : val,
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
      <MapSection title="Current Spending That Ends" toggleabble defaultOpen>
        <div className="w-32 mb-8">
          <Button
            type="primary"
            onClick={() =>
              setField("preSpending")([
                ...spending.preSpending,
                { increase: { type: "general" } },
              ])
            }
          >
            Add
          </Button>
        </div>
        <table className=" w-full">
          <thead
            className={`text-xs cursor-pointer bg-[#F9FAFB] text-black font-medium text-left sticky z-50 border-1`}
          >
            <tr>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Amount (Today's Dollars)</th>
              <th className="px-6 py-3">Ends (Cal Year)</th>
              <th className="px-6 py-3">
                Yearly Increase{" "}
                {spending.preSpending.find(
                  (i) => i.increase.type === "custom",
                ) && <div className="inline-block ml-7">Increase (%)</div>}{" "}
              </th>
              <th className="px-6 py-3">Actions</th>
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
                  <Button
                    type="secondary"
                    onClick={() => {
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </MapSection>
      <MapSection title="New Spending" toggleabble defaultOpen>
        <div className="w-32 mb-8">
          <Button
            type="primary"
            onClick={() =>
              setField("postSpending")([
                ...spending.postSpending,
                {
                  increase: { type: "general" },
                  changeAtDeath: data.data.people.map((_) => 0),
                },
              ])
            }
          >
            Add
          </Button>
        </div>
        <table className=" w-full">
          <thead
            className={`text-xs cursor-pointer bg-[#F9FAFB] text-black font-medium text-left sticky z-50 border-1`}
          >
            <tr>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Amount (Today's Dollars)</th>
              <th className="px-6 py-3">Starts (Cal Year)</th>
              <th className="px-6 py-3">Ends (Cal Year)</th>
              <th
                className={`px-6 py-3 ${spending.postSpending.find(
                  (i) => i.increase.type === "custom",
                ) && "w-64"
                  }`}
              >
                Yearly Increase{" "}
                {spending.postSpending.find(
                  (i) => i.increase.type === "custom",
                ) && <div className="inline-block ml-6">Increase (%)</div>}{" "}
              </th>

              {data.data.people.map((i) => (
                <th className="px-6 py-3">
                  Decrease at <br />
                  {i.name} Death
                </th>
              ))}

              <th className="px-6 py-3">Actions</th>
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
                <td className="px-2 py-2">
                  <Button
                    type="secondary"
                    onClick={() => {
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
      <MapSection title="Spending Needs" toggleabble defaultOpen>
        <div className="flex gap-6">
          <div className="border rounded-lg p-3 h-[96px]">
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
            <div className="border rounded-lg p-3 flex gap-3">
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
                  setValue={(v) => setSpending({ ...spending, preTaxRate: v })}
                  subtype="percent"
                  label={"Pre-Retirement Tax Rate"}
                />
              </div>
              <div className="mt-1">
                <Input
                  vertical
                  size="lg"
                  value={spending.postTaxRate}
                  setValue={(v) => setSpending({ ...spending, postTaxRate: v })}
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
        <div className="flex gap-6">
          <div className="border rounded-lg p-3">
            <div className="flex gap-4">
              <div className="w-[450px]">
                {data.data.people.length > 1 ? (
                  <MultiToggle
                    options={[
                      "Both Alive",
                      `${data.data.people[0].name} Dies`,
                      `${data.data.people[1].name} Dies`,
                    ]}
                    label="Death settings"
                    value={
                      settings.whoDies == -1
                        ? "Both Alive"
                        : `${data.data.people[settings.whoDies].name} Dies`
                    }
                    setValue={(v: any) =>
                      setSettings({
                        ...settings,
                        whoDies:
                          v == "Both Alive"
                            ? -1
                            : data.data.people.findIndex((p) =>
                              v.includes(p.name),
                            ),
                      })
                    }
                  />
                ) : null}
              </div>
              {data.data.people.map((person, ind) => (
                <div>
                  <Input
                    label={`${person.name}'s Death`}
                    setValue={(x) =>
                      setSettings({
                        ...settings,
                        deathYears: settings.deathYears.map((v: any, i: any) =>
                          ind == i ? x : v,
                        ),
                      })
                    }
                    value={settings.deathYears[ind]}
                    subtype="number"
                    vertical
                    size="md"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="border rounded-lg p-3">
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
        <StackedAreaChart
          maxY={maxY}
          stability={data.stabilityRatioFlag}
          needsFlag={data.needsFlag}
          years={yearRange(currentYear, currentYear + settings.maxYearsShown)}
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

        <div className="flex gap-4 mt-10">
          {[0, 1, 2, 3, 4].map(
            (tableInd) =>
              currentYear + settings.maxYearsShown >
              currentYear + tableInd * 16 && (
                <div>
                  <table className=" w-full border ">
                    <thead
                      className={`text-xs cursor-pointer bg-[#F9FAFB] text-black font-medium text-left sticky z-50 border-1`}
                    >
                      <tr>
                        <th className="px-6 py-3">Year</th>
                        <th className="px-6 py-3">Age</th>
                        <th className="px-6 py-3">Spending</th>
                      </tr>
                    </thead>
                    <tbody>
                      {yearRange(
                        currentYear + tableInd * 16,
                        Math.min(
                          currentYear + (tableInd + 1) * 16 - 1,
                          currentYear + settings.maxYearsShown,
                        ),
                      ).map((line) => (
                        <tr className="">
                          <td className="px-2 py-1 w-[500px] font-bold">
                            {line}
                          </td>
                          <td className="px-2 py-1 w-[500px]">
                            {data.data.people
                              .map((p) => line - splitDate(p.birthday).year)
                              .join("/")}
                          </td>
                          <td className="px-2 py-1 w-[500px]">
                            {formatter.format(
                              calculateSpendingYear(
                                data.data,
                                spending,
                                settings,
                                line,
                              ),
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ),
          )}
        </div>
      </MapSection>
    </div>
  );
};

export const MultiToggle = ({ label, value, options, setValue }: any) => {
  return (
    <div className="">
      <label className="text-sm text-[#344054] w-36 ">{label}</label>
      <div className="flex gap-2 mt-[6px]">
        {options.map((item: any) => (
          <button
            className={`flex-1 py-[7px] px-4 rounded ${value === item ? "bg-main-orange text-white" : "bg-gray-200"
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
