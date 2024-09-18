import "./App.css";
import IncomeSection from "./components/IncomeSection";
import { useEffect, useState } from "react";
import { PeopleInfo } from "./components/Info/PersonInfo";
import MapSection from "./components/MapSection";
import { useParams } from "react-router-dom";
import Summary from "./components/Summary";
import Layout from "./components/Layout";
import { getClient } from "./services/client";
import Spinner from "./components/Spinner";
import { IncomeProvider } from "./useData";
import CalculatorMap from "./components/Calculators/CalculatorMap";
import { initialVersatileSettings } from "./components/Calculators/versatileTypes";

function Calculator() {
  const { id } = useParams();
  const [tab, setTab] = useState<"data" | "calculator" | "map">("data");
  const [fullScreen, setFullScreen] = useState(false);

  const fetchData = () => {
    console.log("fetchData");
    return getClient(id)
      .then((data) => data.json())
      .then((data) => {
        setData(data);
        data = { ...data.data, scenarios: data.scenarios };
        setSettings({
          id: data.scenarios.length,
          maxYearsShown: 30,
          deathYears: data.people.length === 2 ? [null, null] : [null],
          ssSurvivorAge: data.people.length === 2 ? [null, null] : [null],
          inflation: 0,
          whoDies: -1,
          name: "",
          data,
        });
      });
  };
  useEffect(() => {
    fetchData();
  }, []);

  const [data, setData] = useState<Client | null>(null);
  const [settings, sett] = useState<ScenarioSettings>({} as any);
  const [versatileCalculatorData, setVersatileData] = useState(
    initialVersatileSettings,
  );
  const setSettings = (settings: ScenarioSettings) => {
    console.log("setSettings", settings);
    sett(settings);
  };

  if (!data)
    return (
      <Layout page="data" onTabChange={() => { }}>
        <Spinner />
      </Layout>
    );

  return (
    <IncomeProvider initialData={data}>
      <Layout
        page={tab}
        hidden={fullScreen}
        onTabChange={(tab: any) => setTab(tab)}
      >
        <div>
          <div className="mt-6 max-w-[1480px] m-auto mb-32 px-10">
            {tab == "data" && (
              <div className="flex flex-col gap-6">
                <MapSection
                  title="Basic information"
                  defaultOpen={false}
                  toggleabble
                >
                  <PeopleInfo />
                </MapSection>
                <IncomeSection defaultOpen={true} />
              </div>
            )}
            {tab == "map" && (
              <Summary
                settings={settings}
                setSettings={setSettings}
                hideNav={setFullScreen}
              />
            )}

            {tab == "calculator" && (
              <CalculatorMap
                data={versatileCalculatorData}
                setData={setVersatileData}
              />
            )}
          </div>
        </div>
      </Layout>
    </IncomeProvider>
  );
}

export default Calculator;
