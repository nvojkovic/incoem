import Select from "../Inputs/Select";
import Input from "../Inputs/Input";
import { useState } from "react";
import { Paydown, Person } from "src/types";

interface Props {
  paydown: Paydown;
  people: Person[];
  setIncome: (income: Paydown) => void;
}

const BasicAnnuity = ({ people, paydown, setIncome }: Props) => {
  const options = [...people] as any[];
  if (people.length == 2) {
    options.push({ name: "Joint", id: -1 });
  }

  const interest = paydown.interestRate / 100;
  let amount =
    (paydown.total * interest) / (1 - Math.pow(1 + interest, -paydown.length));

  if (paydown.paymentInYear === "beginning") {
    amount = amount / (1 + interest);
  }
  const [resultType, setResultType] = useState("yearly");
  const factor = resultType === "monthly" ? 12 : 1;
  const result =
    Number.isNaN(amount) || amount == Infinity
      ? 0
      : Math.round(amount / factor);

  return (
    <div className="flex flex-col gap-4">
      {people.length > 1 && (
        <Select
          options={options}
          selected={
            paydown.personId == -1
              ? { name: "Joint", id: -1 }
              : people[paydown.personId]
          }
          setSelected={(i) => setIncome({ ...paydown, personId: i.id })}
          label="Person"
        />
      )}
      <Input
        label="Title"
        subtype="text"
        size="lg"
        value={paydown.name}
        setValue={(name) => setIncome({ ...paydown, name })}
      />
      <Input
        label="Principal"
        subtype="money"
        size="lg"
        value={paydown.total}
        tooltip="The total principal amount to be paid down"
        setValue={(name) => setIncome({ ...paydown, total: name })}
      />
      <Input
        label="Interest Rate"
        subtype="percent"
        size="lg"
        tooltip="The interest rate of the paydown"
        value={paydown.interestRate}
        setValue={(name) => setIncome({ ...paydown, interestRate: name })}
      />
      <Select
        label="Timing"
        options={[
          { id: "beginning", name: "Beginning" },
          { id: "end", name: "End" },
        ]}
        selected={{
          id: paydown.paymentInYear,
          name: (paydown.paymentInYear as any)?.capitalize(),
        }}
        setSelected={(i) => setIncome({ ...paydown, paymentInYear: i.id })}
      />
      <Input
        label="Start Year"
        subtype="number"
        size="lg"
        tooltip="The calendar year the paydown starts"
        value={paydown.startYear}
        invalid={!!paydown.startYear && paydown.startYear < 1900}
        errorMessage="End year should be a calender year (e.g. 2031)"
        setValue={(name) => setIncome({ ...paydown, startYear: name })}
      />
      <Input
        label="Length (years)"
        subtype="number"
        size="lg"
        tooltip="How many years (e.g., 15) will the paydown last"
        value={paydown.length}
        setValue={(name) =>
          setIncome({
            ...paydown,
            length: name,
          })
        }
      />
      <Input
        label="Calculated Payment"
        subtype="mo/yr"
        size="lg"
        disabled
        value={{ value: result, type: resultType }}
        setValue={({ type }) => setResultType(type)}
      />
      <Select
        options={[
          { name: "Tax-Free", id: "Tax-Free" },
          { name: "Tax-Deferred", id: "Tax-Deferred" },
          { name: "Taxable", id: "Taxable" },
        ]}
        selected={{
          name: paydown.taxType,
          id: paydown.taxType,
        }}
        setSelected={(i) => setIncome({ ...paydown, taxType: i.id })}
        label="Tax Status"
      />
    </div>
  );
};

export default BasicAnnuity;
