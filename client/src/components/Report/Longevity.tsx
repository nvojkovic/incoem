import { roundedToFixed } from "src/utils";
import LongevityChart from "../Longevity/LongevityChart";
import { birthday } from "src/calculator/utils";
import { findFiftyPercentPoint, makeTable } from "../Longevity/calculate";
import Header from "./Header";
import { PrintCard } from "./PrintCard";

const Longevity = ({
  client,
  scenario,
}: {
  client: PrintClient;
  scenario: ScenarioSettings;
}) => {
  const people = scenario.data.people;
  return (
    <div className={`px-12 py-12  mx-auto`}>
      <Header client={client} scenario={scenario} />
      <div className="flex gap-3 items-center mb-8 w-full justify-center">
        <h1 className="text-2xl">Longevity</h1>
      </div>
      <div className="flex gap-8 justify-center w-full">
        <div className="flex flex-col items-center gap-6 w-full">
          <div className="w-full flex gap-8 justify-center">
            {people.map((person) => {
              const { birthYear } = birthday(person);
              return (
                <PrintCard
                  title={`${person.name}'s Life Expectancy`}
                  subtitle={
                    <div className="font-semibold text-lg mt-[2px]">
                      {roundedToFixed(makeTable(person).e, 1)}{" "}
                      <span className="text-gray-500">
                        ({Math.round(makeTable(person).e) + birthYear})
                      </span>
                    </div>
                  }
                />
              );
              return (
                <div className="flex flex-col items-center justify-center bg-white px-6 py-3 rounded-lg screen:shadow-md border gap-1">
                  <div className="uppercase tracking-wide text-sm text-gray-800 w-full"></div>
                  <div className="font-semibold text-lg mt-[2px]">
                    {roundedToFixed(makeTable(person).e, 1)}{" "}
                    <span className="text-gray-500">
                      ({Math.round(makeTable(person).e) + birthYear})
                    </span>
                  </div>
                </div>
              );
            })}

            <PrintCard
              title="Joint Life Expectancy"
              subtitle={
                <div className="font-semibold text-lg mt-[2px]">
                  {roundedToFixed(
                    findFiftyPercentPoint(
                      makeTable(people[0]).e,
                      makeTable(people[1]).e,
                    ),
                    1,
                  )}{" "}
                  <span className="text-gray-500">({}0)</span>
                </div>
              }
            />
          </div>
          <LongevityChart people={people} />
        </div>
      </div>
    </div>
  );
};

export default Longevity;
