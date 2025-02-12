import { useState } from "react";
import Container from "./Container";
import MapSection from "../MapSection";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Input from "../Inputs/Input";
import Confirm from "../Confirm";
import Button from "../Inputs/Button";
import { useInfo } from "src/hooks/useData";
import Select from "../Inputs/Select";
import {
  AccumulationAnnuity,
  LifeInsurance,
  LongTermCare,
  Pension,
  PersonalPensionAnnuity,
} from "./types";
import { printNumber } from "src/utils";

const LifeInsuranceSection = () => {
  const [preDeleteIncomeOpen, setPreDeleteIncomeOpen] = useState(-1);

  const { data, setField } = useInfo();

  const options = [...data.people];
  const setValue = (
    index: number,
    field: keyof LifeInsurance,
    value: LifeInsurance[typeof field],
  ) => {
    setField("assetSummary")({
      ...data.assetSummary,
      lifeInsurance: data.assetSummary.lifeInsurance.map((item, i) =>
        index === i ? { ...item, [field]: value } : item,
      ),
    });
  };
  return (
    <MapSection
      toggleabble
      title={
        <div className="flex gap-6 items-center w-full p-2">
          <div> Life Insurance </div>
          <div className="w-32">
            <Button
              type="primary"
              className="!py-1"
              onClick={(e) => {
                e.stopPropagation();
                setField("assetSummary")({
                  ...data.assetSummary,
                  lifeInsurance: [
                    ...data.assetSummary.lifeInsurance,
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
            <th className="px-6 py-3 font-medium">Company</th>
            <th className="px-6 py-3 font-medium">Policy #</th>
            <th className="px-6 py-3 font-medium">Insured</th>
            <th className="px-6 py-3 font-medium">Type</th>
            <th className="px-6 py-3 font-medium">Annual Premium</th>
            <th className="px-6 py-3 font-medium">Cash Value</th>
            <th className="px-6 py-3 font-medium">Death Benefit</th>
            <th className="px-6 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.assetSummary.lifeInsurance.map((line, index) => (
            <tr className="">
              <td className="px-2 py-2 ">
                <Input
                  vertical
                  value={line.company}
                  setValue={(v) => setValue(index, "company", v)}
                  size="full"
                  subtype="text"
                  label={``}
                />
              </td>
              <td className="px-2 py-2 ">
                <Input
                  vertical
                  value={line.policyNumber}
                  setValue={(v) => setValue(index, "policyNumber", v)}
                  size="full"
                  subtype="text"
                  label={``}
                />
              </td>
              <td className="px-2 py-2">
                <Select
                  options={options}
                  selected={data.people[line.insured]}
                  setSelected={(i) => setValue(index, "insured", i.id)}
                  label=""
                />
              </td>
              <td className="px-2 py-2">
                <Select
                  options={["Term", "Group Term", "Whole", "GUL", "IUL"].map(
                    (name) => ({ name, id: name }),
                  )}
                  selected={{
                    name: line.type,
                    id: line.type,
                  }}
                  setSelected={(i) => setValue(index, "type", i.id)}
                  label=""
                />
              </td>
              <td className="px-2 py-2 ">
                <Input
                  vertical
                  value={line.annualPremium}
                  setValue={(v) => setValue(index, "annualPremium", v)}
                  size="full"
                  subtype="money"
                  label={``}
                />
              </td>
              <td className="px-2 py-2 ">
                <Input
                  vertical
                  value={line.cashValue}
                  setValue={(v) => setValue(index, "cashValue", v)}
                  size="full"
                  subtype="money"
                  label={``}
                />
              </td>
              <td className="px-2 py-2 ">
                <Input
                  vertical
                  value={line.deathBenefit}
                  setValue={(v) => setValue(index, "deathBenefit", v)}
                  size="full"
                  subtype="money"
                  label={``}
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
                        lifeInsurance: data.assetSummary.lifeInsurance.filter(
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
          <tr>
            <td className="px-2 py-3 font-medium"></td>
            <td className="px-2 py-3 font-medium"></td>
            <td className="px-2 py-3 font-medium"></td>
            <td className="px-2 py-3 font-medium">Total:</td>
            <td className="px-2 py-3 font-medium text-center">
              {printNumber(
                data.assetSummary.lifeInsurance
                  .map((i) => i.annualPremium || 0)
                  .reduce((a, b) => a + b, 0),
              )}
            </td>
            <td className="px-2 py-3 font-medium text-center">
              {printNumber(
                data.assetSummary.lifeInsurance
                  .map((i) => i.cashValue || 0)
                  .reduce((a, b) => a + b, 0),
              )}
            </td>
            <td className="px-2 py-3 font-medium text-center">
              {printNumber(
                data.assetSummary.lifeInsurance
                  .map((i) => i.deathBenefit || 0)
                  .reduce((a, b) => a + b, 0),
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </MapSection>
  );
};

const LongTermCareSection = () => {
  const [preDeleteIncomeOpen, setPreDeleteIncomeOpen] = useState(-1);

  const { data, setField } = useInfo();

  const options = [...data.people] as any[];
  const setValue = (
    index: number,
    field: keyof LongTermCare,
    value: LongTermCare[typeof field],
  ) => {
    setField("assetSummary")({
      ...data.assetSummary,
      longTermCare: data.assetSummary.longTermCare.map((item, i) =>
        index === i ? { ...item, [field]: value } : item,
      ),
    });
  };
  return (
    <MapSection
      title={
        <div className="flex gap-6 items-center w-full p-2">
          <div> Long Term Care </div>
          <div className="w-32">
            <Button
              type="primary"
              className="!py-1"
              onClick={(e) => {
                e.stopPropagation();
                setField("assetSummary")({
                  ...data.assetSummary,
                  longTermCare: [
                    ...data.assetSummary.longTermCare,
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
      toggleabble
    >
      <table className="w-full">
        <thead
          className={`text-sm cursor-pointer text-left sticky z-50 border-1 !font-normal`}
        >
          <tr>
            <th className="px-6 py-3 font-medium">Company</th>
            <th className="px-6 py-3 font-medium">Policy #</th>
            <th className="px-6 py-3 font-medium">Insured</th>
            <th className="px-6 py-3 font-medium">Elimination period</th>
            <th className="px-6 py-3 font-medium">COLA</th>
            <th className="px-6 py-3 font-medium">Annual Premium</th>
            <th className="px-6 py-3 font-medium">Monthly Benefit</th>
            <th className="px-6 py-3 font-medium">Death Benefit</th>
            <th className="px-6 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.assetSummary.longTermCare.map((line, index) => (
            <tr className="">
              <td className="px-2 py-2 ">
                <Input
                  value={line.company}
                  setValue={(v) => setValue(index, "company", v)}
                  size="full"
                  subtype="text"
                  label={``}
                />
              </td>
              <td className="px-2 py-2 ">
                <Input
                  value={line.policyNumber}
                  setValue={(v) => setValue(index, "policyNumber", v)}
                  size="full"
                  subtype="text"
                  label={``}
                />
              </td>
              <td className="px-2 py-2">
                <Select
                  options={options}
                  selected={data.people[line.insured]}
                  setSelected={(i) => setValue(index, "insured", i.id)}
                  label=""
                />
              </td>
              <td className="px-2 py-2">
                <Select
                  options={[
                    "0 days",
                    "30 days",
                    "60 days",
                    "90 days",
                    "180 days",
                  ].map((name) => ({ name, id: name }))}
                  selected={{
                    name: line.eliminationPeriod,
                    id: line.eliminationPeriod,
                  }}
                  setSelected={(i) =>
                    setValue(index, "eliminationPeriod", i.id)
                  }
                  label=""
                />
              </td>
              <td className="px-2 py-2 ">
                <Input
                  value={line.COLA}
                  setValue={(v) => setValue(index, "COLA", v)}
                  size="full"
                  subtype="percent"
                  label={``}
                />
              </td>

              <td className="px-2 py-2 ">
                <Input
                  value={line.annualPremium}
                  setValue={(v) => setValue(index, "annualPremium", v)}
                  size="full"
                  subtype="money"
                  label={``}
                />
              </td>
              <td className="px-2 py-2 ">
                <Input
                  value={line.monthlyBenefit}
                  setValue={(v) => setValue(index, "monthlyBenefit", v)}
                  size="full"
                  subtype="money"
                  label={``}
                />
              </td>
              <td className="px-2 py-2 ">
                <Input
                  value={line.deathBenefit}
                  setValue={(v) => setValue(index, "deathBenefit", v)}
                  size="full"
                  subtype="money"
                  label={``}
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
                        longTermCare: data.assetSummary.longTermCare.filter(
                          (_, ind) => ind !== index,
                        ),
                      });
                    }}
                  >
                    <TrashIcon className="text-slate-400 w-10 m-auto mb-5" />
                    <div className="mb-5">
                      Are you sure you want to delete this long term care?
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
          <tr>
            <td className="px-2 py-3 font-medium"></td>
            <td className="px-2 py-3 font-medium"></td>
            <td className="px-2 py-3 font-medium"></td>
            <td className="px-2 py-3 font-medium"></td>
            <td className="px-2 py-3 font-medium">Total:</td>
            <td className="px-2 py-3 font-medium text-center">
              {printNumber(
                data.assetSummary.longTermCare
                  .map((i) => i.annualPremium || 0)
                  .reduce((a, b) => a + b, 0),
              )}
            </td>
            <td className="px-2 py-3 font-medium text-center">
              {printNumber(
                data.assetSummary.longTermCare
                  .map((i) => i.monthlyBenefit || 0)
                  .reduce((a, b) => a + b, 0),
              )}
            </td>
            <td className="px-2 py-3 font-medium text-center">
              {printNumber(
                data.assetSummary.longTermCare
                  .map((i) => i.deathBenefit || 0)
                  .reduce((a, b) => a + b, 0),
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </MapSection>
  );
};

const AccumulationAnnuitySection = () => {
  const [preDeleteIncomeOpen, setPreDeleteIncomeOpen] = useState(-1);

  const { data, setField } = useInfo();

  const options = [...data.people] as any[];
  const setValue = (
    index: number,
    field: keyof AccumulationAnnuity,
    value: AccumulationAnnuity[typeof field],
  ) => {
    setField("assetSummary")({
      ...data.assetSummary,
      accumulationAnnuity: data.assetSummary.accumulationAnnuity.map(
        (item, i) => (index === i ? { ...item, [field]: value } : item),
      ),
    });
  };
  return (
    <MapSection
      title={
        <div className="flex gap-6 items-center w-full p-2">
          <div> Annuity - Accumulation </div>
          <div className="w-32">
            <Button
              type="primary"
              className="!py-1"
              onClick={(e) => {
                e.stopPropagation();
                setField("assetSummary")({
                  ...data.assetSummary,
                  accumulationAnnuity: [
                    ...data.assetSummary.accumulationAnnuity,
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
      toggleabble
    >
      <table className="w-full">
        <thead
          className={`text-sm cursor-pointer text-left sticky z-50 border-1 !font-normal`}
        >
          <tr>
            <th className="px-6 py-3 font-medium">Company</th>
            <th className="px-6 py-3 font-medium">Policy #</th>
            <th className="px-6 py-3 font-medium">Owner</th>
            <th className="px-6 py-3 font-medium">Tax Status</th>
            <th className="px-6 py-3 font-medium">Type</th>
            <th className="px-6 py-3 font-medium">Surrender Free</th>
            <th className="px-6 py-3 font-medium">Account Value</th>
            <th className="px-6 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.assetSummary.accumulationAnnuity.map((line, index) => (
            <tr className="">
              <td className="px-2 py-2 ">
                <Input
                  value={line.company}
                  setValue={(v) => setValue(index, "company", v)}
                  size="full"
                  subtype="text"
                  label={``}
                />
              </td>
              <td className="px-2 py-2 ">
                <Input
                  value={line.policyNumber}
                  setValue={(v) => setValue(index, "policyNumber", v)}
                  size="full"
                  subtype="text"
                  label={``}
                />
              </td>
              <td className="px-2 py-2">
                <Select
                  options={options}
                  selected={data.people[line.owner]}
                  setSelected={(i) => setValue(index, "owner", i.id)}
                  label=""
                />
              </td>
              <td className="px-2 py-2">
                <Select
                  options={[
                    "Qualified - IRA",
                    "Qualified - Roth",
                    "Non-Qualified",
                  ].map((name) => ({ name, id: name }))}
                  selected={{
                    name: line.taxStatus,
                    id: line.taxStatus,
                  }}
                  setSelected={(i) => setValue(index, "taxStatus", i.id)}
                  label=""
                />
              </td>
              <td className="px-2 py-2">
                <Select
                  options={["FIA", "Fixed", "MYGA"].map((name) => ({
                    name,
                    id: name,
                  }))}
                  selected={{
                    name: line.type,
                    id: line.type,
                  }}
                  setSelected={(i) => setValue(index, "type", i.id)}
                  label=""
                />
              </td>
              <td className="px-2 py-2 ">
                <Input
                  value={line.surrenderFree}
                  setValue={(v) => setValue(index, "surrenderFree", v)}
                  size="full"
                  subtype="money"
                  label={``}
                />
              </td>

              <td className="px-2 py-2 ">
                <Input
                  value={line.accountValue}
                  setValue={(v) => setValue(index, "accountValue", v)}
                  size="full"
                  subtype="money"
                  label={``}
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
                        accumulationAnnuity:
                          data.assetSummary.accumulationAnnuity.filter(
                            (_, ind) => ind !== index,
                          ),
                      });
                    }}
                  >
                    <TrashIcon className="text-slate-400 w-10 m-auto mb-5" />
                    <div className="mb-5">
                      Are you sure you want to delete this accumulation annuity?
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
          <tr>
            <td className="px-2 py-3 font-medium"></td>
            <td className="px-2 py-3 font-medium"></td>
            <td className="px-2 py-3 font-medium"></td>
            <td className="px-2 py-3 font-medium"></td>
            <td className="px-2 py-3 font-medium"></td>
            <td className="px-2 py-3 font-medium">Total:</td>

            <td className="px-2 py-3 font-medium text-center">
              {printNumber(
                data.assetSummary.accumulationAnnuity
                  .map((i) => i.accountValue || 0)
                  .reduce((a, b) => a + b, 0),
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </MapSection>
  );
};

const PensionAnnuitySection = () => {
  const [preDeleteIncomeOpen, setPreDeleteIncomeOpen] = useState(-1);

  const { data, setField } = useInfo();

  const options = [...data.people] as any[];
  const setValue = (
    index: number,
    field: keyof PersonalPensionAnnuity,
    value: PersonalPensionAnnuity[typeof field],
  ) => {
    setField("assetSummary")({
      ...data.assetSummary,
      personalPensionAnnuity: data.assetSummary.personalPensionAnnuity.map(
        (item, i) => (index === i ? { ...item, [field]: value } : item),
      ),
    });
  };
  return (
    <MapSection
      title={
        <div className="flex gap-6 items-center w-full p-2">
          <div> Annuity - Personal Pension </div>
          <div className="w-32">
            <Button
              type="primary"
              className="!py-1"
              onClick={(e) => {
                e.stopPropagation();
                setField("assetSummary")({
                  ...data.assetSummary,
                  personalPensionAnnuity: [
                    ...data.assetSummary.personalPensionAnnuity,
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
      toggleabble
    >
      <table className="w-full">
        <thead
          className={`text-sm cursor-pointer text-left sticky z-50 border-1 !font-normal`}
        >
          <tr>
            <th className="px-6 py-3 font-medium">Company</th>
            <th className="px-6 py-3 font-medium">Policy #</th>
            <th className="px-6 py-3 font-medium">Owner</th>
            <th className="px-6 py-3 font-medium">Tax Status</th>
            <th className="px-6 py-3 font-medium">Effective Date</th>
            <th className="px-6 py-3 font-medium">Annual Income</th>
            <th className="px-6 py-3 font-medium">Account Value</th>
            <th className="px-6 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.assetSummary.personalPensionAnnuity.map((line, index) => (
            <tr className="">
              <td className="px-2 py-2 ">
                <Input
                  value={line.company}
                  setValue={(v) => setValue(index, "company", v)}
                  size="full"
                  subtype="text"
                  label={``}
                />
              </td>
              <td className="px-2 py-2 ">
                <Input
                  value={line.policyNumber}
                  setValue={(v) => setValue(index, "policyNumber", v)}
                  size="full"
                  subtype="text"
                  label={``}
                />
              </td>
              <td className="px-2 py-2">
                <Select
                  options={options}
                  selected={data.people[line.owner]}
                  setSelected={(i) => setValue(index, "owner", i.id)}
                  label=""
                />
              </td>
              <td className="px-2 py-2">
                <Select
                  options={[
                    "Qualified - IRA",
                    "Qualified - Roth",
                    "Non-Qualified",
                  ].map((name) => ({ name, id: name }))}
                  selected={{
                    name: line.taxStatus,
                    id: line.taxStatus,
                  }}
                  setSelected={(i) => setValue(index, "taxStatus", i.id)}
                  label=""
                />
              </td>
              <td className="px-2 py-2">
                <Input
                  value={line.effectiveDate}
                  setValue={(v) => setValue(index, "effectiveDate", v)}
                  size="full"
                  subtype="date"
                  label={``}
                />
              </td>
              <td className="px-2 py-2 ">
                <Input
                  value={line.annualIncome}
                  setValue={(v) => setValue(index, "annualIncome", v)}
                  size="full"
                  subtype="money"
                  label={``}
                />
              </td>

              <td className="px-2 py-2 ">
                <Input
                  value={line.accountValue}
                  setValue={(v) => setValue(index, "accountValue", v)}
                  size="full"
                  subtype="money"
                  label={``}
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
                        accumulationAnnuity:
                          data.assetSummary.accumulationAnnuity.filter(
                            (_, ind) => ind !== index,
                          ),
                      });
                    }}
                  >
                    <TrashIcon className="text-slate-400 w-10 m-auto mb-5" />
                    <div className="mb-5">
                      Are you sure you want to delete this accumulation annuity?
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
          <tr>
            <td className="px-2 py-3 font-medium"></td>
            <td className="px-2 py-3 font-medium"></td>
            <td className="px-2 py-3 font-medium"></td>
            <td className="px-2 py-3 font-medium"></td>
            <td className="px-2 py-3 font-medium">Total:</td>

            <td className="px-2 py-3 font-medium text-center">
              {printNumber(
                data.assetSummary.personalPensionAnnuity
                  .map((i) => i.annualIncome || 0)
                  .reduce((a, b) => a + b, 0),
              )}
            </td>
            <td className="px-2 py-3 font-medium text-center">
              {printNumber(
                data.assetSummary.personalPensionAnnuity
                  .map((i) => i.accountValue || 0)
                  .reduce((a, b) => a + b, 0),
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </MapSection>
  );
};

const PensionSection = () => {
  const [preDeleteIncomeOpen, setPreDeleteIncomeOpen] = useState(-1);

  const { data, setField } = useInfo();

  const options = [...data.people] as any[];
  const setValue = (
    index: number,
    field: keyof Pension,
    value: Pension[typeof field],
  ) => {
    setField("assetSummary")({
      ...data.assetSummary,
      pension: data.assetSummary.pension.map((item, i) =>
        index === i ? { ...item, [field]: value } : item,
      ),
    });
  };
  return (
    <MapSection
      title={
        <div className="flex gap-6 items-center w-full p-2">
          <div> Pension </div>
          <div className="w-32">
            <Button
              type="primary"
              className="!py-1"
              onClick={(e) => {
                e.stopPropagation();
                setField("assetSummary")({
                  ...data.assetSummary,
                  pension: [
                    ...data.assetSummary.pension,
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
      toggleabble
      defaultOpen
    >
      <table className="w-full">
        <thead
          className={`text-sm cursor-pointer text-left sticky z-50 border-1 !font-normal`}
        >
          <tr>
            <th className="px-6 py-3 font-medium">Company</th>
            <th className="px-6 py-3 font-medium">Account #</th>
            <th className="px-6 py-3 font-medium">Owner</th>
            <th className="px-6 py-3 font-medium">Monthly Income</th>
            <th className="px-6 py-3 font-medium">Annual Income</th>
            <th className="px-6 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.assetSummary.pension.map((line, index) => (
            <tr className="">
              <td className="px-2 py-2 ">
                <Input
                  vertical
                  value={line.company}
                  setValue={(v) => setValue(index, "company", v)}
                  size="full"
                  subtype="text"
                  label={``}
                />
              </td>
              <td className="px-2 py-2 ">
                <Input
                  vertical
                  value={line.accountNumber}
                  setValue={(v) => setValue(index, "accountNumber", v)}
                  size="full"
                  subtype="text"
                  label={``}
                />
              </td>
              <td className="px-2 py-2">
                <Select
                  options={options}
                  selected={data.people[line.owner]}
                  setSelected={(i) => setValue(index, "owner", i.id)}
                  label=""
                />
              </td>

              <td className="px-2 py-2 ">
                <Input
                  vertical
                  value={line.monthlyIncome}
                  setValue={(v) => setValue(index, "monthlyIncome", v)}
                  size="full"
                  subtype="money"
                  label={``}
                />
              </td>
              <td className="px-2 py-2 ">
                <Input
                  disabled
                  value={line.monthlyIncome && line.monthlyIncome * 12}
                  setValue={() => { }}
                  size="full"
                  subtype="money"
                  label={``}
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
                        pension: data.assetSummary.pension.filter(
                          (_, ind) => ind !== index,
                        ),
                      });
                    }}
                  >
                    <TrashIcon className="text-slate-400 w-10 m-auto mb-5" />
                    <div className="mb-5">
                      Are you sure you want to delete this pension?
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
          <tr>
            <td className="px-2 py-3 font-medium"></td>
            <td className="px-2 py-3 font-medium"></td>
            <td className="px-2 py-3 font-medium">Total:</td>
            <td className="px-2 py-3 font-medium text-center">
              {printNumber(
                data.assetSummary.pension
                  .map((i) => i.monthlyIncome || 0)
                  .reduce((a, b) => a + b, 0),
              )}
            </td>
            <td className="px-2 py-3 font-medium text-center">
              {printNumber(
                data.assetSummary.pension
                  .map((i) => i.monthlyIncome || 0)
                  .reduce((a, b) => a + b, 0) * 12,
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </MapSection>
  );
};

const ContractualWealthPage = () => {
  return (
    <Container active="contractual-wealth">
      <LifeInsuranceSection />
      <div className="h-8"></div>
      <LongTermCareSection />
      <div className="h-8"></div>
      <AccumulationAnnuitySection />
      <div className="h-8"></div>
      <PensionAnnuitySection />
      <div className="h-8"></div>
      <PensionSection />
    </Container>
  );
};

export default ContractualWealthPage;
