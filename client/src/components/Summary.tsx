import { useLayoutEffect, useState } from "react";
import ResultTable from "src/components/IncomeTable/ResultTable";
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
import { useInfo } from "src/useData";
import Layout from "src/components/Layout";
import MapChart from "src/components/MapChart";
import Live from "src/components/Live";

const Summary = () => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const [fullScreen, setFullScreen] = useState(false);
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

  useLayoutEffect(() => {
    const fullscreenchange = () => {
      setFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", fullscreenchange);
    return () => {
      document.removeEventListener("fullscreenchange", fullscreenchange);
    };
  }, []);

  const [selectedYear, setSelectedYear] = useState(0);
  return (
    <Layout page="map">
      <div>
        <div className={`sticky z-50 ${fullScreen ? "top-0" : "top-[72px]"}`}>
          <div
            className={`flex print:hidden sticky z-[5000] ${fullScreen ? "top-[0px]" : "top-[72px]"
              } bg-[#f8f8f8]`}
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
              fullScreen={fullScreen}
              client={data}
              changeFullScreen={() =>
                fullScreen ? closeFullscreen() : openFullScreen()
              }
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              selectedColumn={selectedColumn}
              setSelectedColumn={setSelectedColumn}
            />
          ) : (
            <>
              <ResultTable
                client={data}
                settings={scenarios.find(({ id }) => id === tab) as any}
                fullScreen={fullScreen}
                changeFullScreen={() =>
                  fullScreen ? closeFullscreen() : openFullScreen()
                }
                id={tab}
                removeScenario={() => {
                  const newScenarios = scenarios.filter((sc) => sc.id != tab);
                  storeScenarios(newScenarios);
                  setTab(-1);
                }}
                name={scenarios.find(({ id }) => id === tab)?.name}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                selectedColumn={selectedColumn}
                setSelectedColumn={setSelectedColumn}
              />
              <MapChart
                settings={scenarios.find(({ id }) => id === tab) as any}
                client={data}
              />
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Summary;
