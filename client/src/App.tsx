import "./App.css";
import IncomeSection from "./components/IncomeSection";
import { useState } from "react";
import PersonInfo from "./components/Info/PersonInfo";
import MapSection from "./components/MapSection";
import logo from "./assets/logo.png";
import Input from "./components/Inputs/Input";
import calculate from "./calculator/calculate";
import WhoDies from "./components/WhoDies";
import title from "./calculator/title";
import { UserIcon } from "@heroicons/react/24/outline";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

function updateAtIndex<T>(arr: T[], index: number, update: T) {
  return arr.map((v, i) => (i === index ? update : v));
}

const NavItem = ({
  name,
  active,
  onClick,
}: {
  name: string;
  active: boolean;
  onClick: any;
}) => {
  return (
    <div
      className={`cursor-pointer py-2 px-3 font-semibold rounded-md ${active ? "bg-[#FF7957] text-white" : ""}`}
      onClick={onClick}
    >
      {name}
    </div>
  );
};

const yearRange: (start: number, end: number) => number[] = (start, end) => {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

function App() {
  const [data, setData] = useState<IncomeMapData>({
    people: [
      {
        name: "John",
        birthYear: 1960,
        birthMonth: "January",
        id: 0,
      },
      {
        name: "Mary",
        birthYear: 1960,
        birthMonth: "January",
        id: 1,
      },
    ],
    incomes: [],
    version: 1,
  });

  const [maxYearsShown, setMaxYearsShown] = useState(20);
  const [deathYears, setDeathYear] = useState<any[]>([null, null]);
  const [inflation, setInflation] = useState(0);
  const [whoDies, setWhoDies] = useState<number>(-1);

  const removeIncome = (index: number) => {
    setData({
      ...data,
      incomes: data.incomes.filter((_, i) => i !== index),
    });
  };
  const setIncome = (index: number, income: Income) => {
    setData({
      ...data,
      incomes: updateAtIndex(data.incomes, index, income),
    });
  };
  const addIncome = (income: Income) => {
    setData({
      ...data,
      incomes: [...data.incomes, income],
    });
  };

  const startYear = new Date().getFullYear();

  const [tab, setTab] = useState<"data" | "calculator">("data");
  return (
    <>
      <div>
        <div className="border-b border-[#EAECF0]">
          <div className="max-w-[1280px] px-10 m-auto flex justify-between items-center">
            <div className=" flex justify-between items-center h-[72px] bg-[#ffffff]">
              <div className="flex items-center">
                <img src={logo} className="w-9 h-9 mr-2" />
                <div className="font-bold text-[20px] leading-5">
                  Income Mapper
                </div>
                <div className="ml-3 flex gap-0">
                  <NavItem
                    name="Home"
                    active={tab == "data"}
                    onClick={() => setTab("data")}
                  />
                  <NavItem
                    name="Income Map"
                    active={tab == "calculator"}
                    onClick={() => setTab("calculator")}
                  />
                </div>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#F2F4F7] flex items-center justify-center cursor-pointer">
              <UserIcon className="h-6 text-[#667085]" />
            </div>
          </div>
        </div>
        <div className="mt-6 max-w-[1280px] m-auto mb-32 px-10">
          {tab == "data" ? (
            <div className="flex flex-col gap-6">
              <MapSection title="Basic information" defaultOpen={true}>
                <div className="flex gap-6">
                  {data.people.map((person, i) => (
                    <PersonInfo
                      title={`Person ${i + 1}`}
                      key={i}
                      subtitle="Details about how this works"
                      person={person}
                      setPerson={(person) =>
                        setData({
                          ...data,
                          people: updateAtIndex(data.people, i, person),
                        })
                      }
                    />
                  ))}
                </div>
              </MapSection>
              <IncomeSection
                defaultOpen={true}
                title="Employment income"
                subtitle="Basic info about employment income"
                incomes={data.incomes}
                people={data.people}
                type="employment-income"
                removeIncome={removeIncome}
                setIncome={setIncome}
                addIncome={addIncome}
              ></IncomeSection>
              <IncomeSection
                defaultOpen={true}
                title="Social Security"
                subtitle="Basic info about employment income"
                incomes={data.incomes}
                people={data.people}
                removeIncome={removeIncome}
                setIncome={setIncome}
                addIncome={addIncome}
                type="social-security"
              ></IncomeSection>
              <IncomeSection
                defaultOpen={true}
                title="Company Pensions"
                subtitle="Basic info about employment income"
                incomes={data.incomes}
                people={data.people}
                type="company-pension"
                removeIncome={removeIncome}
                setIncome={setIncome}
                addIncome={addIncome}
              ></IncomeSection>
              <IncomeSection
                defaultOpen={true}
                title="Basic Annuity"
                subtitle="Basic info about employment income"
                incomes={data.incomes}
                people={data.people}
                type="basic-annuity"
                removeIncome={removeIncome}
                setIncome={setIncome}
                addIncome={addIncome}
              ></IncomeSection>

              <IncomeSection
                defaultOpen={true}
                title="Other Income"
                subtitle="Basic info about employment income"
                incomes={data.incomes}
                people={data.people}
                type="other-income"
                removeIncome={removeIncome}
                setIncome={setIncome}
                addIncome={addIncome}
              ></IncomeSection>
              <IncomeSection
                defaultOpen={true}
                title="Paydown"
                subtitle="Basic info about employment income"
                incomes={data.incomes}
                people={data.people}
                type="paydown"
                removeIncome={removeIncome}
                setIncome={setIncome}
                addIncome={addIncome}
              ></IncomeSection>
            </div>
          ) : (
            <div>
              <div className="flex justify-between mb-5 items-center">
                <div className="flex gap-3 border border-1 rounded-md h-10 items-center">
                  <div className={`flex items-center`}>
                    <WhoDies
                      active={whoDies == -1}
                      setWhoDies={setWhoDies}
                      i={-1}
                      title="Both live"
                    />
                    {data.people.map((person, i) => (
                      <WhoDies
                        active={whoDies == i}
                        setWhoDies={setWhoDies}
                        i={i}
                        title={`${person.name} dies`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-5">
                  <Input
                    label="Max years shown"
                    subtype="number"
                    value={maxYearsShown?.toString()}
                    setValue={(e) => setMaxYearsShown(parseInt(e))}
                  />
                  {data.people.map(
                    (person, i) =>
                      i == whoDies && (
                        <Input
                          subtype="number"
                          label={`${person.name}'s death`}
                          value={deathYears[i]?.toString()}
                          setValue={(e) =>
                            setDeathYear(
                              updateAtIndex(deathYears, i, parseInt(e)),
                            )
                          }
                        />
                      ),
                  )}
                  <Input
                    label="Inflation"
                    subtype="percent"
                    value={inflation?.toString()}
                    setValue={(e) => setInflation(e)}
                  />
                </div>
              </div>
              <div>
                <table className="rounded-xl w-full">
                  <thead className="text-xs bg-[#F9FAFB] text-[#475467] font-medium text-left">
                    <th className="px-6 py-3">Year</th>
                    <th className="px-6 py-3">Age</th>
                    {data.incomes.map((_, i) => (
                      <th className="px-6 py-3">
                        {title(data.incomes, data.people, i)}
                      </th>
                    ))}
                    <th className="px-6 py-3">Total</th>
                  </thead>
                  <tbody className="text-sm">
                    {yearRange(startYear, startYear + maxYearsShown).map(
                      (currentYear, i) => (
                        <tr
                          className={`${i % 2 == 1 ? "bg-[#F9FAFB]" : "bg-white"} border border-[#EAECF0]`}
                        >
                          <td className="font-medium px-6 py-4">
                            {currentYear}
                          </td>
                          <td className="font-medium px-6 py-4">
                            {data.people
                              .map((p) => currentYear - p.birthYear)
                              .join("/")}
                          </td>
                          {data.incomes.map((income) => (
                            <td className="px-6 py-4 text-[#475467]">
                              {print(
                                calculate({
                                  people: data.people,
                                  income,
                                  startYear,
                                  currentYear,
                                  deathYears,
                                  dead: whoDies,
                                  inflation,
                                }),
                              )}
                            </td>
                          ))}
                          <td className="font-normal px-6 py-4 text-[#475467]">
                            {formatter.format(
                              data?.incomes
                                .map(
                                  (income) =>
                                    calculate({
                                      people: data.people,
                                      income,
                                      startYear,
                                      currentYear,
                                      deathYears,
                                      dead: whoDies,
                                      inflation,
                                    }) as any,
                                )
                                .filter((t) => typeof t === "number")
                                .reduce((a, b) => a + b, 0)
                                .toFixed(0),
                            )}
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const print = (a: number | string) => {
  if (typeof a === "number") {
    return `${formatter.format(a)}`;
  }
  return a;
};

export default App;
