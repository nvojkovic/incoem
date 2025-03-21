import LongevityChart from "../Longevity/LongevityChart";
import {
  findAgeForProbability,
  findYearForProbability,
  jointTable,
  makeTable,
} from "../Longevity/calculate";
import Header from "./Header";
import { LongevityScenarioCard } from "../Longevity/LongevityPage";
import { birthday } from "src/calculator/utils";
import { PrintClient, ScenarioSettings } from "src/types";

const Longevity = ({
  client,
  scenario,
}: {
  client: PrintClient;
  scenario: ScenarioSettings;
}) => {
  const people = scenario.people;
  const longevityPercent =
    scenario.longevityPercent !== undefined ? scenario.longevityPercent : 50;
  return (
    <div className={`px-12 py-3  mx-auto`}>
      <Header client={client} scenario={scenario} />
      <div className="flex gap-3 items-center mb-4 w-full justify-center">
        <h1 className="text-2xl">Longevity</h1>
      </div>
      <div className="flex gap-8 justify-center w-full">
        <div className="flex flex-col items-center gap-6 w-full">
          <div className="w-full flex gap-8 justify-center">
            <div className="flex flex-col items-center gap-6 w-full">
              <div className="w-full flex gap-8 justify-center">
                {people.map((person) => {
                  const { year, age } = findAgeForProbability(
                    makeTable(person).table,
                    longevityPercent,
                  );
                  return (
                    <div className="flex flex-col items-center justify-center bg-white px-6 py-3 rounded-lg  screen:shadow-md print:bg-gray-100  border gap-1">
                      <div className="uppercase tracking-wide text-xs text-gray-800 w-full">
                        {person.name}'s {longevityPercent}% Life Expectancy
                      </div>
                      <div className="font-semibold text-[16px] mt-[2px] flex gap-1 items-center">
                        {age}{" "}
                        <span className="text-gray-500 text-[12px]">
                          ({year})
                        </span>
                      </div>
                    </div>
                  );
                })}

                {people.length > 1 ? (
                  <div className="flex flex-col items-center justify-center bg-white px-6 py-3 rounded-lg screen:shadow-md print:bg-gray-100 border gap-1">
                    <div className="uppercase tracking-wide text-xs text-gray-800 w-full">
                      Joint {longevityPercent}% Life Expectancy
                    </div>
                    <div className="font-semibold text-[16px] mt-[2px] flex gap-1 items-center">
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
                            <span className="text-gray-500 text-[12px]">
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
          </div>
          <LongevityChart people={people} />
          <div>
            <div className="flex gap-3 justify-center  w-full">
              <LongevityScenarioCard people={people} percent={50} />
              <LongevityScenarioCard people={people} percent={25} />
              <LongevityScenarioCard people={people} percent={10} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Longevity;
