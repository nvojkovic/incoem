import { ArrowsPointingInIcon, TrashIcon } from "@heroicons/react/24/outline";
import Confirm from "./Confirm";
import ModalInput from "./Inputs/ModalInput";
import Input from "./Inputs/Input";
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

import SortableItem from "src/components/Sortable/SortableItem";
import ScenarioTab from "src/components/ScenarioTab";
import { useState } from "react";
import { printReport } from "src/utils";
import { useInfo } from "src/useData";
import { useFullscreen } from "src/hooks/useFullScreen";
import { Spinner } from "flowbite-react";

const Scenarios = ({ tab, setTab }: any) => {
  const { data, storeScenarios } = useInfo();
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    const oldIndex = scenarios.findIndex((s) => s.id === active.id);
    const newIndex = scenarios.findIndex((s) => s.id === over.id);
    if (oldIndex !== newIndex) {
      storeScenarios(arrayMove([...scenarios], oldIndex, newIndex));
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );
  const print = async () => {
    setPrinting(true);
    const url = await printReport(data.id, tab);
    setPrinting(false);
    window.open(url, "_blank");
  };

  const scenarios = data.scenarios;

  const { isFullscreen, toggleFullscreen } = useFullscreen();

  const [saveOpen, setSaveOpen] = useState(false);
  const [name, setName] = useState("");

  const addScenario = (newData: any) => {
    storeScenarios([
      ...data.scenarios,
      { ...newData, id: Math.round(Math.random() * 1000000) },
    ]);
  };
  const removeScenario = () => {
    const newScenarios = scenarios.filter((sc) => sc.id != tab);
    storeScenarios(newScenarios);
    setTab(-1);
  };

  const saveScenario = () => {
    setSaveOpen(false);
    addScenario({
      ...data.liveSettings,
      name,
      incomes: [...data.incomes],
      people: [...data.people],
      spending: { ...data.spending },
    });
  };
  const [removeOpen, setRemoveOpen] = useState(false);
  const [printing, setPrinting] = useState(false);
  return (
    <div
      className={`flex justify-between items-center print:hidden bg-white sticky z-[5000] ${isFullscreen ? "top-[0px]" : "top-[72px]"
        } bg-[#f3f4f6]`}
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
          <div className="flex mt-[-4px]">
            <ScenarioTab
              name="Live"
              id={-1}
              active={tab == -1}
              setActive={() => setTab(-1)}
              live
              store={() => { }}
            />
            {scenarios.map((sc, i) => (
              <SortableItem key={sc.id} id={sc.id} onClick={() => setTab(i)}>
                <ScenarioTab
                  name={sc.name}
                  active={tab == sc.id}
                  setActive={() => setTab(sc.id)}
                  id={i}
                  store={(name: string) => {
                    storeScenarios(
                      scenarios.map((s, j) => (i == j ? { ...s, name } : s)),
                    );
                  }}
                />
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <div>
        <div className="flex justify-end print:hidden">
          <div className="print:hidden">
            <div className="flex gap-3 p-3">
              <div
                className="flex items-center"
                onClick={() => toggleFullscreen()}
              >
                {isFullscreen ? (
                  <ArrowsPointingInIcon className="h-6 w-6" />
                ) : (
                  <img
                    src="/icons/expand.png"
                    className="h-6 w-6 cursor-pointer"
                  />
                )}
              </div>
            </div>
          </div>
          <div>
            <div className="flex gap-2 p-3" onClick={print}>
              <img src="/icons/print.png" className="h-6 w-6 cursor-pointer" />
              {printing && <Spinner className="h-5" />}
            </div>
          </div>

          {tab === -1 && (
            <div>
              <div
                className="flex gap-2 p-3 cursor-pointer"
                onClick={() => setSaveOpen(true)}
              >
                <img src="/icons/save.png" className="w-6 h-6" />
              </div>
              <ModalInput
                isOpen={saveOpen}
                onClose={() => {
                  setSaveOpen(false);
                  setName("");
                }}
                onConfirm={() => {
                  saveScenario();
                }}
              >
                <div className="py-3">
                  <Input
                    label="Scenario name"
                    value={name}
                    setValue={(name) => setName(name)}
                    onKeyDown={(e: any) => {
                      if (e.key === "Enter") {
                        saveScenario();
                      }
                    }}
                    size="full"
                    vertical
                  />
                </div>
              </ModalInput>
            </div>
          )}
          {tab !== -1 && (
            <div>
              <TrashIcon
                className="h-6 w-6 text-red-500 cursor-pointer m-3"
                onClick={() => setRemoveOpen(true)}
              />
            </div>
          )}
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
  );
};

export default Scenarios;
