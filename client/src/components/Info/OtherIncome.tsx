import Select from "../Inputs/Select";
import Input from "../Inputs/Input";

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
  return (
    <>
      <div className="flex flex-col gap-4  justify-start">
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
          label="Income amount"
          subtype="money"
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
          label="Income frequency"
        />
        <Input
          label="Start year"
          subtype="number"
          tooltip="Year when the income starts"
          value={pension.startYear}
          setValue={(name) => setIncome({ ...pension, startYear: name })}
        />
        <Input
          label="End year"
          subtype="number"
          tooltip="Year when the income ends"
          value={pension.endYear}
          setValue={(name) => setIncome({ ...pension, endYear: name })}
        />
        <Input
          label="Yearly increase"
          subtype="percent"
          tooltip="Yearly increase in the income amount"
          value={pension.yearlyIncreasePercent}
          setValue={(name) =>
            setIncome({ ...pension, yearlyIncreasePercent: name })
          }
        />
        {people.length > 1 && (
          <Input
            label="Survivor"
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
          tooltip="Percentage of the income you will receive in the first year"
          value={pension.firstYearProRatePercent}
          setValue={(name) =>
            setIncome({
              ...pension,
              firstYearProRatePercent: name,
            })
          }
        />
      </div>
    </>
  );
};

export default BasicAnnuity;
