import { useLayoutEffect, useState } from "react";
import Live from "./Live";
import ResultTable from "./ResultTable";
import save from "../assets/save.png";
import Button from "./Inputs/Button";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";

import {
  ArrowsPointingOutIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";
import { ArrowsPointingInIcon } from "@heroicons/react/24/outline";
import ModalInput from "./Inputs/ModalInput";
import Input from "./Inputs/Input";
import SortableItem from "./Sortable/SortableItem";
import ScenarioTab from "./ScenarioTab";
import { Spinner } from "flowbite-react";
const Summary = ({
  data,
  clientId,
  store,
  scenarios,
  settings,
  setSettings,
  hideNav,
}: {
  data: IncomeMapData;
  clientId: any;
  scenarios: ScenarioSettings[];
  store: any;
  hideNav: any;
  settings: ScenarioSettings;
  setSettings: any;
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );
  const [tab, setTab] = useState(-1);
  const [saveOpen, setSaveOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<SelectedColumn>({
    id: 0,
    type: "none",
  });

  const openFullScreen = () => {
    var elem = document.documentElement as any;

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE11 */
      elem.msRequestFullscreen();
    }
  };

  function closeFullscreen() {
    const doc: any = document;
    if (doc.exitFullscreen) {
      doc.exitFullscreen();
    } else if (doc.webkitExitFullscreen) {
      /* Safari */
      doc.webkitExitFullscreen();
    } else if (doc.msExitFullscreen) {
      /* IE11 */
      doc.msExitFullscreen();
    }
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    const oldIndex = scenarios.findIndex((s) => s.id === active.id);
    const newIndex = scenarios.findIndex((s) => s.id === over.id);
    if (oldIndex !== newIndex) {
      store(arrayMove([...scenarios], oldIndex, newIndex));
    }
  };

  const [fullScreen, setFullScreen] = useState(false);
  useLayoutEffect(() => {
    const fullscreenchange = () => {
      setFullScreen(!!document.fullscreenElement);
      hideNav(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", fullscreenchange);
    return () => {
      document.removeEventListener("fullscreenchange", fullscreenchange);
    };
  }, []);

  const [selectedYear, setSelectedYear] = useState(0);
  const [printing, setPrinting] = useState(false);
  const print = async () => {
    setPrinting(true);
    const pdfFile = await fetch(
      import.meta.env.VITE_API_URL +
      "print/client/pdf/" +
      clientId +
      "/" +
      Math.max(tab, 0).toString(),
    ).then((res) => res.json());
    setPrinting(false);
    window.open(
      import.meta.env.VITE_API_URL + "report/?report=" + pdfFile.file,
      "_blank",
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="font-semibold text-[30px] print:hidden">
          Income Map Overview
        </div>
        <div className="font-semibold text-[30px] hidden print:block">
          {scenarios.find((_, i) => i == tab)?.name}
        </div>
        <div className="flex gap-3 print:hidden">
          <div>
            <Button type="secondary" onClick={() => print()}>
              <div className="flex gap-2">
                <PrinterIcon className="h-5 w-5" />
                <div className="text-sm">Print</div>
                {printing && <Spinner className="h-5" />}
              </div>
            </Button>
          </div>
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
              store([
                ...scenarios,
                { ...settings, id: scenarios.length + 1, data: { ...data } },
              ]);
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
                    store([
                      ...scenarios,
                      {
                        ...settings,
                        id: scenarios.length + 1,
                        data: { ...data },
                      },
                    ]);
                  }
                }}
                size="full"
                vertical
              />
            </div>
          </ModalInput>
          <div>
            <Button type="secondary" onClick={() => setSaveOpen(true)}>
              <div className="flex gap-2">
                <img src={save} className="w-5 h-5" />
                <div className="text-sm">Save scenario</div>
              </div>
            </Button>
          </div>
          <div>
            <Button
              type="secondary"
              onClick={fullScreen ? closeFullscreen : openFullScreen}
            >
              <div className="flex gap-3">
                <div className="flex items-center">
                  {fullScreen ? (
                    <ArrowsPointingInIcon className="h-5 w-5" />
                  ) : (
                    <ArrowsPointingOutIcon className="h-5 w-5" />
                  )}
                </div>
                <div className="text-sm">Presentation mode</div>
              </div>
            </Button>
          </div>
        </div>
      </div>
      <div className={`sticky z-50 ${fullScreen ? "top-0" : "top-[72px]"}`}>
        <div
          className={`border-b border-[#EAECF0] mb-10 flex print:hidden sticky z-50 ${fullScreen ? "top-[0px]" : "top-[72px]"
            } bg-white`}
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={scenarios}
              strategy={horizontalListSortingStrategy}
            >
              <div className="flex">
                <ScenarioTab
                  name="Live"
                  id={-1}
                  active={tab == -1}
                  setActive={() => setTab(-1)}
                  live
                  store={() => { }}
                />
                {scenarios.map((sc, i) => (
                  <SortableItem
                    key={sc.id}
                    id={sc.id}
                    onClick={() => setTab(i)}
                  >
                    <ScenarioTab
                      name={sc.name}
                      active={tab == sc.id}
                      setActive={() => setTab(sc.id)}
                      id={i}
                      store={(name: string) => {
                        store(
                          scenarios.map((s, j) =>
                            i == j ? { ...s, name } : s,
                          ),
                        );
                      }}
                    />
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {tab == -1 ? (
          <Live
            data={data}
            settings={settings}
            setSettings={setSettings}
            fullScreen={fullScreen}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            selectedColumn={selectedColumn}
            setSelectedColumn={setSelectedColumn}
          />
        ) : (
          <ResultTable
            settings={scenarios.find(({ id }) => id === tab) as any}
            fullScreen={fullScreen}
            id={tab}
            removeScenario={() => {
              const newScenarios = scenarios.filter((sc) => sc.id != tab);
              store(newScenarios);
              setTab(-1);
            }}
            data={scenarios.find(({ id }) => id === tab)?.data as any}
            name={scenarios.find(({ id }) => id === tab)?.name}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            selectedColumn={selectedColumn}
            setSelectedColumn={setSelectedColumn}
          />
        )}
      </div>
    </div>
  );
};

export default Summary;
