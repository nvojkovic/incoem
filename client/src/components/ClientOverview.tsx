import { arrayMove } from "@dnd-kit/sortable";
import { useInfo } from "../useData";
import PersonInfo from "./Info/PersonInfo";
import Input from "./Inputs/Input";
import Layout from "./Layout";
import ReportSettings from "./Settings/ReportSettings";

const ClientOverview = () => {
  const { data, setField } = useInfo();
  const settings = data.liveSettings;
  const setSettings = (sett: any) => {
    setField("liveSettings")(sett);
  };

  const reportSettings = data.reportSettings.filter((s) => {
    if (s.name === "spending" && !data.needsFlag) return false;
    if (s.name === "spending-chart" && !data.needsFlag) return false;
    if (s.name === "longevity" && !data.longevityFlag) return false;
    return true;
  });
  return (
    <Layout page="basic">
      <div>
        <div className="flex gap-6 w-[1600px]">
          <div className="shadow-md  bg-white p-6 rounded-lg">
            <div className="h-full">
              <div className="font-semibold text-2xl">Household</div>
              <div className="flex flex-col gap-4 mt-6">
                <Input
                  label="Household Name"
                  value={data.title}
                  size="lg"
                  subtype="text"
                  setValue={setField("title")}
                />
              </div>
              <div className="flex gap-12">
                {data.people.map((person, i) => (
                  <PersonInfo
                    key={i}
                    subtitle="Details about how this works"
                    person={person}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="shadow-md bg-white p-6 rounded-lg w-96">
            <div className="font-semibold text-2xl mb-5">Assumptions</div>
            <div className="grid gap-y-5 grid-cols2 w-[500px]">
              <Input
                value={data.liveSettings.inflation}
                subtype="percent"
                setValue={(e) => setSettings({ ...settings, inflation: e })}
                label="Inflation"
                labelLength={190}
                width="!w-24"
                tabIndex={4}
              />
              <Input
                value={data.spending.preTaxRate}
                subtype="percent"
                setValue={(e) =>
                  setField("spending")({ ...data.spending, preTaxRate: e })
                }
                labelLength={190}
                width="!w-24"
                label="Pre-Retirement Tax Rate"
                tabIndex={7}
              />
              <Input
                value={data.spending.postTaxRate}
                subtype="percent"
                setValue={(e) =>
                  setField("spending")({ ...data.spending, postTaxRate: e })
                }
                label="Post-Retirement Tax Rate"
                labelLength={190}
                width="!w-24"
                tabIndex={8}
              />
              <Input
                value={data.liveSettings.maxYearsShown}
                subtype="number"
                setValue={(e) => setSettings({ ...settings, maxYearsShown: e })}
                label="Years Shown"
                labelLength={190}
                width="!w-24"
                tabIndex={5}
              />

              {data.people.map((person, i) => (
                <Input
                  value={data.liveSettings.deathYears[i]}
                  subtype="number"
                  setValue={(e) =>
                    setSettings({
                      ...settings,
                      deathYears: settings.deathYears.map((item, ind) =>
                        ind != i ? item : e,
                      ),
                    })
                  }
                  label={`${person.name}'s Mortality`}
                  labelLength={190}
                  width="!w-24"
                  tabIndex={6}
                />
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-md border pr-8">
            <div className="font-semibold text-2xl mb-5">Extra features</div>
            <div className="w-72 ">
              <Input
                value={data.stabilityRatioFlag}
                setValue={setField("stabilityRatioFlag")}
                label="Stability Ratio"
                size="full"
                subtype="toggle"
              />
              <Input
                value={data.needsFlag}
                setValue={setField("needsFlag")}
                label="Spending"
                size="full"
                subtype="toggle"
              />
              <Input
                value={data.longevityFlag}
                setValue={setField("longevityFlag")}
                label="Longevity"
                size="full"
                subtype="toggle"
              />
              <Input
                value={data.taxesFlag}
                setValue={setField("taxesFlag")}
                label="Taxes"
                size="full"
                subtype="toggle"
              />
            </div>
          </div>
        </div>
        {/*<div className="flex">
          <div title="Settings " className="">
            <div className="font-semibold text-2xl mb-5">Settings</div>
            <div>
              <div className="flex gap-6 ">
                <div className="border rounded-lg p-3 h-[102px] bg-white shadow-md">
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
                  <div className="border rounded-lg p-3 flex gap-3 bg-white shadow-md h-[102px]">
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
                        width="!w-48"
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
                        width="!w-28"
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
              <div className="flex gap-6 mb-10 ">
                {data.data.people.length > 1 ? (
                  <div className="border rounded-lg p-3 bg-white shadow-md">
                    <div className="flex flex-col">
                      <div className="text-sm text-[#344054] mb-1">
                        Mortality
                      </div>
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
                <div className="border rounded-lg p-3 bg-white shadow-md">
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
            </div>
          </div>
        </div>*/}
        <div className="w-full mt-8">
          <div className="font-semibold text-2xl mb-5">Report Settings</div>
          <div className="rounded-lg w-full ">
            <ReportSettings
              flags={{
                needsFlag: data.needsFlag,
                longevityFlag: data.longevityFlag,
              }}
              settings={reportSettings}
              updateSettings={setField("reportSettings")}
              switchOrder={(name1, name2) => {
                const oldIndex = data.reportSettings.findIndex(
                  (s) => s.name === name1,
                );
                const newIndex = data.reportSettings.findIndex(
                  (s) => s.name === name2,
                );
                console.log(oldIndex, newIndex);
                if (oldIndex !== newIndex) {
                  const newArr = arrayMove(
                    [...data.reportSettings],
                    oldIndex,
                    newIndex,
                  );
                  console.log(newArr);
                  setField("reportSettings")(newArr);
                }
              }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ClientOverview;
