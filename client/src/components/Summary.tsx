import { useState } from "react";
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
import CompositeTable from "./Report/CompositeTable";
import ScenarioHeader from "./IncomeTable/ScenarioHeader";
import { useFullscreen } from "src/hooks/useFullScreen";
import { SmallToggle } from "./Live";
import SpendChart from "./SpendChart";

const Summary = () => {
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

  const { data, storeScenarios, setField } = useInfo();

  const shownTable = data.liveSettings.mapType;
  const scenarios = data.scenarios;

  const { isFullscreen, toggleFullscreen } = useFullscreen();

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    const oldIndex = scenarios.findIndex((s) => s.id === active.id);
    const newIndex = scenarios.findIndex((s) => s.id === over.id);
    if (oldIndex !== newIndex) {
      storeScenarios(arrayMove([...scenarios], oldIndex, newIndex));
    }
  };

  const [selectedYear, setSelectedYear] = useState(0);

  const liveSettings = {
    ...data.liveSettings,
    data: data.data,
    spending: data.spending,
  };

  const settings =
    tab == -1 ? liveSettings : (scenarios.find(({ id }) => id === tab) as any);
  return (
    <Layout page="map">
      <div className="pb-32">
        <div className={`sticky z-50 ${isFullscreen ? "top-0" : "top-[72px]"}`}>
          <div
            className={`flex justify-between items-center print:hidden sticky z-[5000] ${isFullscreen ? "top-[0px]" : "top-[72px]"
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
          <ScenarioHeader
            removeScenario={() => {
              const newScenarios = scenarios.filter((sc) => sc.id != tab);
              storeScenarios(newScenarios);
              setTab(-1);
            }}
            client={data}
            settings={settings}
          />
          {shownTable === "composite" ? (
            <CompositeTable
              client={data}
              scenario={settings}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              selectedColumn={selectedColumn}
              setSelectedColumn={setSelectedColumn}
            />
          ) : (
            <ResultTable
              client={data}
              changeFullScreen={() => toggleFullscreen()}
              settings={settings}
              removeScenario={() => {
                const newScenarios = scenarios.filter((sc) => sc.id != tab);
                storeScenarios(newScenarios);
                setTab(-1);
              }}
              fullScreen={isFullscreen}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              selectedColumn={selectedColumn}
              setSelectedColumn={setSelectedColumn}
              setSettings={tab === -1 ? setField("liveSettings") : () => { }}
              id={tab}
            />
          )}
          <div className=" my-3 bg-white">
            <div className="flex justify-end p-3">
              <SmallToggle
                item1="Income"
                item2="Spending"
                active={
                  settings.chartType == "spending" ? "Spending" : "Income"
                }
                toggle={() => {
                  setField("liveSettings")({
                    ...settings,
                    chartType:
                      settings.chartType == "spending" ? "income" : "spending",
                  });
                }}
              />
            </div>
            {settings.chartType == "spending" ? (
              <SpendChart settings={settings} client={data} />
            ) : (
              <MapChart settings={settings} client={data} />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Summary;
