import { useState } from "react";
import Input from "./Inputs/Input";
import WhoDies from "./WhoDies";
import { updateAtIndex } from "../utils";
import ResultTable from "./ResultTable";
const Live = ({ data }: { data: IncomeMapData; store: any }) => {
  const [settings, setSettings] = useState<ScenarioSettings>({
    maxYearsShown: 20,
    deathYears: data.people.length === 2 ? [null, null] : [null],
    inflation: 0,
    whoDies: -1,
    name: "",
    data,
  });

  return (
    <div>
      <div className="flex justify-between mb-5 items-end">
        {data.people.length == 2 ? (
          <div className="flex gap-3 border border-1 rounded-md h-10 items-end">
            <div className={`flex items-end`}>
              <WhoDies
                active={settings.whoDies == -1}
                setWhoDies={(i: number) =>
                  setSettings({
                    ...settings,
                    whoDies: i,
                    deathYears: [null, null],
                  })
                }
                i={-1}
                title="Both live"
              />
              {data.people.map((person, i) => (
                <WhoDies
                  active={settings.whoDies == i}
                  setWhoDies={(i: number) =>
                    setSettings({
                      ...settings,
                      whoDies: i,
                      deathYears: [null, null],
                    })
                  }
                  i={i}
                  title={`${person.name} dies`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div></div>
        )}
        <div className="flex gap-5">
          <Input
            label="Max years shown"
            subtype="number"
            size="md"
            value={settings.maxYearsShown?.toString()}
            setValue={(e) =>
              setSettings({ ...settings, maxYearsShown: parseInt(e) })
            }
          />
          {data.people.length > 1 &&
            data.people.map((person, i) => (
              <Input
                subtype="number"
                disabled={i !== settings.whoDies}
                label={`${person.name}'s death`}
                value={settings.deathYears[i]?.toString()}
                setValue={(e) =>
                  setSettings({
                    ...settings,
                    deathYears: updateAtIndex(
                      settings.deathYears,
                      i,
                      parseInt(e),
                    ),
                  })
                }
              />
            ))}
          <Input
            label="Inflation"
            subtype="percent"
            value={settings.inflation?.toString()}
            setValue={(e) =>
              setSettings({ ...settings, inflation: parseFloat(e) })
            }
          />
        </div>
      </div>
      <ResultTable settings={settings} data={data} />
    </div>
  );
};

export default Live;
