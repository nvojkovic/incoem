import femaleTables from "src/assets/tables-female.json";
import maleTables from "src/assets/tables-male.json";
import Layout from "../Layout";
import { Link } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useInfo } from "src/useData";
import { calculateAge } from "../Info/PersonInfo";
import { birthday } from "src/calculator/utils";
import { yearRange } from "src/utils";
import SurvivalChart from "../Charts/LifeExpectancyChart";

const LifeExpectancy = () => {
  const { data: client } = useInfo();
  const people = client.data.people;
  if (!people) return null;

  const makeTable = (person: Person) => {
    const age = calculateAge(new Date(person.birthday));
    const { birthYear } = birthday(person);
    const selectedTable: any =
      person.sex === "Male" ? maleTables : femaleTables;
    const table = selectedTable[birthYear.toString()];
    let result = [];
    let aliveProbability = 1;
    for (let current = age; current < 120; current++) {
      const row = table[current];
      const [q, _] = row;
      const probability = aliveProbability * (1 - q);
      aliveProbability = probability;
      result.push({
        year: birthYear + current,
        age: current,
        q,
        probability: probability,
      });
    }

    return { table: result, e: table[age][1] + age };
  };

  const jointTable = (person1: Person, person2: Person) => {
    const table1 = makeTable(person1);
    const table2 = makeTable(person2);
    let result = [];
    let aliveProbability = 1;
    for (
      let current = 0;
      current < Math.min(table1.table.length, table2.table.length);
      current++
    ) {
      const row1 = table1.table[current];
      const row2 = table2.table[current];
      const q = 1 - (1 - row1.q) * (1 - row2.q);
      const probability = aliveProbability * (1 - q);
      const oneAlive = 1 - (1 - row1.probability) * (1 - row2.probability);
      aliveProbability = probability;
      result.push({
        year: row1.year,
        age: `${row1.age} / ${row2.age}`,
        q,
        probability: probability,
        oneAlive,
      });
    }
    return result;
  };

  const tables = people.map(makeTable);
  const joint = people.length > 1 ? jointTable(people[0], people[1]) : [];

  const rowCount =
    Math.max(...tables.map((i) => i.table.length), joint.length) - 1;
  const currentYear = new Date().getFullYear();

  if (people.map((i) => i.sex).some((i) => i === undefined))
    return (
      <Layout page="calculator">
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
    <Layout page="calculator">
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

      <div
        className={`px-12 ${people.length > 1 ? "w-[1200px]" : "w-[1200px]"} mx-auto`}
      >
        <div className="flex gap-8 justify-center w-full">
          <div className="flex flex-col items-center gap-6 w-full">
            <div className="w-full flex gap-8 justify-center">
              {people.map((person) => (
                <div className="flex flex-col items-center justify-center bg-white px-6 py-3 rounded-lg shadow-md border">
                  <div className="uppercase tracking-wide text-sm text-gray-800 w-full">
                    {person.name}'s Life Expectancy
                  </div>
                  <div className="font-semibold text-lg mt-[2px]">
                    {makeTable(person).e}
                  </div>
                </div>
              ))}
            </div>
            <SurvivalChart
              person1Data={tables[0].table
                .map((i) => i.probability)
                .slice(0, rowCount)}
              person2Data={
                tables.length > 1
                  ? tables[1].table.map((i) => i.probability).slice(0, rowCount)
                  : undefined
              }
              jointData={joint.map((i) => i.probability)}
              person1Name={people[0].name}
              person2Name={people[1]?.name}
            />
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
                        Chance {person.name} <br />
                        dies in this year
                      </th>
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
                {yearRange(0, rowCount).map((row, index) => (
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
                            `${Math.round(tables[i].table[index].q * 10000) / 100}%`}
                        </td>
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
      </div>
      <table></table>
    </Layout>
  );
};

export default LifeExpectancy;
