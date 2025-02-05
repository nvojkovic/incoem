import { useState } from "react";
import Container from "./Container";
import MapSection from "../MapSection";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Input from "../Inputs/Input";
import Confirm from "../Confirm";
import Button from "../Inputs/Button";
import { useInfo } from "src/hooks/useData";
import Select from "../Inputs/Select";
import { CashAsset, Income } from "./types";
import { printNumber } from "src/utils";

const IncomeCash = () => {
  const { data, setField } = useInfo();

  const options = [...data.people] as any[];
  if (data.people.length == 2) {
    options.push({ name: "Joint", id: -1 });
  }

  const setIncome = (
    index: number,
    field: keyof Income,
    value: Income[typeof field],
  ) => {
    setField("assetSummary")({
      ...data.assetSummary,
      income: data.assetSummary.income.map((item, i) =>
        index === i ? { ...item, [field]: value } : item,
      ),
    });
  };

  const setCash = (
    index: number,
    field: keyof CashAsset,
    value: CashAsset[typeof field],
  ) => {
    setField("assetSummary")({
      ...data.assetSummary,
      cashAssets: data.assetSummary.cashAssets.map((item, i) =>
        index === i ? { ...item, [field]: value } : item,
      ),
    });
  };

  const [preDeleteIncomeOpen, setPreDeleteIncomeOpen] = useState(-1);
  const [preDeleteCashOpen, setPreDeleteCashOpen] = useState(-1);
  return (
    <Container active="incomecash">
      <MapSection
        toggleabble
        title={
          <div className="flex gap-6 items-center w-full p-2">
            <div> Income </div>
            <div className="w-32">
              <Button
                type="primary"
                className="!py-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setField("assetSummary")({
                    ...data.assetSummary,
                    income: [
                      ...data.assetSummary.income,
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
            className={`text-sm cursor-pointer text-left sticky z-50 border-1 !font-normal`}
          >
            <tr>
              <th className="px-6 py-3 font-medium">Employer</th>
              <th className="px-6 py-3 font-medium">Client</th>
              <th className="px-6 py-3 font-medium">Position</th>
              <th className="px-6 py-3 font-medium">Annual Income</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.assetSummary.income.map((line, index) => (
              <tr className="">
                <td className="px-2 py-2 w-[500px]">
                  <Input
                    vertical
                    value={line.employer}
                    setValue={(v) => setIncome(index, "employer", v)}
                    size="full"
                    subtype="text"
                    label={``}
                  />
                </td>
                <td className="px-2 py-2">
                  <Select
                    options={options}
                    selected={
                      line.owner == -1
                        ? { name: "Joint", id: -1 }
                        : data.people[line.owner]
                    }
                    setSelected={(i) => setIncome(index, "owner", i.id)}
                    label=""
                  />
                </td>
                <td className="px-2 py-2">
                  <Input
                    label=""
                    vertical
                    size="full"
                    value={line.position}
                    setValue={(v) => setIncome(index, "position", v)}
                    subtype="text"
                  />
                </td>
                <td className="px-2 py-2">
                  <Input
                    label=""
                    vertical
                    size="full"
                    value={line.annualAmount}
                    setValue={(v) => setIncome(index, "annualAmount", v)}
                    subtype="money"
                  />
                </td>
                <td className="px-2 py-2">
                  <div className="flex gap-3">
                    <Confirm
                      isOpen={preDeleteIncomeOpen === index}
                      onClose={() => setPreDeleteIncomeOpen(-1)}
                      onConfirm={() => {
                        setPreDeleteIncomeOpen(-1);
                        setField("assetSummary")({
                          ...data.assetSummary,
                          income: data.assetSummary.income.filter(
                            (_, ind) => ind !== index,
                          ),
                        });
                      }}
                    >
                      <TrashIcon className="text-slate-400 w-10 m-auto mb-5" />
                      <div className="mb-5">
                        Are you sure you want to delete this income?
                      </div>
                    </Confirm>
                    <Button
                      type="secondary"
                      onClick={() => {
                        return setPreDeleteIncomeOpen(index);
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
          </tbody>
        </table>

        <div className=" text-right pt-3 pr-2 flex gap-2 justify-end">
          Total:{" "}
          <div className="font-semibold">
            {printNumber(
              data.assetSummary.income
                .map((i) => i.annualAmount)
                .filter((i) => i)
                .reduce((a, b) => a + b, 0),
            )}
          </div>
        </div>
      </MapSection>
      <div className="h-8"></div>

      <MapSection
        toggleabble
        title={
          <div className="flex gap-6 items-center w-full p-2">
            <div> Cash </div>
            <div className="w-32">
              <Button
                type="primary"
                className="!py-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setField("assetSummary")({
                    ...data.assetSummary,
                    cashAssets: [
                      ...data.assetSummary.cashAssets,
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
            className={`text-sm cursor-pointer text-left sticky z-50 border-1 !font-normal`}
          >
            <tr>
              <th className="px-6 py-3 font-medium">Bank</th>
              <th className="px-6 py-3 font-medium">Acct/Cert #</th>
              <th className="px-6 py-3 font-medium">Owner</th>
              <th className="px-6 py-3 font-medium">Type</th>
              <th className="px-6 py-3 font-medium">Interest Rate</th>
              <th className="px-6 py-3 font-medium">Balance</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.assetSummary.cashAssets.map((line, index) => (
              <tr className="">
                <td className="px-2 py-2 w-[500px]">
                  <Input
                    vertical
                    value={line.bank}
                    setValue={(v) => setCash(index, "bank", v)}
                    size="full"
                    subtype="text"
                    label={``}
                  />
                </td>
                <td className="px-2 py-2 w-[500px]">
                  <Input
                    vertical
                    value={line.accountNumber}
                    setValue={(v) => setCash(index, "accountNumber", v)}
                    size="full"
                    subtype="text"
                    label={``}
                  />
                </td>
                <td className="px-2 py-2">
                  <Select
                    options={options}
                    selected={
                      line.owner == -1
                        ? { name: "Joint", id: -1 }
                        : data.people[line.owner]
                    }
                    setSelected={(i) => setCash(index, "owner", i.id)}
                    label=""
                  />
                </td>{" "}
                <td className="px-2 py-2">
                  <Select
                    options={[
                      "Checking",
                      "Savings",
                      "Money Market",
                      "CD",
                      "Other",
                    ].map((name) => ({ name, id: name }))}
                    selected={{
                      name: line.type,
                      id: line.type,
                    }}
                    setSelected={(i) => setCash(index, "type", i.id)}
                    label=""
                  />
                </td>
                <td className="px-2 py-2 w-[500px]">
                  <Input
                    vertical
                    value={line.interestRate}
                    setValue={(v) => setCash(index, "interestRate", v)}
                    size="full"
                    subtype="percent"
                    label={``}
                  />
                </td>
                <td className="px-2 py-2 w-[500px]">
                  <Input
                    vertical
                    value={line.balance}
                    setValue={(v) => setCash(index, "balance", v)}
                    size="full"
                    subtype="money"
                    label={``}
                  />
                </td>
                <td className="px-2 py-2">
                  <div className="flex gap-3">
                    <Confirm
                      isOpen={preDeleteCashOpen === index}
                      onClose={() => setPreDeleteCashOpen(-1)}
                      onConfirm={() => {
                        setPreDeleteCashOpen(-1);
                        setField("assetSummary")({
                          ...data.assetSummary,
                          cashAssets: data.assetSummary.cashAssets.filter(
                            (_, ind) => ind !== index,
                          ),
                        });
                      }}
                    >
                      <TrashIcon className="text-slate-400 w-10 m-auto mb-5" />
                      <div className="mb-5">
                        Are you sure you want to delete this cash asset?
                      </div>
                    </Confirm>
                    <Button
                      type="secondary"
                      onClick={() => {
                        return setPreDeleteCashOpen(index);
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
          </tbody>
        </table>
        <div className=" text-right pt-3 pr-2 flex gap-2 justify-end">
          Total:{" "}
          <div className="font-semibold">
            {printNumber(
              data.assetSummary.cashAssets
                .map((i) => i.balance)
                .filter((i) => i)
                .reduce((a, b) => a + b, 0),
            )}
          </div>
        </div>
      </MapSection>
    </Container>
  );
};

export default IncomeCash;
