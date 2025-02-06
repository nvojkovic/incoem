import WhoDies from "../WhoDies";
import { updateAtIndex } from "../../utils";
import { Tooltip } from "flowbite-react";
import { MultiToggle } from "../Spending/SpendingPage";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Input from "src/components/Inputs/Input";
import { useFullscreen } from "src/hooks/useFullScreen";
import { useInfo } from "src/hooks/useData";
import { Client, ScenarioSettings } from "src/types";
import title from "src/calculator/title";

interface Props {
  settings: ScenarioSettings;
  client: Client;
}

const ScenarioHeader = ({ client, settings }: Props) => {
  const { setField } = useInfo();

  const setSettings = (v: any) => {
    if (settings.id === -1) {
      setField("liveSettings")({ ...client.liveSettings, ...v });
    }
  };

  const { isFullscreen } = useFullscreen();
  const disabled = settings.id !== -1;

  return (
    <div
      className={`flex justify-between items-center sticky ${isFullscreen ? "top-[44px]" : "top-[119px]"} z-[5000] bg-white px-4`}
    >
      <div className="flex items-center gap-3 z-0 w-full">
        {settings.people.length == 2 && (
          <div className="flex">
            <WhoDies
              disabled={settings.id !== -1}
              active={settings.whoDies == -1}
              setWhoDies={(i: number) => setSettings({ whoDies: i })}
              i={-1}
              title="Both Alive"
            />
            {settings.people.map((person, i) => (
              <WhoDies
                active={settings.whoDies == i}
                disabled={settings.id !== -1}
                key={person.id}
                age={settings.deathYears[i]}
                setAge={(e: any) =>
                  setSettings({
                    deathYears: updateAtIndex(
                      settings.deathYears,
                      i,
                      parseInt(e),
                    ),
                  })
                }
                setWhoDies={(i: number) => setSettings({ whoDies: i })}
                i={i}
                title={`${person.name} Dies At`}
              />
            ))}
          </div>
        )}
        <div className="bg-gray-300 mt-[-5px] w-[1px] h-[73px] mx-2"></div>
        <div className="mt-[-3px]">
          <MultiToggle
            vertical={true}
            options={["Real", "Nominal"]}
            label=""
            disabled={disabled}
            value={settings.inflationType}
            setValue={(v: any) => setSettings({ inflationType: v })}
          />
        </div>
        <div className="mt-[-5px]">
          <Input
            onFocus={(event: any) => {
              const input = event.target;
              setTimeout(() => {
                input.select();
              }, 0);
            }}
            inlineLabel="Inflation rate"
            disabled={disabled}
            label=""
            labelLength={85}
            size="xs"
            vertical
            width="!w-[160px] !py-[4px]"
            subtype="percent"
            value={settings.inflation}
            setValue={(e) => setSettings({ inflation: e })}
          />
        </div>
        <div className="bg-gray-300 mt-[-5px] w-[1px] h-[73px] mx-2"></div>
        <div className="flex gap-3">
          {client.taxesFlag && (
            <div className="w-[160px]">
              <MultiToggle
                options={["Pre-Tax", "Post-Tax"]}
                label=""
                disabled={disabled}
                vertical={true}
                value={settings.taxType}
                setValue={(v: any) => setSettings({ ...settings, taxType: v })}
              />
            </div>
          )}

          {client.taxesFlag && (
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="bg-[#EDEEF1] w-8 h-8 flex items-center justify-center cursor-pointer rounded-md mt-[3px]">
                  <img src="/icons/tripledot.png" alt="" className="w-4" />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute left-0 mt-2 w-56 origin-top-left divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                  <div className="flex flex-col gap-3 p-3">
                    <Input
                      subtype="percent"
                      label="Pre-Retirement Tax Rate (%)"
                      disabled={disabled}
                      value={client.spending.preTaxRate}
                      setValue={(preTaxRate) =>
                        setField("spending")({
                          ...client.spending,
                          preTaxRate,
                        })
                      }
                      vertical
                    />
                    <Input
                      subtype="percent"
                      label="Post-Retirement Tax Rate (%)"
                      disabled={disabled}
                      value={client.spending.postTaxRate}
                      setValue={(postTaxRate) =>
                        setField("spending")({
                          ...client.spending,
                          postTaxRate,
                        })
                      }
                      vertical
                    />
                    <Input
                      subtype="number"
                      label="Retirement Year"
                      disabled={disabled}
                      value={client.liveSettings.retirementYear}
                      setValue={(retirementYear) =>
                        setField("liveSettings")({
                          ...client.liveSettings,
                          retirementYear,
                        })
                      }
                      vertical
                    />
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <Tooltip
          theme={{ target: "" }}
          placement="bottom"
          style="light"
          content={
            <div className="!text-[12px] !font-medium !leading-[18px] w-[160px]">
              <div className="text-[#9396A0]">Column Configuration</div>
              <div className="text-[#555860]">
                Basic: Income sources only
                <br />
                Composite: Calculations
              </div>
            </div>
          }
        >
          <div
            className="flex gap-3 items-center bg-[#EDEEF1] rounded-md py-[5px] px-[12px] text-[#555860] text-[14px] font-medium cursor-pointer w-[125px] justify-between"
            onClick={() =>
              setField("liveSettings")({
                ...client.liveSettings,
                mapType:
                  client.liveSettings.mapType === "composite"
                    ? "basic"
                    : "composite",
              })
            }
          >
            <img src="/icons/chevron-left.png" className="h-2" />
            {client.liveSettings.mapType === "composite"
              ? "Composite"
              : "Basic"}
            <img src="/icons/chevron-right.png" className="h-2" />
          </div>
        </Tooltip>

        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="bg-[#EDEEF1] w-8 h-8 flex items-center justify-center cursor-pointer rounded-md ">
              <img src="/icons/more.png" alt="" className="w-4" />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
              <div className="p-3 text-[#9396A0] text-[14px]">
                Table configurations
              </div>
              <div className="bg-gray-500 h-[1px] w-full"></div>
              <div className="p-3">
                <Input
                  label="Years Shown"
                  value={settings.maxYearsShown}
                  setValue={(v: any) =>
                    setSettings({ ...settings, maxYearsShown: v })
                  }
                  tooltip={
                    <div className="w-40">
                      How many years to show in table and on graphs
                    </div>
                  }
                  labelLength={100}
                  width="w-[100px]"
                  subtype="number"
                  size="md"
                />

                <div className="mt-3">
                  <MultiToggle
                    options={["Monthly", "Annual"]}
                    label=""
                    vertical={true}
                    value={
                      client.liveSettings.monthlyYearly === "monthly"
                        ? "Monthly"
                        : "Annual"
                    }
                    setValue={(v: any) =>
                      setField("liveSettings")({
                        ...client.liveSettings,
                        monthlyYearly: v.toLowerCase(),
                      })
                    }
                  />
                </div>
              </div>
              <div className="p-3 text-[#9396A0] text-[14px]">
                Toggle incomes on/off
              </div>
              <div className="bg-gray-500 h-[1px] w-full"></div>
              <div className="flex flex-col px-3 max-h-[350px] overflow-y-auto">
                {client.incomes.map((income, i) => (
                  <div className="flex items-center">
                    <div className="text-xs w-[555px]">
                      {title(client.incomes, client.people, i)}
                    </div>
                    <Input
                      subtype="toggle"
                      width="!text-[10px]"
                      label={""}
                      value={income.enabled}
                      setValue={(v) =>
                        setField("incomes")(
                          client.incomes.map((income, j) =>
                            j == i ? { ...income, enabled: v } : income,
                          ),
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
};

export default ScenarioHeader;
