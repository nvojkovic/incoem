import Input from "./Inputs/Input";
import save from "../assets/save.png";
import WhoDies from "./WhoDies";
import { updateAtIndex } from "../utils";
import ResultTable from "./ResultTable";
import Button from "./Inputs/Button";
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import ModalInput from "./Inputs/ModalInput";
import { Spinner } from "flowbite-react";
const Live = ({
  data,
  settings,
  setSettings,
  fullScreen,
  selectedYear,
  setSelectedYear,
  selectedColumn,
  setSelectedColumn,
  changeFullScreen,
  addScenario,
  clientId,
}: {
  data: IncomeMapData;
  settings: ScenarioSettings;
  setSettings: any;
  fullScreen: boolean;
  selectedYear: number;
  setSelectedYear: any;
  selectedColumn: SelectedColumn;
  setSelectedColumn: any;
  changeFullScreen: any;
  addScenario: any;
  clientId: any;
}) => {
  const [saveOpen, setSaveOpen] = useState(false);

  const [printing, setPrinting] = useState(false);
  const print = async () => {
    setPrinting(true);
    let pdfFile;
    pdfFile = await fetch(
      import.meta.env.VITE_API_URL +
      "print/client/pdf-live/" +
      clientId +
      "/?data=" +
      JSON.stringify(settings),
    ).then((res) => res.json());
    setPrinting(false);
    window.open(
      import.meta.env.VITE_API_URL + "report/?report=" + pdfFile.file,
      "_blank",
    );
  };

  return (
    <div className="rounded-xl border-[#EAECF0] border print:border-transparent">
      <div
        className={`flex items-center h-32 sticky ${fullScreen ? "top-[45px]" : "top-[116px]"} z-[5000] bg-white`}
      >
        <div className="flex justify-between items-end mb-5 z-0 px-4 w-full">
          <div className="flex items-end gap-10">
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
                      title={`${person.name} Dies`}
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
                      label={`${person.name}'s Death`}
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

              {/*data.people.length > 1 &&
                data.people.map(
                  (person, i) =>
                    settings.whoDies == i &&
                    data.incomes.find(
                      (inc) =>
                        inc.type == "social-security" && inc.personId == i,
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
                )*/}
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
          <div className="flex gap-3">
            <div>
              <Button type="secondary" onClick={() => setSaveOpen(true)}>
                <div className="flex gap-2">
                  <img src={save} className="w-6 h-6" />
                </div>
              </Button>
              <ModalInput
                isOpen={saveOpen}
                onClose={() => {
                  setSaveOpen(false);
                  setSettings({
                    ...settings,
                    name: "",
                  });
                }}
                onConfirm={() => {
                  setSaveOpen(false);
                  setSettings({
                    ...settings,
                    name: "",
                  });
                  addScenario({
                    ...settings,
                    data: { ...data },
                  });
                }}
              >
                <div className="py-3">
                  <Input
                    label="Scenario name"
                    value={settings.name}
                    setValue={(name) => setSettings({ ...settings, name })}
                    onKeyDown={(e: any) => {
                      if (e.key === "Enter") {
                        setSaveOpen(false);
                        setSettings({
                          ...settings,
                          name: "",
                        });

                        addScenario({
                          ...settings,
                          data: { ...data },
                        });
                      }
                    }}
                    size="full"
                    vertical
                  />
                </div>
              </ModalInput>
            </div>
            <div>
              <Button type="secondary" onClick={changeFullScreen}>
                <div className="flex gap-3">
                  <div className="flex items-center">
                    {fullScreen ? (
                      <ArrowsPointingInIcon className="h-6 w-6" />
                    ) : (
                      <ArrowsPointingOutIcon className="h-6 w-6" />
                    )}
                  </div>
                </div>
              </Button>
            </div>
            <div>
              <Button type="secondary" onClick={() => print()}>
                <div className="flex gap-2">
                  <PrinterIcon className="h-6 w-6" />
                  {printing && <Spinner className="h-5" />}
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <ResultTable
        clientId={clientId}
        changeFullScreen={changeFullScreen}
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
