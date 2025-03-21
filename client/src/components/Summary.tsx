import { useState } from "react";
import ResultTable from "src/components/IncomeTable/ResultTable";

import { useInfo } from "src/hooks/useData";
import Layout from "src/components/Layout";
import MapChart from "src/components/MapChart";
import CompositeTable from "./Report/CompositeTable";
import ScenarioHeader from "./IncomeTable/ScenarioHeader";
import { useFullscreen } from "src/hooks/useFullScreen";
import SpendChart from "./SpendChart";
import Scenarios from "./Scenarios";
import SmallToggle from "./Inputs/SmallToggle";

import { SelectedColumn } from "src/types";
import ChartModal from "./ChartModal";

const Summary = () => {
  const [tab, setTab] = useState(-1);
  const { data, setField } = useInfo();
  const [selectedYear, setSelectedYear] = useState(0);
  const { isFullscreen } = useFullscreen();
  const [selectedColumn, setSelectedColumn] = useState<SelectedColumn>({
    id: 0,
    type: "none",
  });

  const shownTable = data.liveSettings.mapType;
  const scenarios = data.scenarios;

  const liveSettings = {
    ...data.liveSettings,
    id: -1,
    people: data.people,
    incomes: data.incomes,
    spending: data.spending,
  };

  const init =
    tab == -1 ? liveSettings : (scenarios.find(({ id }) => id === tab) as any);

  const settings = {
    ...init,
    inflationType: data.liveSettings.inflationType,
    mapType: data.liveSettings.mapType,
    monthlyYearly: data.liveSettings.monthlyYearly,
    chartType: data.liveSettings.chartType,
    maxYearsShown: data.liveSettings.maxYearsShown,
    taxType: data.liveSettings.taxType,
  };

  const chart =
    settings.chartType == "spending" ? (
      <SpendChart settings={settings} client={data} />
    ) : (
      <MapChart settings={settings} client={data} />
    );
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
              settings={settings}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              selectedColumn={selectedColumn}
              setSelectedColumn={setSelectedColumn}
              setSettings={tab === -1 ? setField("liveSettings") : () => {}}
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
              <ChartModal
                children={
                  <div>
                    <div className="flex justify-end gap-3">
                      <SmallToggle
                        item1="Income"
                        item2="Spending"
                        active={
                          settings.chartType == "spending"
                            ? "Spending"
                            : "Income"
                        }
                        toggle={() => {
                          setField("liveSettings")({
                            ...settings,
                            chartType:
                              settings.chartType == "spending"
                                ? "income"
                                : "spending",
                          });
                        }}
                      />
                    </div>
                    {chart}
                  </div>
                }
              />
            </div>
            {chart}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Summary;
