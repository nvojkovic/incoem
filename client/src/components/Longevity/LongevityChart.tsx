import SurvivalChart from "../Charts/LifeExpectancyChart";
import { jointTable, makeTable } from "./calculate";

const LongevityChart = ({ people }: { people: Person[] }) => {
  const tables = people.map(makeTable);

  const joint = people.length > 1 ? jointTable(people[0], people[1]) : [];

  const rowCount =
    Math.max(...tables.map((i) => i.table.length), joint.length) - 1;
  return (
    <div className="w-full">
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
    </div>
  );
};

export default LongevityChart;
