import "./App.css";
import IncomeSection from "./components/IncomeSection";
import { useEffect, useState } from "react";
import PersonInfo from "./components/Info/PersonInfo";
import MapSection from "./components/MapSection";
import { useParams } from "react-router-dom";
import Summary from "./components/Summary";
import { updateAtIndex } from "./utils";

// const NavItem = ({
//   name,
//   active,
//   onClick,
// }: {
//   name: string;
//   active: boolean;
//   onClick: any;
// }) => {
//   return (
//     <div
//       className={`cursor-pointer py-2 px-3 font-semibold rounded-md ${active ? "bg-[#FF7957] text-white" : ""}`}
//       onClick={onClick}
//     >
//       {name}
//     </div>
//   );
// };
//
function Calculator() {
  const { id } = useParams();
  const [tab, setTab] = useState<"data" | "calculator">("data");
  useEffect(() => {
    const d = localStorage.getItem("clients");
    const data = d ? JSON.parse(d) : null;
    setData(data.find((c: any) => c.id == id));
    setTab("data");
  }, []);

  const store = (client: Client) => {
    const d = localStorage.getItem("clients");
    const data = d ? JSON.parse(d) : null;
    const newData = data.map((c: any) => (c.id == id ? client : c));
    localStorage.setItem("clients", JSON.stringify(newData));
  };
  const [data, setData] = useState<Client | null>(null);
  if (!data) return <div>Loading...</div>;

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
    <>
      <div>
        <div className="mt-6 max-w-[1280px] m-auto mb-32 px-10">
          {tab == "data" ? (
            <div className="flex flex-col gap-6">
              <MapSection title="Basic information" defaultOpen={true}>
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
                title="Employment income"
                subtitle="Basic info about employment income"
                incomes={data.data.incomes}
                people={data.data.people}
                type="employment-income"
                removeIncome={removeIncome}
                setIncome={setIncome}
                addIncome={addIncome}
              ></IncomeSection>
              <IncomeSection
                defaultOpen={true}
                title="Social Security"
                subtitle="Basic info about employment income"
                incomes={data.data.incomes}
                people={data.data.people}
                removeIncome={removeIncome}
                setIncome={setIncome}
                addIncome={addIncome}
                type="social-security"
              ></IncomeSection>
              <IncomeSection
                defaultOpen={true}
                title="Company Pensions"
                subtitle="Basic info about employment income"
                incomes={data.data.incomes}
                people={data.data.people}
                type="company-pension"
                removeIncome={removeIncome}
                setIncome={setIncome}
                addIncome={addIncome}
              ></IncomeSection>
              <IncomeSection
                defaultOpen={true}
                title="Basic Annuity"
                subtitle="Basic info about employment income"
                incomes={data.data.incomes}
                people={data.data.people}
                type="basic-annuity"
                removeIncome={removeIncome}
                setIncome={setIncome}
                addIncome={addIncome}
              ></IncomeSection>

              <IncomeSection
                defaultOpen={true}
                title="Other Income"
                subtitle="Basic info about employment income"
                incomes={data.data.incomes}
                people={data.data.people}
                type="other-income"
                removeIncome={removeIncome}
                setIncome={setIncome}
                addIncome={addIncome}
              ></IncomeSection>
              <IncomeSection
                defaultOpen={true}
                title="Paydown"
                subtitle="Basic info about employment income"
                incomes={data.data.incomes}
                people={data.data.people}
                type="paydown"
                removeIncome={removeIncome}
                setIncome={setIncome}
                addIncome={addIncome}
              ></IncomeSection>
            </div>
          ) : (
            <Summary
              data={data.data}
              store={(scenario: ScenarioSettings) =>
                store({ ...data, scenarios: [...data.scenarios, scenario] })
              }
              scenarios={data.scenarios}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Calculator;
