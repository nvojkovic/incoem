import Layout from "../Layout";
import { Link } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useInfo } from "src/useData";
import { birthday } from "src/calculator/utils";
import { roundedToFixed, yearRange } from "src/utils";
import { findFiftyPercentPoint, jointTable, makeTable } from "./calculate";
import LongevityChart from "./LongevityChart";

const LongevityPage = () => {
  const { data: client } = useInfo();
  const people = client.data.people;
  if (!people) return null;

  const tables = people.map(makeTable);
  const joint = people.length > 1 ? jointTable(people[0], people[1]) : [];

  const rowCount =
    Math.max(...tables.map((i) => i.table.length), joint.length) - 1;
  const currentYear = new Date().getFullYear();

  if (people.map((i) => i.sex).some((i) => i === undefined))
    return (
      <Layout page="longevity">
        <div className="p-6 rounded-lg">
          <div className="flex gap-3 items-center mb-8">
            <Link to={`/client/${client.id}/calculator`}>
              <div className="rounded-full border border-gray-400 h-8 w-8 flex justify-center items-center cursor-pointer bg-white">
                <ArrowLeftIcon className="h-5 text-gray-500" />
              </div>
            </Link>
            <h1 className="text-3xl font-bold">Life Expectancy Calculator</h1>
          </div>
        </div>
        <div className="flex justify-center mt-10 w-full">
          <div className="bg-white border rounded-lg p-6 shadow-md">
            Every member of household needs to have sex set for Life Expectancy
            Calculator to work.
          </div>
        </div>
      </Layout>
    );

  return (
    <Layout page="longevity">
      <div
        className={`px-12 ${people.length > 1 ? "w-[1400px]" : "w-[1400px]"} mx-auto`}
      >
        <div className="flex gap-3 items-center mb-8 w-full justify-center">
          <h1 className="text-3xl font-bold">Longevity</h1>
        </div>
        <div className="flex gap-8 justify-center w-full">
          <div className="flex flex-col items-center gap-6 w-full">
            <div className="w-full flex gap-8 justify-center">
              {people.map((person) => {
                const { birthYear } = birthday(person);
                return (
                  <div className="flex flex-col items-center justify-center bg-white px-6 py-3 rounded-lg shadow-md border gap-1">
                    <div className="uppercase tracking-wide text-sm text-gray-800 w-full">
                      {person.name}'s Life Expectancy
                    </div>
                    <div className="font-semibold text-lg mt-[2px] flex gap-1 items-center">
                      {roundedToFixed(makeTable(person).e, 1)}{" "}
                      <span className="text-gray-500 text-[14px]">
                        ({Math.round(makeTable(person).e) + birthYear})
                      </span>
                    </div>
                  </div>
                );
              })}
              <div className="flex flex-col items-center justify-center bg-white px-6 py-3 rounded-lg shadow-md border gap-1">
                <div className="uppercase tracking-wide text-sm text-gray-800 w-full">
                  Joint Life Expectancy
                </div>
                <div className="font-semibold text-lg mt-[2px]">
                  {roundedToFixed(
                    findFiftyPercentPoint(
                      makeTable(people[0]).e,
                      makeTable(people[1]).e,
                    ),
                    1,
                  )}{" "}
                </div>
              </div>
            </div>
            <LongevityChart people={people} />

            <table className="text-sm w-full bg-white shadow-lg">
              <thead
                className={`text-xs cursor-pointer bg-[#F9FAFB] text-black font-medium text-left sticky z-50 border-1 top-[72px] rounded-none !border-none`}
              >
                <tr>
                  <th className="px-4 py-2 !rounded-none">Year</th>
                  <th className="px-4 py-2 !rounded-none">Age</th>
                  {people.map((person) => (
                    <>
                      <th className="px-4 py-2">
                        Chance of {person.name} <br />
                        living this long
                      </th>
                    </>
                  ))}

                  {people.length > 1 && (
                    <>
                      <th className="px-4 py-2">
                        Chance both <br /> are alive{" "}
                      </th>
                      <th className="px-4 py-2">
                        Chance at least <br />
                        one is alive{" "}
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {yearRange(0, rowCount).map((_, index) => (
                  <tr key={index}>
                    <td className={`border px-4 py-2`}>
                      {currentYear + index}
                    </td>
                    <td className={`border px-4 py-2`}>
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
                        <td className={`border px-4 py-2 `}>
                          {tables[i].table.length > index &&
                            `${Math.round(
                              tables[i].table[index].probability * 10000,
                            ) / 100
                            }%`}
                        </td>
                      </>
                    ))}
                    {people.length > 1 && (
                      <>
                        <td className={`border px-4 py-2`}>
                          {joint.length > index &&
                            `${Math.round(joint[index].probability * 10000) / 100}%`}
                        </td>
                        <td className={`border px-4 py-2`}>
                          {joint.length > index &&
                            `${Math.round(joint[index].oneAlive * 10000) / 100}%`}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
