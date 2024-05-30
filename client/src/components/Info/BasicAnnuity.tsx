import Select from "../Inputs/Select";
import Input from "../Inputs/Input";

interface Props {
  annuity: BasicAnnuity;
  people: Person[];
  setIncome: (income: BasicAnnuity) => void;
}

const BasicAnnuity = ({ people, annuity: pension, setIncome }: Props) => {
  const options = [...people] as any[];
  if (people.length == 2) {
    options.push({ name: "Joint", id: -1 });
  }
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
            label="Annual Amount"
            subtype="money"
            size="lg"
            value={pension.annualAmount}
            setValue={(name) => setIncome({ ...pension, annualAmount: name })}
          />
          <Input
            label="Years of Deferral"
            subtype="number"
            size="lg"
            value={pension.yearsOfDeferral}
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
          <Input
            label="Yearly Increase"
            subtype="percent"
            size="lg"
            value={pension.yearlyIncreasePercent}
            tooltip="What percentage will the annuity increase each year?"
            setValue={(name) =>
              setIncome({ ...pension, yearlyIncreasePercent: name })
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
        </div>
      </div>
    </>
  );
};

export default BasicAnnuity;
