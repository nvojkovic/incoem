import React from "react";
import { useContext } from "react";
import { updateData, updateScenarios } from "../services/client";
import { debounce, updateAtIndex } from "../utils";
import {
  Client,
  Income,
  Person,
  RetirementSpendingSettings,
  ScenarioSettings,
} from "../types";

const IncomeContext = React.createContext({
  data: {} as Client,
  addIncome: (_: Income) => { },
  removeIncome: (_: number) => { },
  setIncome: ((_: number, __: Income) => { }) as any,
  storeScenarios: (_: ScenarioSettings[]) => { },
  setPerson: (_: Person) => { },
  setField: (_: keyof Client) => (_: any) => { },
  setSpending: (_: RetirementSpendingSettings) => { },
  setLocal: (() => { }) as any,
});

const updateRemote = debounce(updateData, 500);

interface IncomeProviderProps {
  data: Client;
  setLocal: React.Dispatch<React.SetStateAction<Client>>;
  children: React.ReactNode;
}

export const IncomeProvider = ({
  data,
  setLocal,
  children,
}: IncomeProviderProps) => {
  const setData = (fn: (data: Client) => Client) => {
    console.log("setting data", data);
    setLocal((data) => {
      const result = fn(data);
      console.log("result", result);
      updateRemote(result.id, result);
      return result;
    });
  };

  const setField = (key: string) => (val: any) => {
    setData((data) => ({
      ...data,
      [key]: val,
    }));
  };

  const addIncome = (income: Income) => {
    setData((data) => ({
      ...data,
      incomes: [...data.incomes, income],
    }));
  };

  const removeIncome = (index: number) => {
    setData((data) => ({
      ...data,
      incomes: data.incomes.filter((_, i) => i !== index),
    }));
  };
  const setIncome = (index: number, income: Income) => {
    console.log("setting income", data);
    setData((data) => ({
      ...data,
      incomes: updateAtIndex(data.incomes, index, income),
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
      people: updateAtIndex(data.people, person.id, person),
    }));
  };

  const setSpending = (spending: RetirementSpendingSettings) => {
    setData((data) => ({
      ...data,
      spending,
    }));
  };

  const value = {
    data,
    addIncome,
    removeIncome,
    setIncome,
    storeScenarios,
    setPerson,
    setSpending,
    setField,
    setLocal,
  };

  return (
    <IncomeContext.Provider value={value}>{children}</IncomeContext.Provider>
  );
};

export const useInfo = () => useContext(IncomeContext);
