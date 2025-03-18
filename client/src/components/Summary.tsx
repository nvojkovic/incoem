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
import TaxStatusTable from "./IncomeTable/TaxStatusTable";
import SourceTable from "./IncomeTable/SourceTable";
import PersonTable from "./IncomeTable/PersonTable";

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
    showTaxType: data.liveSettings.showTaxType,
  };

  const chart =
    settings.chartType == "spending" ? (
      <SpendChart settings={settings} client={data} />
    ) : (
      <MapChart settings={settings} client={data} />
    );

  const getTable = (shownTable: string) => {
    if (shownTable === "composite") {
      return CompositeTable;
    } else if (shownTable === "result") {
      return ResultTable;
    } else if (shownTable === "by tax status") {
      return TaxStatusTable;
    } else if (shownTable === "by income type") {
      return SourceTable;
    } else if (shownTable === "by person") {
      return PersonTable;
    } else {
      return ResultTable;
    }
  };
  const Table = getTable(shownTable);
  return (
    <Layout page="map">
      <div className="pb-32 border-[#EDEEF1] border">
        <div className={`sticky z-50 ${isFullscreen ? "top-0" : "top-[72px]"}`}>
          <Scenarios tab={tab} setTab={setTab} />
          <ScenarioHeader client={data} settings={settings} />
          <Table
            client={data}
            scenario={settings}
            settings={settings}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            selectedColumn={selectedColumn}
            setSelectedColumn={setSelectedColumn}
          />

          <div className=" my-3 bg-white">
            <div className="flex justify-end p-3">
              {data.needsFlag && (
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
                        settings.chartType == "spending"
                          ? "income"
                          : "spending",
                    });
                  }}
                />
              )}
              <ChartModal
                children={
                  <div>
                    <div className="flex justify-end gap-3">
                      {data.needsFlag && (
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
                      )}
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
