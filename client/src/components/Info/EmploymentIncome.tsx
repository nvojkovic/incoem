import Select from "../Inputs/Select";
import Input from "../Inputs/Input";
import MonthPicker from "../Inputs/MonthPicker";

interface Props {
  income: EmploymentIncome;
  people: Person[];
  setIncome: (income: EmploymentIncome) => void;
}

const EmploymentIncome = ({ people, income, setIncome }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      {people.length > 1 && (
        <Select
          label="Person"
          options={[...people]}
          selected={people[income.personId]}
          setSelected={(i) => setIncome({ ...income, personId: i.id })}
        />
      )}
      <Input
        label="Title"
        subtype="text"
        size="lg"
        value={income.name}
        setValue={(name) => setIncome({ ...income, name })}
      />
      <Input
        label="Annual Income"
        subtype="money"
        value={income.annualIncome}
        setValue={(name) => setIncome({ ...income, annualIncome: name })}
        tooltip="The amount of income earned annually."
      />
      <Input
        label="Yearly increase"
        subtype="percent"
        value={income.yearlyIncreasePercent}
        setValue={(name) =>
          setIncome({ ...income, yearlyIncreasePercent: name })
        }
        tooltip="The percentage increase in income each year."
      />
      <Input
        label="Start Age"
        subtype="number"
        value={income.startAge}
        setValue={(name) => setIncome({ ...income, startAge: name })}
        tooltip="The age at which the person starts earning income."
      />
      <Input
        label="First-Year Prorate"
        subtype="percent"
        value={income.firstYearProratePercent}
        setValue={(name) =>
          setIncome({ ...income, firstYearProratePercent: name })
        }
        tooltip="The percentage of the first year's income that is earned."
      />
      <Input
        label="Retirement Age"
        subtype="text"
        value={income.retirementAgeYear}
        setValue={(name) => setIncome({ ...income, retirementAgeYear: name })}
        tooltip="The age at which the person retires."
      />
      <MonthPicker
        label="Retirement Month"
        selected={income.retirementAgeMonth}
        setSelected={(i) => setIncome({ ...income, retirementAgeMonth: i.id })}
      />
    </div>
  );
};

export default EmploymentIncome;
