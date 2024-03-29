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
            label="Annual amount"
            subtype="money"
            value={pension.annualAmount}
            setValue={(name) => setIncome({ ...pension, annualAmount: name })}
          />
          {people.length > 1 && (
            <Input
              label="Survivor"
              subtype="percent"
              value={pension.survivorPercent}
              setValue={(name) =>
                setIncome({ ...pension, survivorPercent: name })
              }
            />
          )}
          <Input
            label="Yearly increase"
            subtype="percent"
            value={pension.yearlyIncreasePercent}
            setValue={(name) =>
              setIncome({ ...pension, yearlyIncreasePercent: name })
            }
          />
          <Input
            label="Start Age"
            subtype="number"
            value={pension.startAge}
            setValue={(name) => setIncome({ ...pension, startAge: name })}
          />
          <Input
            label="First-Year Prorate"
            subtype="percent"
            value={pension.firstYearProRatePercent}
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
