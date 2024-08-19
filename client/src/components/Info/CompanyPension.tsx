import Select from "../Inputs/Select";
import Input from "../Inputs/Input";

interface Props {
  pension: CompanyPension;
  people: Person[];
  setIncome: (income: CompanyPension) => void;
}

const CompanyPension = ({ people, pension, setIncome }: Props) => {
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
            label="Annual Amount"
            subtype="money"
            size="lg"
            value={pension.annualAmount}
            setValue={(name) => setIncome({ ...pension, annualAmount: name })}
          />
          <Input
            label="Yearly Increase"
            subtype="percent"
            size="lg"
            value={pension.yearlyIncreasePercent}
            setValue={(name) =>
              setIncome({ ...pension, yearlyIncreasePercent: name })
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
