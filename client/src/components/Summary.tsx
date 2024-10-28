import { useLayoutEffect, useState } from "react";
import Live from "./Live";
import ResultTable from "./ResultTable";
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

import SortableItem from "./Sortable/SortableItem";
import ScenarioTab from "./ScenarioTab";
import { useInfo } from "../useData";
const Summary = ({
  settings,
  setSettings,
  hideNav,
}: {
  // data: IncomeMapData;
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
  const [selectedColumn, setSelectedColumn] = useState<SelectedColumn>({
    id: 0,
    type: "none",
  });

  const { data, storeScenarios } = useInfo();
  const scenarios = data.scenarios;

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
      storeScenarios(arrayMove([...scenarios], oldIndex, newIndex));
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
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="font-semibold text-[30px] hidden print:block">
          {scenarios?.find((_, i) => i == tab)?.name}
        </div>
      </div>
      <div className={`sticky z-50 ${fullScreen ? "top-0" : "top-[72px]"}`}>
        <div
          className={`flex print:hidden sticky z-50 ${fullScreen ? "top-[0px]" : "top-[72px]"
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
                        storeScenarios(
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
            data={data.data}
            settings={settings}
            setSettings={setSettings}
            fullScreen={fullScreen}
            clientId={data.id}
            addScenario={(data: any) => {
              storeScenarios([
                ...scenarios,
                { ...data, id: scenarios.length + 1 },
              ]);
            }}
            changeFullScreen={() =>
              fullScreen ? closeFullscreen() : openFullScreen()
            }
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            selectedColumn={selectedColumn}
            setSelectedColumn={setSelectedColumn}
            spending={data.spending}
          />
        ) : (
          <ResultTable
            clientId={data.id}
            settings={scenarios.find(({ id }) => id === tab) as any}
            fullScreen={fullScreen}
            id={tab}
            removeScenario={() => {
              const newScenarios = scenarios.filter((sc) => sc.id != tab);
              storeScenarios(newScenarios);
              setTab(-1);
            }}
            data={scenarios.find(({ id }) => id === tab)?.data as any}
            name={scenarios.find(({ id }) => id === tab)?.name}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            changeFullScreen={() =>
              fullScreen ? closeFullscreen() : openFullScreen()
            }
            selectedColumn={selectedColumn}
            setSelectedColumn={setSelectedColumn}
          />
        )}
      </div>
    </div>
  );
};

export default Summary;
