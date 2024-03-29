import Input from "./Inputs/Input";
import WhoDies from "./WhoDies";
import { updateAtIndex } from "../utils";
import ResultTable from "./ResultTable";
const Live = ({
  data,
  settings,
  setSettings,
  fullScreen,
  selectedYear,
  setSelectedYear,
  selectedColumn,
  setSelectedColumn,
}: {
  data: IncomeMapData;
  settings: ScenarioSettings;
  setSettings: any;
  fullScreen: boolean;
  selectedYear: number;
  setSelectedYear: any;
  selectedColumn: SelectedColumn;
  setSelectedColumn: any;
}) => {
  return (
    <div className="rounded-xl border-[#EAECF0] border">
      <div
        className={`flex items-center h-32 sticky ${fullScreen ? "top-[45px]" : "top-[116px]"} z-[5000] bg-white`}
      >
        <div className="flex justify-between items-end mb-5 z-0  px-4 w-full">
          {data.people.length == 2 ? (
            <div className="flex gap-3 border border-1 rounded-md h-10 items-end">
              <div className={`flex items-end`}>
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
                    setWhoDies={(i: number) =>
                      setSettings({
                        ...settings,
                        whoDies: i,
                      })
                    }
                    i={i}
                    title={`${person.name} dies`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div></div>
          )}
          <div className="flex gap-5">
            {data.people.length > 1 &&
              data.people.map((person, i) => (
                <div className="w-36">
                  <Input
                    subtype="number"
                    vertical
                    label={`${person.name}'s death`}
                    value={settings.deathYears[i]?.toString()}
                    setValue={(e) =>
                      setSettings({
                        ...settings,
                        deathYears: updateAtIndex(
                          settings.deathYears,
                          i,
                          parseInt(e),
                        ),
                      })
                    }
                  />
                </div>
              ))}

            {data.people.length > 1 &&
              data.people.map(
                (person, i) =>
                  settings.whoDies == i &&
                  data.incomes.find(
                    (inc) => inc.type == "social-security" && inc.personId == i,
                  ) && (
                    <div className="w-44">
                      <Input
                        subtype="number"
                        vertical
                        disabled={i !== settings.whoDies}
                        label={`${data.people[1 - i].name}' survivor SS age`}
                        tooltip={`Age when ${data.people[1 - i].name} starts receiving ${person.name}'s Social Security as a survivor`}
                        value={settings.deathYears[1 - i]?.toString()}
                        setValue={(e) =>
                          setSettings({
                            ...settings,
                            ssSurvivorAge: updateAtIndex(
                              settings.ssSurvivorAge,
                              1 - i,
                              parseInt(e),
                            ),
                          })
                        }
                      />
                    </div>
                  ),
              )}
            <div className="">
              <Input
                label="Years"
                tooltip="The maximum number of years shown in the chart"
                subtype="number"
                size="xs"
                vertical
                value={settings.maxYearsShown?.toString()}
                setValue={(e) =>
                  setSettings({ ...settings, maxYearsShown: parseInt(e) })
                }
              />
            </div>
            <div className="">
              <Input
                label="Inflation"
                size="xs"
                vertical
                subtype="percent"
                value={settings.inflation?.toString()}
                setValue={(e) =>
                  setSettings({ ...settings, inflation: parseFloat(e) })
                }
              />
            </div>
          </div>
        </div>
      </div>
      <ResultTable
        settings={settings}
        data={data}
        removeScenario={() => { }}
        fullScreen={fullScreen}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedColumn={selectedColumn}
        setSelectedColumn={setSelectedColumn}
        id={-1}
      />
    </div>
  );
};

export default Live;
