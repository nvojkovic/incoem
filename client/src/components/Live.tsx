import Input from "./Inputs/Input";
import save from "../assets/save.png";
import WhoDies from "./WhoDies";
import { updateAtIndex } from "../utils";
import Button from "./Inputs/Button";
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import ModalInput from "./Inputs/ModalInput";
import { Spinner } from "flowbite-react";
import { MultiToggle } from "./Spending/SpendingPage";
import { useInfo } from "src/useData";
import { useFullscreen } from "src/hooks/useFullScreen";

export const SmallToggle = ({ item1, item2, active, toggle }: any) => {
  return (
    <div className="flex text-sm cursor-pointer border-collapse">
      <div
        className={`${active === item1 ? "bg-main-orange text-white" : "bg-gray-200 text-black"} px-3 py-[3px] rounded-l-md  border  border-gray-300 border-1`}
        onClick={toggle}
      >
        {item1}
      </div>
      <div
        className={`${active === item2 ? "bg-main-orange text-white" : "bg-gray-200 text-black"} px-3 py-[3px] rounded-r-md ml-[-1px] border  border-gray-300 border-1`}
        onClick={toggle}
      >
        {item2}
      </div>
    </div>
  );
};

const Live = ({
  client,
  spending,
}: {
  client: Client;
  spending?: RetirementSpendingSettings;
}) => {
  const [saveOpen, setSaveOpen] = useState(false);

  const { data: initial, setField, storeScenarios } = useInfo();
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const settings = {
    ...initial.liveSettings,
    data: initial.data,
    spending: initial.spending,
  };
  const setSettings = setField("liveSettings");
  const [printing, setPrinting] = useState(false);

  const addScenario = (data: any) => {
    storeScenarios([
      ...initial.scenarios,
      { ...data, id: initial.scenarios.length + 1 },
    ]);
  };

  const print = async () => {
    setPrinting(true);
    const pdfFile = await fetch(
      import.meta.env.VITE_API_URL + "print/client/pdf-live/" + client.id,
    ).then((res) => res.json());
    setPrinting(false);
    window.open(
      import.meta.env.VITE_API_URL + "report/?report=" + pdfFile.file,
      "_blank",
    );
  };

  return (
    <div
      className={`rounded-xl z-[500] border-[#EAECF0] border print:border-0 sticky ${isFullscreen ? "top-[45px]" : "top-[115px]"} `}
    >
      <div
        className={`flex flex-col items-center h-32 sticky ${isFullscreen ? "top-[44px]" : "top-[116px]"} z-[5000] bg-white`}
      >
        <div className="w-full flex justify-between pb-2 border-b ">
          <div className="flex gap-7 items-end px-3 py-1">
            <div className="">
              <Input
                label="Years shown"
                tooltip="The maximum number of years shown in the chart"
                subtype="number"
                invalid={settings.maxYearsShown < 0}
                size="xs"
                labelLength={100}
                errorMessage="Years shown must be positive"
                value={settings.maxYearsShown?.toString()}
                setValue={(e) =>
                  setSettings({ ...settings, maxYearsShown: parseInt(e) })
                }
              />
            </div>
            <div className="w-[200px]">
              <MultiToggle
                options={["Monthly", "Annual"]}
                label=""
                value={
                  settings.monthlyYearly === "monthly" ? "Monthly" : "Annual"
                }
                setValue={(v: any) =>
                  setSettings({
                    ...settings,
                    monthlyYearly: v === "Annual" ? "yearly" : "monthly",
                  })
                }
              />
            </div>

            <div className="w-[200px]">
              <MultiToggle
                options={["Basic", "Composite"]}
                label=""
                value={settings.mapType === "composite" ? "Composite" : "Basic"}
                setValue={(v: any) =>
                  setSettings({
                    ...settings,
                    mapType: v === "Basic" ? "basic" : "composite",
                  })
                }
              />
            </div>
          </div>
          <div className="flex gap-3 w-full justify-end pt-3 pr-3">
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
                    data: { ...settings.data },
                    spending: { ...spending },
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
                          data: { ...settings.data },
                          spending: { ...spending },
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
              <Button type="secondary" onClick={toggleFullscreen}>
                <div className="flex gap-3">
                  <div className="flex items-center">
                    {isFullscreen ? (
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
        <div className="flex items-center gap-5 z-0 px-4 w-full h-[55%]">
          {settings.data.people.length == 2 ? (
            <div className="flex gap-3 items-center">
              <div className="text-sm text-[#344054] mb-1 ">Mortality</div>
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
                {settings.data.people.map((person, i) => (
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
          ) : (
            <div></div>
          )}
          <div className="flex gap-3 items-center">
            <div className="mt-[-3px]">
              <MultiToggle
                vertical={false}
                options={["Real", "Nominal"]}
                label="Inflation"
                value={settings.inflationType}
                setValue={(v: any) =>
                  setSettings({ ...settings, inflationType: v })
                }
              />
            </div>
            <div className="">
              <Input
                onFocus={(event: any) => {
                  const input = event.target;
                  setTimeout(() => {
                    input.select();
                  }, 0);
                }}
                label="Inflation (%)"
                labelLength={85}
                size="xs"
                subtype="percent"
                value={settings.inflation}
                setValue={(e) => setSettings({ ...settings, inflation: e })}
              />
            </div>

            <div className="h-10">
              {client.taxesFlag && (
                <div className="w-[283px]">
                  <MultiToggle
                    options={["Pre-Tax", "Post-Tax"]}
                    label=""
                    vertical={false}
                    value={settings.taxType}
                    setValue={(v: any) =>
                      setSettings({ ...settings, taxType: v })
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Live;
