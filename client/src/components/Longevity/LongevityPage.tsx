import Layout from "../Layout";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { useInfo } from "src/useData";
import { yearRange } from "src/utils";
import {
  findAgeForProbability,
  findYearForProbability,
  jointTable,
  makeTable,
} from "./calculate";
import LongevityChart from "./LongevityChart";
import Button from "../Inputs/Button";
import Input from "../Inputs/Input";
import { Tooltip } from "flowbite-react";
import { birthday } from "src/calculator/utils";

export const LongevityScenarioCard = ({
  people,
  percent,
}: {
  people: Person[];
  percent: number;
}) => (
  <div className="flex flex-col items-center justify-center bg-white px-6 py-3 rounded-lg screen:shadow-md border gap-1 print:bg-gray-100">
    <div className="uppercase tracking-wide text-gray-800 w-full text-xl font-bold text-center">
      {percent}%
    </div>
    <div className="flex gap-1">
      <div className="flex flex-col gap-1 text-right">
        {people.map((person) => (
          <div className="uppercase tracking-wide text-sm text-gray-800 h-7 flex items-center justify-end">
            {person.name}:
          </div>
        ))}
        {people.length > 1 ? (
          <div className="uppercase tracking-wide text-sm text-gray-800 h-7 flex items-center justify-end">
            Joint:
          </div>
        ) : null}
      </div>
      <div className="flex flex-col gap-1 text-left h-7">
        {people.map((person) => {
          const { year, age } = findAgeForProbability(
            makeTable(person).table,
            percent,
          );
          return (
            <div className="font-semibold text-lg  flex gap-1 items-center h-7">
              {age} <span className="text-gray-500 text-[14px]">({year})</span>
            </div>
          );
        })}

        {people.length > 1 ? (
          <div className="uppercase tracking-wide text-sm text-gray-800 h-7">
            <div className=" font-semibold text-lg  flex gap-1 items-center">
              <span className="text-gray-500 text-[14px]">
                {
                  findYearForProbability(
                    jointTable(people[0], people[1]),
                    percent,
                  ).year
                }
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  </div>
);

const LongevityPage = () => {
  const [highlightedRow, setHighlightedRow] = useState<number | null>(null);
  const [highlightedCol, setHighlightedCol] = useState<number | null>(null);
  const { data: client, setField } = useInfo();
  const people = client.data.people;
  if (!people) return null;

  const [updating, setUpdating] = useState(false);

  const tables = people.map(makeTable);
  const joint = people.length > 1 ? jointTable(people[0], people[1]) : [];
  const longevityPercent =
    client.liveSettings.longevityPercent !== undefined
      ? client.liveSettings.longevityPercent
      : 50;

  const rowCount =
    Math.max(...tables.map((i) => i.table.length), joint.length) - 1;
  const currentYear = new Date().getFullYear();

  if (people.map((i) => i.sex).some((i) => i === undefined))
    return (
      <Layout page="longevity">
        <div className="p-6 rounded-lg">
          <div className="flex gap-3 items-center  w-full justify-center">
            <h1 className="text-3xl font-bold">Longevity</h1>
          </div>
        </div>
        <div className="flex justify-center mt-10 w-full">
          <div className="bg-white border rounded-lg p-6 shadow-md">
            Every member of household needs to have sex set for Longevity
            feature to work.
          </div>
        </div>
      </Layout>
    );

  const updateDeathFields = () => {
    setUpdating(true);
    const years = client.data.people.map(
      (person) =>
        findAgeForProbability(makeTable(person).table, longevityPercent).age,
    );
    setTimeout(() => setUpdating(false), 1500);
    setField("liveSettings")({
      ...client.liveSettings,
      deathYears: years,
    });
  };

  return (
    <Layout page="longevity">
      <div
        className={`px-12 ${people.length > 1 ? "w-[1400px]" : "w-[1400px]"} mx-auto`}
      >
        <div className="flex gap-3 items-center mb-8 w-full justify-center">
          <h1 className="text-3xl font-bold">Longevity</h1>
        </div>
        <div className="flex gap-8 justify-center w-full items-center mb-9 relative">
          <div>
            <Input
              vertical
              width="!w-20"
              value={longevityPercent}
              setValue={(v) =>
                setField("liveSettings")({
                  ...client.liveSettings,
                  longevityPercent: v,
                })
              }
              subtype="percent"
              label="Probability"
            />
          </div>
          <div className="flex flex-col items-center gap-6 w-full">
            <div className="w-full flex gap-8 justify-center">
              {people.map((person) => {
                const { year, age } = findAgeForProbability(
                  makeTable(person).table,
                  longevityPercent,
                );
                return (
                  <div className="flex flex-col items-center justify-center bg-white px-6 py-3 rounded-lg shadow-md border gap-1">
                    <div className="uppercase tracking-wide text-sm text-gray-800 w-full">
                      {person.name}'s {longevityPercent}% Life Expectancy
                    </div>
                    <div className="font-semibold text-lg mt-[2px] flex gap-1 items-center">
                      {age}{" "}
                      <span className="text-gray-500 text-[14px]">
                        ({year})
                      </span>
                    </div>
                  </div>
                );
              })}

              {people.length > 1 ? (
                <div className="flex flex-col items-center justify-center bg-white px-6 py-3 rounded-lg shadow-md border gap-1">
                  <div className="uppercase tracking-wide text-sm text-gray-800 w-full">
                    Joint {longevityPercent}% Life Expectancy
                  </div>
                  <div className="font-semibold text-lg mt-[2px] flex gap-1 items-center">
                    {(() => {
                      const year = findYearForProbability(
                        jointTable(people[0], people[1]),
                        longevityPercent,
                      ).year;
                      const ages = people.map(
                        (person) => year - birthday(person).birthYear,
                      );
                      return (
                        <>
                          {year}{" "}
                          <span className="text-gray-500 text-[14px]">
                            ({ages.join("/")})
                          </span>
                        </>
                      );
                    })()}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <div className="w-32">
            <Tooltip
              content="Update mortality assumptions"
              theme={{ target: "" }}
              style="light"
            >
              <Button type="primary" onClick={updateDeathFields}>
                <div className="flex justify-center items-center gap-1">
                  Update <ArrowUpRightIcon className="h-4" />
                </div>
              </Button>{" "}
            </Tooltip>
          </div>
          <div
            className={`text-sm absolute right-[-50px] bottom-[-6px] text-main-orange transition ease-in-out ${updating ? "opacity-100" : "opacity-0"}`}
          >
            Mortality assumptions updated!
          </div>
        </div>
        <div>
          <LongevityChart people={people} />

          <div className="flex gap-3 justify-center my-9 w-full">
            <LongevityScenarioCard people={people} percent={50} />
            <LongevityScenarioCard people={people} percent={25} />
            <LongevityScenarioCard people={people} percent={10} />
          </div>
          <table className="text-sm w-full bg-white shadow-lg">
            <thead
              className={`text-xs cursor-pointer bg-[#F9FAFB] text-black font-medium text-left sticky z-50 border-1 top-[72px] rounded-none !border-none`}
            >
              <tr>
                <th
                  className={`px-4 py-2 !rounded-none cursor-pointer ${highlightedCol === 0 ? "bg-slate-200" : ""}`}
                  onClick={() =>
                    setHighlightedCol(highlightedCol === 0 ? null : 0)
                  }
                >
                  Year
                </th>
                <th
                  className={`px-4 py-2 !rounded-none cursor-pointer ${highlightedCol === 1 ? "bg-slate-200" : ""}`}
                  onClick={() =>
                    setHighlightedCol(highlightedCol === 1 ? null : 1)
                  }
                >
                  Age
                </th>
                {people.map((person, index) => (
                  <>
                    <th
                      className={`px-4 py-2 cursor-pointer ${highlightedCol === index + 2 ? "bg-slate-200" : ""}`}
                      onClick={() =>
                        setHighlightedCol(
                          highlightedCol === index + 2 ? null : index + 2,
                        )
                      }
                    >
                      Chance of {person.name} <br />
                      living this long
                    </th>
                  </>
                ))}

                {people.length > 1 && (
                  <>
                    <th
                      className={`px-4 py-2 cursor-pointer ${highlightedCol === people.length + 2 ? "bg-slate-200" : ""}`}
                      onClick={() =>
                        setHighlightedCol(
                          highlightedCol === people.length + 2
                            ? null
                            : people.length + 2,
                        )
                      }
                    >
                      Chance both <br /> are alive{" "}
                    </th>
                    <th
                      className={`px-4 py-2 cursor-pointer ${highlightedCol === people.length + 3 ? "bg-slate-200" : ""}`}
                      onClick={() =>
                        setHighlightedCol(
                          highlightedCol === people.length + 3
                            ? null
                            : people.length + 3,
                        )
                      }
                    >
                      Chance at least <br />
                      one is alive{" "}
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {yearRange(0, rowCount).map((_, index) => (
                <tr
                  key={index}
                  className={`cursor-pointer ${highlightedRow === index ? "bg-slate-200" : ""}`}
                  onClick={() =>
                    setHighlightedRow(highlightedRow === index ? null : index)
                  }
                >
                  <td
                    className={`border px-4 py-2 ${highlightedCol === 0 ? "bg-slate-200" : ""}`}
                  >
                    {currentYear + index}
                  </td>
                  <td
                    className={`border px-4 py-2 ${highlightedCol === 1 ? "bg-slate-200" : ""}`}
                  >
                    {tables
                      .map(
                        (i, ind) =>
                          index < i.table.length &&
                          `${people[ind].name} (${i.table[index].age})`,
                      )
                      .filter((i) => i)
                      .join(" / ")}
                  </td>

                  {people.map((_, i) => (
                    <>
                      <td
                        className={`border px-4 py-2 ${highlightedCol === i + 2 ? "bg-slate-200" : ""}`}
                      >
                        {tables[i].table.length > index &&
                          `${Math.round(
                            tables[i].table[index].probability * 1000,
                          ) / 10
                          }%`}
                      </td>
                    </>
                  ))}
                  {people.length > 1 && (
                    <>
                      <td
                        className={`border px-4 py-2 ${highlightedCol === people.length + 2 ? "bg-slate-200" : ""}`}
                      >
                        {joint.length > index &&
                          `${Math.round(joint[index].probability * 1000) / 10}%`}
                      </td>
                      <td
                        className={`border px-4 py-2 ${highlightedCol === people.length + 3 ? "bg-slate-200" : ""}`}
                      >
                        {joint.length > index &&
                          `${Math.round(joint[index].oneAlive * 1000) / 10}%`}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-sm text-gray-500 text-right w-full mt-3 ">
          Source:{" "}
          <Link
            to={`https://www.ssa.gov/oact/HistEst/CohLifeTables/2020/CohLifeTables2020.html`}
            target="_blank"
            className="underline"
          >
            Life Tables for the United States Social Security Area 1900-2100,
            Actuarial Study No. 120
          </Link>
        </div>
      </div>
      <table></table>
    </Layout>
  );
};

export default LongevityPage;
