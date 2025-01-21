import { useState } from "react";
import ResultTable from "src/components/IncomeTable/ResultTable";

import { useInfo } from "src/useData";
import Layout from "src/components/Layout";
import MapChart from "src/components/MapChart";
import CompositeTable from "./Report/CompositeTable";
import ScenarioHeader from "./IncomeTable/ScenarioHeader";
import { useFullscreen } from "src/hooks/useFullScreen";
import SpendChart from "./SpendChart";
import Scenarios from "./Scenarios";
import SmallToggle from "./Inputs/SmallToggle";
import { SelectedColumn } from "src/types";
const Summary = () => {
  const [tab, setTab] = useState(-1);
  const [selectedColumn, setSelectedColumn] = useState<SelectedColumn>({
    id: 0,
    type: "none",
  });

  const { data, storeScenarios, setField } = useInfo();

  const shownTable = data.liveSettings.mapType;
  const scenarios = data.scenarios;

  const { isFullscreen, toggleFullscreen } = useFullscreen();

  const [selectedYear, setSelectedYear] = useState(0);

  const liveSettings = {
    ...data.liveSettings,
    id: -1,
    people: data.people,
    incomes: data.incomes,
    spending: data.spending,
  };

  const settings =
    tab == -1 ? liveSettings : (scenarios.find(({ id }) => id === tab) as any);
  return (
    <Layout page="map">
      <div className="pb-32 border-[#EDEEF1] border">
        <div className={`sticky z-50 ${isFullscreen ? "top-0" : "top-[72px]"}`}>
          <Scenarios tab={tab} setTab={setTab} />
          <ScenarioHeader client={data} settings={settings} />
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
