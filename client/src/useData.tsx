import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { updateData, updateScenarios } from "./services/client";
import { updateAtIndex } from "./utils";

const IncomeContext = React.createContext({
  data: {} as Client,
  addIncome: (_: Income) => {},
  removeIncome: (_: number) => {},
  updateIncomes: (_: Income[]) => {},
  setIncome: ((_: number, __: Income) => {}) as any,
  storeScenarios: (_: ScenarioSettings[]) => {},
  addScenario: (_: ScenarioSettings) => {},
  setPerson: (_: Person) => {},
});

const debounce = (callback: Function, wait: number) => {
  let timeoutId: any = null;
  return (...args: any[]) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, wait);
  };
};

const updateRemote = debounce(updateData, 1000);

interface IncomeProviderProps {
  initialData: Client;
  children: React.ReactNode;
}
export const IncomeProvider = ({
  initialData,
  children,
}: IncomeProviderProps) => {
  const [data, setLocal] = useState<Client>(initialData);

  console.log("current data", data.data);
  useEffect(() => {
    console.log("resetting");
    setLocal(initialData);
  }, [initialData]);
  const setData = (fn: (data: Client) => Client) => {
    console.log("setting data", data.data.incomes);
    setLocal((data) => {
      const result = fn(data);
      updateRemote(result.id, result.data);
      return result;
    });
  };
  const updateIncomes = (incomes: Income[]) => {
    setData((data) => ({
      ...data,
      data: {
        ...data.data,
        incomes,
      },
    }));
  };

  const addIncome = (income: Income) => {
    console.log("addIncome", income, "old", data.data.incomes);
    setData((data) => ({
      ...data,
      data: {
        ...data.data,
        incomes: [...data.data.incomes, income],
      },
    }));
  };

  const removeIncome = (index: number) => {
    setData((data) => ({
      ...data,
      data: {
        ...data.data,
        incomes: data.data.incomes.filter((_, i) => i !== index),
      },
    }));
  };
  const setIncome = (index: number, income: Income) => {
    console.log("setting income", data);
    setData((data) => ({
      ...data,
      data: {
        ...data.data,
        incomes: updateAtIndex(data.data.incomes, index, income),
      },
    }));
  };
  const storeScenarios = (scenarios: ScenarioSettings[]) => {
    setData((data) => {
      const client = {
        ...data,
        scenarios,
      };
      updateScenarios(client.id, scenarios);
      return client;
    });
  };

  const setPerson = (person: Person) => {
    setData((data) => ({
      ...data,
      data: {
        ...data.data,
        people: updateAtIndex(data.data.people, person.id, person),
      },
    }));
  };

  const addScenario = (scenario: ScenarioSettings) => {
    storeScenarios([...data.scenarios, scenario]);
  };

  const value = {
    data,
    addIncome,
    removeIncome,
    setIncome,
    updateIncomes,
    storeScenarios,
    addScenario,
    setPerson,
  };

  return (
    <IncomeContext.Provider value={value}>{children}</IncomeContext.Provider>
  );
};

export const useInfo = () => useContext(IncomeContext);
