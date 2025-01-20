import { useState } from "react";
import Container from "./Container";
import MapSection from "../MapSection";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Input from "../Inputs/Input";
import Confirm from "../Confirm";
import Button from "../Inputs/Button";
import { useInfo } from "src/useData";
import Select from "../Inputs/Select";
import { Debt, Inheritance } from "./types";
import { printNumber } from "src/utils";

const DebtInheritance = () => {
  const { data, setField } = useInfo();

  const options = [...data.data.people] as any[];
  if (data.data.people.length == 2) {
    options.push({ name: "Joint", id: -1 });
  }

  const setDebt = (
    index: number,
    field: keyof Debt,
    value: Debt[typeof field],
  ) => {
    setField("nateClient")({
      ...data.nateClient,
      debts: data.nateClient.debts.map((item, i) =>
        index === i ? { ...item, [field]: value } : item,
      ),
    });
  };

  const setInheritance = (
    index: number,
    field: keyof Inheritance,
    value: Inheritance[typeof field],
  ) => {
    setField("nateClient")({
      ...data.nateClient,
      inheritance: data.nateClient.inheritance.map((item, i) =>
        index === i ? { ...item, [field]: value } : item,
      ),
    });
  };

  const [preDeleteDebtOpen, setPreDeleteDebtOpen] = useState(-1);
  const [preDeleteInheritOpen, setPreDeleteInheritOpen] = useState(-1);
  return (
    <Container active="debt-inheritance">
      <MapSection
        title={
          <div className="flex gap-6 items-center w-full p-2">
            <div> Debt </div>
            <div className="w-32">
              <Button
                type="primary"
                className="!py-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setField("nateClient")({
                    ...data.nateClient,
                    debts: [
                      ...data.nateClient.debts,
                      { id: crypto.randomUUID() },
                    ],
                  });
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <PlusIcon className="h-4" />
                  Add
                </div>
              </Button>
            </div>
          </div>
        }
        defaultOpen
      >
        <table className="w-full">
          <thead
            className={`text-xs cursor-pointer text-left sticky z-50 border-1 !font-normal`}
          >
            <tr>
              <th className="px-6 py-3 font-medium">Lender</th>
              <th className="px-6 py-3 font-medium">Asset</th>
              <th className="px-6 py-3 font-medium">Type</th>
              <th className="px-6 py-3 font-medium">Account #</th>
              <th className="px-6 py-3 font-medium">Interest Rate</th>
              <th className="px-6 py-3 font-medium">Monthly Payment</th>
              <th className="px-6 py-3 font-medium">Balance</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.nateClient.debts.map((line, index) => (
              <tr className="">
                <td className="px-2 py-2 ">
                  <Input
                    vertical
                    value={line.lender}
                    setValue={(v) => setDebt(index, "lender", v)}
                    size="full"
                    subtype="text"
                    label={``}
                  />
                </td>
                <td className="px-2 py-2">
                  <Select
                    options={data.nateClient.hardAssets.map((item) => ({
                      name: item.name,
                      id: item.id,
                    }))}
                    selected={{
                      name: data.nateClient.hardAssets.find(
                        (i) => i.id === line.asset,
                      )?.name,
                      id: line.asset,
                    }}
                    setSelected={(i) => setDebt(index, "asset", i.id)}
                    label=""
                  />
                </td>
                <td className="px-2 py-2">
                  <Select
                    options={[
                      "Mortgage",
                      "Credit Card",
                      "Auto Loan",
                      "HELOC",
                    ].map((name) => ({ name, id: name }))}
                    selected={{
                      name: line.type,
                      id: line.type,
                    }}
                    setSelected={(i) => setDebt(index, "type", i.id)}
                    label=""
                  />
                </td>

                <td className="px-2 py-2">
                  <Input
                    label=""
                    vertical
                    size="full"
                    value={line.accountNumber}
                    setValue={(v) => setDebt(index, "accountNumber", v)}
                    subtype="text"
                  />
                </td>
                <td className="px-2 py-2">
                  <Input
                    label=""
                    vertical
                    size="full"
                    value={line.interestRate}
                    setValue={(v) => setDebt(index, "interestRate", v)}
                    subtype="percent"
                  />
                </td>
                <td className="px-2 py-2">
                  <Input
                    label=""
                    vertical
                    size="full"
                    value={line.monthlyPayment}
                    setValue={(v) => setDebt(index, "monthlyPayment", v)}
                    subtype="money"
                  />
                </td>
                <td className="px-2 py-2">
                  <Input
                    label=""
                    vertical
                    size="full"
                    value={line.balance}
                    setValue={(v) => setDebt(index, "balance", v)}
                    subtype="money"
                  />
                </td>
                <td className="px-2 py-2">
                  <div className="flex gap-3">
                    <Confirm
                      isOpen={preDeleteDebtOpen === index}
                      onClose={() => setPreDeleteDebtOpen(-1)}
                      onConfirm={() => {
                        setPreDeleteDebtOpen(-1);
                        setField("nateClient")({
                          ...data.nateClient,
                          debts: data.nateClient.debts.filter(
                            (_, ind) => ind !== index,
                          ),
                        });
                      }}
                    >
                      <TrashIcon className="text-slate-400 w-10 m-auto mb-5" />
                      <div className="mb-5">
                        Are you sure you want to delete this debt?
                      </div>
                    </Confirm>
                    <Button
                      type="secondary"
                      onClick={() => {
                        return setPreDeleteDebtOpen(index);
                      }}
                    >
                      <div className="flex justify-center">
                        <TrashIcon className="h-5 text-red-500" />
                      </div>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {!!data.nateClient.debts.length && (
              <tr>
                <td className="px-2 py-3 font-medium"></td>
                <td className="px-2 py-3 font-medium"></td>
                <td className="px-2 py-3 font-medium"></td>
                <td className="px-2 py-3 font-medium"></td>
                <td className="px-2 py-3 font-medium">Total:</td>
                <td className="px-2 py-3 font-medium text-center">
                  {printNumber(
                    data.nateClient.debts
                      .map((i) => i.monthlyPayment || 0)
                      .reduce((a, b) => a + b, 0),
                  )}
                </td>
                <td className="px-2 py-3 font-medium text-center">
                  {printNumber(
                    data.nateClient.debts
                      .map((i) => i.balance || 0)
                      .reduce((a, b) => a + b, 0),
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </MapSection>

      <div className="h-8"></div>
      <MapSection
        title={
          <div className="flex gap-6 items-center w-full p-2">
            <div> Potential Inheritance </div>
            <div className="w-32">
              <Button
                type="primary"
                className="!py-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setField("nateClient")({
                    ...data.nateClient,
                    inheritance: [
                      ...data.nateClient?.inheritance,
                      { id: crypto.randomUUID() },
                    ],
                  });
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <PlusIcon className="h-4" />
                  Add
                </div>
              </Button>
            </div>
          </div>
        }
        defaultOpen
      >
        <table className="w-full">
          <thead
            className={`text-xs cursor-pointer text-left sticky z-50 border-1 !font-normal`}
          >
            <tr>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Type</th>
              <th className="px-6 py-3 font-medium">Amount</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.nateClient.inheritance?.map((line, index) => (
              <tr className="">
                <td className="px-2 py-2 ">
                  <Input
                    vertical
                    value={line.name}
                    setValue={(v) => setInheritance(index, "name", v)}
                    size="full"
                    subtype="text"
                    label={``}
                  />
                </td>

                <td className="px-2 py-2 w-32">
                  <div className="">
                    <Select
                      options={[
                        "Cash",
                        "Contractual Wealth",
                        "Statement Wealth",
                        "Hard Assets",
                      ].map((name) => ({ name, id: name }))}
                      selected={{
                        name: line.type,
                        id: line.type,
                      }}
                      setSelected={(i) => setInheritance(index, "type", i.id)}
                      label=""
                    />
                  </div>
                </td>
                <td className="px-2 py-2 ">
                  <Input
                    vertical
                    value={line.amount}
                    setValue={(v) => setInheritance(index, "amount", v)}
                    size="full"
                    subtype="money"
                    label={``}
                  />
                </td>

                <td className="px-2 py-2">
                  <div className="flex gap-3">
                    <Confirm
                      isOpen={preDeleteInheritOpen === index}
                      onClose={() => setPreDeleteInheritOpen(-1)}
                      onConfirm={() => {
                        setPreDeleteInheritOpen(-1);
                        setField("nateClient")({
                          ...data.nateClient,
                          inheritance: data.nateClient.inheritance.filter(
                            (_, ind) => ind !== index,
                          ),
                        });
                      }}
                    >
                      <TrashIcon className="text-slate-400 w-10 m-auto mb-5" />
                      <div className="mb-5">
                        Are you sure you want to delete this inheritance?
                      </div>
                    </Confirm>
                    <Button
                      type="secondary"
                      onClick={() => {
                        return setPreDeleteInheritOpen(index);
                      }}
                    >
                      <div className="flex justify-center">
                        <TrashIcon className="h-5 text-red-500" />
                      </div>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {!!data.nateClient.inheritance.length && (
              <tr>
                <td className="px-2 py-3 font-medium"></td>
                <td className="px-2 py-3 font-medium">Total:</td>
                <td className="px-2 py-3 font-medium text-center">
                  {printNumber(
                    data.nateClient.inheritance
                      .map((i) => i.amount || 0)
                      .reduce((a, b) => a + b, 0),
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </MapSection>
    </Container>
  );
};

export default DebtInheritance;
