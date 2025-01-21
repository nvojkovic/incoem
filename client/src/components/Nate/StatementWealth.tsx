import { useState } from "react";
import Container from "./Container";
import MapSection from "../MapSection";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Input from "../Inputs/Input";
import Confirm from "../Confirm";
import Button from "../Inputs/Button";
import { useInfo } from "src/useData";
import Select from "../Inputs/Select";
import { StatementWealth } from "./types";
import { printNumber } from "src/utils";

const StatementWealthPage = () => {
  const { data, setField } = useInfo();

  const options = [...data.people] as any[];
  if (data.people.length == 2) {
    options.push({ name: "Joint", id: -1 });
  }

  const setIncome = (
    index: number,
    field: keyof StatementWealth,
    value: StatementWealth[typeof field],
  ) => {
    setField("assetSummary")({
      ...data.assetSummary,
      statementWealth: data.assetSummary.statementWealth.map((item, i) =>
        index === i ? { ...item, [field]: value } : item,
      ),
    });
  };

  const [preDeleteIncomeOpen, setPreDeleteIncomeOpen] = useState(-1);
  return (
    <Container active="statement-wealth">
      <MapSection
        title={
          <div className="flex gap-6 items-center w-full p-2">
            <div> Qualified </div>
            <div className="w-32">
              <Button
                type="primary"
                className="!py-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setField("assetSummary")({
                    ...data.assetSummary,
                    statementWealth: [
                      ...data.assetSummary.statementWealth,
                      { id: crypto.randomUUID(), qualified: true },
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
              <th className="px-6 py-3 font-medium">Company</th>
              <th className="px-6 py-3 font-medium">Account #</th>
              <th className="px-6 py-3 font-medium">Owner</th>
              <th className="px-6 py-3 font-medium">Type</th>
              <th className="px-6 py-3 font-medium">Managed</th>
              <th className="px-6 py-3 font-medium">Annual Contribution</th>
              <th className="px-6 py-3 font-medium">Market Value</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.assetSummary.statementWealth.map((line, index) =>
              line.qualified ? (
                <tr className="">
                  <td className="px-2 py-2 ">
                    <Input
                      vertical
                      value={line.company}
                      setValue={(v) => setIncome(index, "company", v)}
                      size="full"
                      subtype="text"
                      label={``}
                    />
                  </td>
                  <td className="px-2 py-2">
                    <Input
                      vertical
                      value={line.accountNumber}
                      setValue={(v) => setIncome(index, "accountNumber", v)}
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
                    <Select
                      options={(line.qualified
                        ? [
                          "401(k)",
                          "Roth 401(k)",
                          "IRA",
                          "Rollover IRA",
                          "Roth IRA",
                          "457(b)",
                        ]
                        : ["Tax-Free", "Taxable", "Tax-Deferred"]
                      ).map((name) => ({ name, id: name }))}
                      selected={{
                        name: line.type,
                        id: line.type,
                      }}
                      setSelected={(i) => setIncome(index, "type", i.id)}
                      label=""
                    />
                  </td>
                  <td className="px-2 py-2">
                    <div className="w-12 mx-auto">
                      <Input
                        label=""
                        vertical
                        size="full"
                        value={line.managed}
                        setValue={(v) => setIncome(index, "managed", v)}
                        subtype="toggle"
                      />
                    </div>
                  </td>
                  <td className="px-2 py-2">
                    <Input
                      label=""
                      vertical
                      size="full"
                      value={line.annualContribution}
                      setValue={(v) =>
                        setIncome(index, "annualContribution", v)
                      }
                      subtype="money"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <Input
                      label=""
                      vertical
                      size="full"
                      value={line.marketValue}
                      setValue={(v) => setIncome(index, "marketValue", v)}
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
                            statementWealth:
                              data.assetSummary.statementWealth.filter(
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
              ) : null,
            )}
            {!!data.assetSummary.statementWealth.filter((i) => i.qualified)
              .length && (
                <tr>
                  <td className="px-2 py-3 font-medium"></td>
                  <td className="px-2 py-3 font-medium"></td>
                  <td className="px-2 py-3 font-medium"></td>
                  <td className="px-2 py-3 font-medium"></td>
                  <td className="px-2 py-3 font-medium">Total:</td>
                  <td className="px-2 py-3 font-medium text-center">
                    {printNumber(
                      data.assetSummary.statementWealth
                        .filter((i) => i.qualified)
                        .map((i) => i.annualContribution || 0)
                        .reduce((a, b) => a + b, 0),
                    )}
                  </td>
                  <td className="px-2 py-3 font-medium text-center">
                    {printNumber(
                      data.assetSummary.statementWealth
                        .filter((i) => i.qualified)
                        .map((i) => i.marketValue || 0)
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
            <div> Non-Qualified </div>
            <div className="w-32">
              <Button
                type="primary"
                className="!py-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setField("assetSummary")({
                    ...data.assetSummary,
                    statementWealth: [
                      ...data.assetSummary.statementWealth,
                      { id: crypto.randomUUID(), qualified: false },
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
              <th className="px-6 py-3 font-medium">Company</th>
              <th className="px-6 py-3 font-medium">Account #</th>
              <th className="px-6 py-3 font-medium">Owner</th>
              <th className="px-6 py-3 font-medium">Type</th>
              <th className="px-6 py-3 font-medium">Managed</th>
              <th className="px-6 py-3 font-medium">Annual Contribution</th>
              <th className="px-6 py-3 font-medium">Market Value</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.assetSummary.statementWealth.map((line, index) =>
              !line.qualified ? (
                <tr className="">
                  <td className="px-2 py-2 ">
                    <Input
                      vertical
                      value={line.company}
                      setValue={(v) => setIncome(index, "company", v)}
                      size="full"
                      subtype="text"
                      label={``}
                    />
                  </td>
                  <td className="px-2 py-2">
                    <Input
                      vertical
                      value={line.accountNumber}
                      setValue={(v) => setIncome(index, "accountNumber", v)}
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
                    <Select
                      options={(line.qualified
                        ? [
                          "401(k)",
                          "Roth 401(k)",
                          "IRA",
                          "Rollover IRA",
                          "Roth IRA",
                          "457(b)",
                        ]
                        : ["Tax-Free", "Taxable", "Tax-Deferred"]
                      ).map((name) => ({ name, id: name }))}
                      selected={{
                        name: line.type,
                        id: line.type,
                      }}
                      setSelected={(i) => setIncome(index, "type", i.id)}
                      label=""
                    />
                  </td>
                  <td className="px-2 py-2">
                    <div className="w-12 mx-auto">
                      <Input
                        label=""
                        vertical
                        size="full"
                        value={line.managed}
                        setValue={(v) => setIncome(index, "managed", v)}
                        subtype="toggle"
                      />
                    </div>
                  </td>
                  <td className="px-2 py-2">
                    <Input
                      label=""
                      vertical
                      size="full"
                      value={line.annualContribution}
                      setValue={(v) =>
                        setIncome(index, "annualContribution", v)
                      }
                      subtype="money"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <Input
                      label=""
                      vertical
                      size="full"
                      value={line.marketValue}
                      setValue={(v) => setIncome(index, "marketValue", v)}
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
                            statementWealth:
                              data.assetSummary.statementWealth.filter(
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
              ) : null,
            )}
            {!!data.assetSummary.statementWealth.filter((i) => !i.qualified)
              .length && (
                <tr>
                  <td className="px-2 py-3 font-medium"></td>
                  <td className="px-2 py-3 font-medium"></td>
                  <td className="px-2 py-3 font-medium"></td>
                  <td className="px-2 py-3 font-medium"></td>
                  <td className="px-2 py-3 font-medium">Total:</td>
                  <td className="px-2 py-3 font-medium text-center">
                    {printNumber(
                      data.assetSummary.statementWealth
                        .filter((i) => !i.qualified)
                        .map((i) => i.annualContribution || 0)
                        .reduce((a, b) => a + b, 0),
                    )}
                  </td>
                  <td className="px-2 py-3 font-medium text-center">
                    {printNumber(
                      data.assetSummary.statementWealth
                        .filter((i) => !i.qualified)
                        .map((i) => i.marketValue || 0)
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

export default StatementWealthPage;
