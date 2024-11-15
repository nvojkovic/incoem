import { updateAtIndex } from "src/utils";
import { useInfo } from "../useData";
import { PeopleInfo } from "./Info/PersonInfo";
import Input from "./Inputs/Input";
import Layout from "./Layout";
import { MultiToggle } from "./Spending/SpendingPage";
import WhoDies from "./WhoDies";
import ReportSettings from "./Settings/ReportSettings";

const ClientOverview = () => {
  const { data, setField } = useInfo();
  const settings = data.liveSettings;
  const spending = data.spending;
  const setSettings = (sett: any) => {
    setField("liveSettings")(sett);
  };
  const setSpending = setField("spending");
  return (
    <Layout page="basic">
      <div>
        <div title="Basic information">
          <div className="font-semibold text-2xl mb-5">
            Household information
          </div>
          <PeopleInfo />
        </div>
        <div className="h-10"></div>
        <div className="flex">
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
          <div title="Settings pl-6" className="pl-6">
            <div className="font-semibold text-2xl mb-5">Extra features</div>
            <div className="w-72 bg-white p-2 rounded-lg shadow-md border">
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
            </div>
          </div>
        </div>
        <div className="">
          <div className="font-semibold text-2xl mb-5">Report Settings</div>
          <div className="p-2 rounded-lg ">
            <ReportSettings
              settings={data.reportSettings}
              updateSettings={setField("reportSettings")}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ClientOverview;
