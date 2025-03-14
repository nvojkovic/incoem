import Select from "../Inputs/Select";
import Input from "../Inputs/Input";
import IncomeYearlyIncrease from "./IncomeYearlyIncrease";
import { migrateOtherIncome } from "src/calculator/other-income";
import { OtherIncome, Person } from "src/types";

interface Props {
  annuity: OtherIncome;
  people: Person[];
  setIncome: (income: OtherIncome) => void;
}

const BasicAnnuity = ({ people, annuity: pension, setIncome }: Props) => {
  const options = [...people] as any[];
  if (people.length == 2) {
    options.push({ name: "Joint", id: -1 });
  }
  const newAmount = migrateOtherIncome(pension);

  return (
    <>
      <div className="flex flex-col gap-4 justify-start">
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
          value={newAmount}
          setValue={(name) => setIncome({ ...pension, newAmount: name })}
        />
        {/*
<Input
          label="Income Amount"
          subtype="money"
          size="lg"
          value={pension.amount}
          setValue={(name) => setIncome({ ...pension, amount: name })}
        />
        <Select
          options={[
            { name: "Monthly", id: "monthly" },
            { name: "Quarterly", id: "quarterly" },
            { name: "Semi-Annually", id: "semi-annually" },
            { name: "Annually", id: "annually" },
          ]}
          selected={{
            name: (pension.frequency as any).capitalize(),
            id: pension.frequency,
          }}
          setSelected={(i) => setIncome({ ...pension, frequency: i.id })}
          label="Income Frequency"
        />*/}
        <Input
          label="Start Year"
          size="lg"
          invalid={!!pension.startYear && pension.startYear < 1900}
          errorMessage="Start year should be a calender year (e.g. 2031)"
          subtype="number"
          tooltip="Calendar year (e.g., 2030) income begins. Leave blank if already receiving"
          value={pension.startYear}
          setValue={(name) => setIncome({ ...pension, startYear: name })}
        />
        <Input
          label="End Year"
          subtype="number"
          size="lg"
          invalid={!!pension.endYear && pension.endYear < 1900}
          errorMessage="End year should be a calender year (e.g. 2031)"
          tooltip="Calendar year (e.g., 2040) that income ends. Leave blank if ends at death"
          value={pension.endYear}
          setValue={(name) => setIncome({ ...pension, endYear: name })}
        />
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
        {people.length > 1 && pension.personId != -1 && (
          <Input
            label="Survivor"
            size="lg"
            subtype="percent"
            tooltip="Percentage of the income that the survivor will receive"
            value={pension.survivorPercent}
            setValue={(name) =>
              setIncome({ ...pension, survivorPercent: name })
            }
          />
        )}
        <Input
          label="First-Year Prorate"
          subtype="percent"
          size="lg"
          tooltip="Percentage of the income you will receive in the first year"
          value={pension.firstYearProRatePercent}
          setValue={(name) =>
            setIncome({
              ...pension,
              firstYearProRatePercent: name,
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
    </>
  );
};

export default BasicAnnuity;
