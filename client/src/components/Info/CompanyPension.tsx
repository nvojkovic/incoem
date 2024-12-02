import Select from "../Inputs/Select";
import Input from "../Inputs/Input";
import IncomeYearlyIncrease from "./IncomeYearlyIncrease";

interface Props {
  pension: CompanyPension;
  people: Person[];
  setIncome: (income: CompanyPension) => void;
}

const CompanyPension = ({ people, pension, setIncome }: Props) => {
  const amount = pension.amount
    ? pension.amount
    : {
        type: "yearly",
        value: pension.annualAmount,
      };
  return (
    <>
      <div className="flex-grow">
        <div className="flex flex-col gap-4 ">
          {people.length > 1 && (
            <Select
              options={[...people]}
              selected={people[pension.personId]}
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
            tooltip="The amount of income earned."
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
          {people.length > 1 && (
            <Input
              label="Survivor %"
              subtype="percent"
              size="lg"
              value={pension.survivorPercent}
              setValue={(name) =>
                setIncome({ ...pension, survivorPercent: name })
              }
            />
          )}
          <Input
            label="Start Age"
            subtype="number"
            size="lg"
            value={pension.startAge}
            setValue={(name) => setIncome({ ...pension, startAge: name })}
            invalid={!!pension.startAge && pension.startAge > 100}
            errorMessage="Start Age should be the age of the person, not the calendar year"
            tooltip="Age that pension income begins (e.g., 65). Leave blank if already receiving."
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
        </div>
      </div>
    </>
  );
};

export default CompanyPension;
