import "./App.css";
import Layout from "./components/Layout";
import IncomeSection from "./components/IncomeSection";
import { useState } from "react";
import PersonInfo from "./components/Info/PersonInfo";
import MapSection from "./components/MapSection";

function updateAtIndex<T>(arr: T[], index: number, update: T) {
  return arr.map((v, i) => (i === index ? update : v));
}
function App() {
  const [data, setData] = useState<IncomeMapData>({
    people: [
      {
        name: "John",
        birthYear: 1990,
        birthMonth: "January",
        id: 0,
      },
      {
        name: "Mary",
        birthYear: 1991,
        birthMonth: "January",
        id: 1,
      },
    ],
    incomes: [],
    version: 1,
  });

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
  return (
    <>
      <Layout>
        <div className="mt-6"></div>
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
            title="Company Pensions"
            subtitle="Basic info about employment income"
            incomes={data.incomes}
            people={data.people}
            type="company-pension"
            removeIncome={removeIncome}
            setIncome={setIncome}
            addIncome={addIncome}
          ></IncomeSection>
        </div>
      </Layout>
    </>
  );
}

export default App;
