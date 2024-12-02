import Select from "../Inputs/Select";
import Input from "../Inputs/Input";
import MonthPicker from "../Inputs/MonthPicker";
import IncomeYearlyIncrease from "./IncomeYearlyIncrease";

interface Props {
  income: EmploymentIncome;
  people: Person[];
  setIncome: (income: EmploymentIncome) => void;
}

const EmploymentIncome = ({ people, income, setIncome }: Props) => {
  const amount = income.income
    ? income.income
    : {
      type: "yearly",
      value: income.annualIncome,
    };
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
        label="Income"
        subtype="mo/yr"
        size="lg"
        value={amount}
        setValue={(name) => setIncome({ ...income, income: name })}
        tooltip="The amount of income earned annually."
      />
      <IncomeYearlyIncrease
        labels={false}
        increase={
          income.yearlyIncrease || {
            type: "custom",
            percent: income.yearlyIncreasePercent,
          }
        }
        setYearlyIncrease={(yearlyIncrease) =>
          setIncome({ ...income, yearlyIncrease })
        }
      />
      <Input
        label="Start Age"
        subtype="number"
        size="lg"
        value={income.startAge}
        invalid={!!income.startAge && income.startAge > 100}
        errorMessage="Start Age should be the age of the person, not the calendar year"
        setValue={(name) => setIncome({ ...income, startAge: name })}
        tooltip="Leave blank if already receiving"
      />
      <Input
        label="First-Year Prorate"
        subtype="percent"
        size="lg"
        value={income.firstYearProratePercent}
        setValue={(name) =>
          setIncome({ ...income, firstYearProratePercent: name })
        }
        tooltip="The percentage of the first year's income that is earned."
      />
      <Input
        label="Retirement Age"
        invalid={!!income.retirementAgeYear && income.retirementAgeYear > 100}
        errorMessage="Retirement Age should be the age of the person, not the calendar year"
        subtype="text"
        size="lg"
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
