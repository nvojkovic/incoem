import { TrashIcon } from "@heroicons/react/24/outline";
import Section from "../Section";
import Select from "../Inputs/Select";
import Input from "../Inputs/Input";
import MonthPicker from "../Inputs/MonthPicker";

interface Props {
  income: EmploymentIncome;
  people: Person[];
  setIncome: (income: EmploymentIncome) => void;
  remove: () => void;
}

const EmploymentIncome = ({ people, remove, income, setIncome }: Props) => {
  return (
    <Section>
      <div className="flex gap-4 items-center">
        <Select
          label="Person"
          options={[...people]}
          selected={people[income.personId]}
          setSelected={(i) => setIncome({ ...income, personId: i.id })}
        />
        <Input
          label="Start Age"
          subtype="number"
          value={income.startAge}
          setValue={(name) => setIncome({ ...income, startAge: name })}
        />
        <Input
          label="First-Year Prorate"
          subtype="percent"
          value={income.firstYearProratePercent}
          setValue={(name) =>
            setIncome({ ...income, firstYearProratePercent: name })
          }
        />
        <Input
          label="Annual Income"
          subtype="money"
          value={income.annualIncome}
          setValue={(name) => setIncome({ ...income, annualIncome: name })}
        />
        <Input
          label="Yearly increase"
          subtype="percent"
          value={income.yearlyIncreasePercent}
          setValue={(name) =>
            setIncome({ ...income, yearlyIncreasePercent: name })
          }
        />
        <Input
          label="Retirement Year"
          subtype="text"
          value={income.retirementAgeYear}
          setValue={(name) => setIncome({ ...income, retirementAgeYear: name })}
        />
        <MonthPicker
          label="Retirement Month"
          selected={income.retirementAgeMonth}
          setSelected={(i) =>
            setIncome({ ...income, retirementAgeMonth: i.id })
          }
        />
        <TrashIcon
          className="text-red-500 w-6 cursor-pointer mt-5"
          onClick={remove}
        />
      </div>
    </Section>
  );
};

export default EmploymentIncome;
