import Live, { SmallToggle } from "../Live";
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  PrinterIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Input from "src/components/Inputs/Input";
import Confirm from "src/components/Confirm";
import Button from "src/components/Inputs/Button";
import { Spinner } from "flowbite-react";
import { useState } from "react";
import { printReport } from "src/utils";
import { useFullscreen } from "src/hooks/useFullScreen";
import { useInfo } from "src/useData";

interface Props {
  settings: ScenarioSettings;
  client: Client;
  removeScenario: () => void;
}

const ScenarioHeader = ({ client, settings, removeScenario }: Props) => {
  const [removeOpen, setRemoveOpen] = useState(false);
  const [printing, setPrinting] = useState(false);
  const print = async () => {
    setPrinting(true);
    const url = await printReport(client.id, settings.id);
    setPrinting(false);
    window.open(url, "_blank");
  };

  const { setField } = useInfo();

  const setSettings = setField("liveSettings");

  const { isFullscreen, toggleFullscreen } = useFullscreen();

  return settings.id && settings.id !== -1 ? (
    <div
      className={`z-[500] flex p-5 py-8 h-40 gap-5 items-center justify-between sticky ${isFullscreen ? "top-[45px]" : "top-[115px]"} bg-white h-32 print:hidden`}
    >
      <div className="text-[#101828] font-semibold text-[18px]">
        {settings.name || " "}
      </div>
      <div className="hidden print:block"></div>

      <div className="flex gap-5 items-end print:hidden">
        {settings.data.people.length > 1 &&
          settings.data.people.map(
            (person, i) =>
              settings.whoDies == i && (
                <div className="w-36" key={person.id}>
                  <Input
                    subtype="number"
                    vertical
                    disabled
                    label={`${person.name}'s Death`}
                    value={settings.deathYears[i]?.toString()}
                    setValue={() => { }}
                  />
                </div>
              ),
          )}

        <div className="">
          <Input
            label="Years"
            subtype="text"
            size="xs"
            vertical
            disabled
            value={settings.maxYearsShown}
            setValue={() => { }}
          />
        </div>
        <div className="print:mr-[-20px]">
          <Input
            label="Inflation"
            disabled
            size="xs"
            vertical
            subtype="text"
            value={
              settings.inflation != undefined
                ? `${settings.inflation?.toString()}%`
                : "0%"
            }
            setValue={() => { }}
          />
        </div>
        <div>
          <div className="flex mb-4 justify-end gap-3">
            <SmallToggle
              item1="Monthly"
              item2="Annual"
              active={
                client.liveSettings.monthlyYearly === "monthly"
                  ? "Monthly"
                  : "Annual"
              }
              toggle={() =>
                setSettings({
                  ...client.liveSettings,
                  monthlyYearly:
                    client.liveSettings.monthlyYearly === "monthly"
                      ? "yearly"
                      : "monthly",
                })
              }
            />
            <SmallToggle
              item1="Basic"
              item2="Composite"
              active={
                client.liveSettings.mapType === "composite"
                  ? "Composite"
                  : "Basic"
              }
              toggle={() =>
                setSettings({
                  ...client.liveSettings,
                  mapType:
                    client.liveSettings.mapType === "composite"
                      ? "basic"
                      : "composite",
                })
              }
            />
          </div>
          <div className="flex justify-end gap-2 print:hidden">
            <div className="print:hidden">
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
              <Button type="secondary" onClick={print}>
                <div className="flex gap-2">
                  <PrinterIcon className="h-6 w-6" />
                  {printing && <Spinner className="h-5" />}
                </div>
              </Button>
            </div>
            <div>
              <Button type="secondary">
                <TrashIcon
                  className="h-6 w-6 text-red-500 cursor-pointer "
                  onClick={() => setRemoveOpen(true)}
                />
              </Button>
            </div>
            <Confirm
              isOpen={removeOpen}
              onClose={() => setRemoveOpen(false)}
              onConfirm={() => {
                if (removeScenario) removeScenario();
                setRemoveOpen(false);
              }}
            >
              <TrashIcon className="text-slate-400 w-10 m-auto mb-5" />
              <div className="mb-5">
                Are you sure you want to delete this scenario?
              </div>
            </Confirm>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Live client={client} settings={settings} />
  );
};

export default ScenarioHeader;
