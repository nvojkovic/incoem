import "./App.css";
import IncomeSection from "./components/IncomeSection";
import { useEffect, useState } from "react";
import PersonInfo from "./components/Info/PersonInfo";
import MapSection from "./components/MapSection";
import { useParams } from "react-router-dom";
import Summary from "./components/Summary";
import { updateAtIndex } from "./utils";
import Layout from "./components/Layout";
import { getClient, updateData, updateScenarios } from "./services/client";
import Spinner from "./components/Spinner";

function Calculator() {
  const { id } = useParams();
  const [tab, setTab] = useState<"data" | "calculator">("data");
  const [fullScreen, setFullScreen] = useState(false);

  const [settings, setSettings] = useState<ScenarioSettings>({} as any);

  const fetchData = () => {
    return getClient(id)
      .then((data) => data.json())
      .then((data) => {
        setData(data);

        console.log("sett", data);
        setSettings({
          id: data.scenarios.length,
          maxYearsShown: 30,
          deathYears: data.data.people.length === 2 ? [null, null] : [null],
          ssSurvivorAge: data.data.people.length === 2 ? [null, null] : [null],
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
  console.log("settings", settings);

  const [data, setLocal] = useState<Client | null>(null);
  const setData = (data: Client) => {
    console.log(data);
    updateData(data.id, data.data);
    setLocal(data);
  };
  if (!data)
    return (
      <Layout page="data" onTabChange={() => {}}>
        <Spinner />
      </Layout>
    );

  const removeIncome = (index: number) => {
    setData({
      ...data,
      data: {
        ...data.data,
        incomes: data.data.incomes.filter((_, i) => i !== index),
      },
    });
  };
  const setIncome = (index: number, income: Income) => {
    setData({
      ...data,
      data: {
        ...data.data,
        incomes: updateAtIndex(data.data.incomes, index, income),
      },
    });
  };
  const addIncome = (income: Income) => {
    setData({
      ...data,
      data: {
        ...data.data,
        incomes: [...data.data.incomes, income],
      },
    });
  };

  return (
    <Layout
      page={tab}
      hidden={fullScreen}
      onTabChange={(tab: any) => setTab(tab)}
      household={data.title}
    >
      <div>
        <div className="mt-6 max-w-[1280px] m-auto mb-32 px-10">
          {tab == "data" ? (
            <div className="flex flex-col gap-6">
              <MapSection
                title="Basic information"
                defaultOpen={false}
                toggleabble
              >
                <div className="flex gap-6">
                  {data.data.people.map((person, i) => (
                    <PersonInfo
                      title={`Person ${i + 1}`}
                      key={i}
                      subtitle="Details about how this works"
                      person={person}
                      setPerson={(person) =>
                        setData({
                          ...data,
                          data: {
                            ...data.data,
                            people: updateAtIndex(data.data.people, i, person),
                          },
                        })
                      }
                    />
                  ))}
                </div>
              </MapSection>
              <IncomeSection
                defaultOpen={true}
                incomes={data.data.incomes}
                people={data.data.people}
                removeIncome={removeIncome}
                setIncome={setIncome}
                addIncome={addIncome}
                updateIncomes={(incomes: any) => {
                  setData({
                    ...data,
                    data: {
                      ...data.data,
                      incomes,
                    },
                  });
                }}
              ></IncomeSection>
            </div>
          ) : (
            <Summary
              data={
                {
                  ...data.data,
                  incomes: data.data.incomes.filter((i) => i.enabled),
                } as IncomeMapData
              }
              settings={settings}
              setSettings={setSettings}
              hideNav={setFullScreen}
              store={(scenarios: ScenarioSettings[]) => {
                console.log("update", scenarios);
                const client = {
                  ...data,
                  scenarios,
                };
                setData(client);
                updateScenarios(client.id, scenarios);
              }}
              scenarios={data.scenarios}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Calculator;
