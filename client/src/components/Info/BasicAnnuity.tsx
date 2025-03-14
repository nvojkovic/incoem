import Select from "../Inputs/Select";
import Input from "../Inputs/Input";
import IncomeYearlyIncrease from "./IncomeYearlyIncrease";
import { BasicAnnuity as BasicAnnuityType, Person } from "src/types";

interface Props {
  annuity: BasicAnnuityType;
  people: Person[];
  setIncome: (income: BasicAnnuityType) => void;
}

const BasicAnnuity = ({ people, annuity: pension, setIncome }: Props) => {
  const options = [...people] as any[];
  if (people.length == 2) {
    options.push({ name: "Joint", id: -1 });
  }
  const amount = pension.amount
    ? pension.amount
    : {
      type: "yearly",
      value: pension.annualAmount,
    };

  return (
    <>
      <div className="flex-grow">
        <div className="flex flex-col gap-4">
          {people.length > 1 && (
            <Select
              options={options}
              selected={
                pension.personId == -1
                  ? { name: "Joint", id: -1 }
                  : people[pension.personId]
              }
              setSelected={(i) => setIncome({ ...pension, personId: i.id })}
              label="Person"
            />
          )}
          <Input
            label="Title"
            subtype="text"
            size="lg"
            value={pension.name}
            setValue={(name) => setIncome({ ...pension, name })}
          />
          <Input
            label="Amount"
            subtype="mo/yr"
            size="lg"
            value={amount}
            setValue={(name) => setIncome({ ...pension, amount: name })}
          />
          <Input
            label="Years of Deferral"
            subtype="number"
            size="lg"
            value={pension.yearsOfDeferral}
            invalid={!!pension.yearsOfDeferral && pension.yearsOfDeferral > 50}
            errorMessage="Years of deferral should be the number of years until the annuity starts."
            tooltip="Years of deferral"
            setValue={(name) =>
              setIncome({ ...pension, yearsOfDeferral: name })
            }
          />
          {people.length > 1 && pension.personId != -1 && (
            <Input
              label="Survivor %"
              subtype="percent"
              size="lg"
              tooltip="What percentage of the annuity will the survivor receive?"
              value={pension.survivorPercent}
              setValue={(name) =>
                setIncome({ ...pension, survivorPercent: name })
              }
            />
          )}
          <IncomeYearlyIncrease
            labels={false}
            increase={
              pension.yearlyIncrease || {
                type: "custom",
                percent: pension.yearlyIncreasePercent,
              }
            }
            setYearlyIncrease={(yearlyIncrease) =>
              setIncome({ ...pension, yearlyIncrease })
            }
          />
          <Input
            label="First-Year Prorate"
            subtype="percent"
            size="lg"
            value={pension.firstYearProRatePercent}
            tooltip="What percentage of the annuity will be paid in the first year?"
            setValue={(name) =>
              setIncome({
                ...pension,
                firstYearProRatePercent: parseInt(name),
              })
            }
          />
          <Select
            options={[
              { name: "Tax-Free", id: "Tax-Free" },
              { name: "Tax-Deferred", id: "Tax-Deferred" },
              { name: "Taxable", id: "Taxable" },
            ]}
            selected={{
              name: pension.taxType,
              id: pension.taxType,
            }}
            setSelected={(i) => setIncome({ ...pension, taxType: i.id })}
            label="Tax Status"
          />
        </div>
      </div>
    </>
  );
};

export default BasicAnnuity;
