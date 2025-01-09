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
  settings,
  spending,
  disabled,
}: {
  client: Client;
  spending?: RetirementSpendingSettings;
  settings: ScenarioSettings;
  disabled?: boolean;
}) => {
  const [saveOpen, setSaveOpen] = useState(false);
  const [name, setName] = useState("");

  const { data: initial, setField, storeScenarios } = useInfo();
  const { isFullscreen, toggleFullscreen } = useFullscreen();
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
        className={`flex flex-col items-center h-40 sticky ${isFullscreen ? "top-[44px]" : "top-[116px]"} z-[5000] bg-white`}
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
                setValue={(e) => setSettings({ ...settings, maxYearsShown: e })}
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
                  setName("");
                }}
                onConfirm={() => {
                  setSaveOpen(false);
                  setSettings({
                    ...settings,
                    name: "",
                  });
                  addScenario({
                    ...settings,
                    name,
                    data: { ...settings.data },
                    spending: { ...spending },
                  });
                }}
              >
                <div className="py-3">
                  <Input
                    label="Scenario name"
                    value={name}
                    setValue={(name) => setName(name)}
                    onKeyDown={(e: any) => {
                      if (e.key === "Enter") {
                        setSaveOpen(false);
                        setSettings({
                          ...settings,
                          name: "",
                        });

                        addScenario({
                          ...settings,
                          name,
                          id: client.scenarios.length
                            ? Math.max(
                                ...client.scenarios.map((item) => item.id),
                              ) + 1
                            : 1,
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
        <div className="flex items-center gap-3 z-0 px-4 w-full h-[55%]">
          {settings.data.people.length == 2 ? (
            <div className="flex flex-col gap-1 items-start">
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
          <div className="bg-gray-300 mt-[8px] w-[1px] h-[98px]"></div>
          <div className="mt-[-3px]">
            <MultiToggle
              vertical={true}
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
              disabled={disabled}
              label="Inflation (%)"
              labelLength={85}
              size="xs"
              vertical
              subtype="percent"
              value={settings.inflation}
              setValue={(e) => setSettings({ ...settings, inflation: e })}
            />
          </div>
          <div className="bg-gray-300 mt-[8px] w-[1px] h-[98px]"></div>
          <div className="">
            {client.taxesFlag && (
              <div className="w-[200px]">
                <MultiToggle
                  options={["Pre-Tax", "Post-Tax"]}
                  label="Taxation"
                  vertical={true}
                  value={settings.taxType}
                  setValue={(v: any) =>
                    setSettings({ ...settings, taxType: v })
                  }
                />
              </div>
            )}
          </div>
          <div className="">
            <Input
              vertical
              size="lg"
              width="!w-[120px]"
              value={client.spending.preTaxRate}
              setValue={(v) =>
                setField("spending")({ ...client.spending, preTaxRate: v })
              }
              subtype="percent"
              label={
                <>
                  Pre-Retirement
                  <br /> Tax Rate
                </>
              }
            />
          </div>
          <div className="">
            <Input
              vertical
              size="lg"
              width="!w-[120px]"
              value={client.spending.postTaxRate}
              setValue={(v) =>
                setField("spending")({ ...client.spending, postTaxRate: v })
              }
              subtype="percent"
              label={
                <>
                  Post-Retirement <br />
                  Tax Rate
                </>
              }
            />
          </div>{" "}
          <div className="">
            <Input
              vertical
              size="lg"
              width="!w-[80px]"
              value={settings.retirementYear}
              setValue={(e) => setSettings({ ...settings, retirementYear: e })}
              subtype="number"
              label={
                <>
                  Retirement <br />
                  Year
                </>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Live;
