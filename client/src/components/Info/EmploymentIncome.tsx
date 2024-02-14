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
      <div className="flex-grow">
        <div className="flex flex-col pb-6 border-b border-[#EAECF0]">
          <div className="font-semibold text-lg flex justify-between">
            <Select
              options={[...people, { name: "Joint", id: -1 }]}
              selected={
                income.personId == -1
                  ? { name: "Joint", id: -1 }
                  : people[income.personId]
              }
              setSelected={(i) => setIncome({ ...income, personId: i.id })}
            />
            <TrashIcon
              className="text-red-500 w-6 cursor-pointer"
              onClick={remove}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 mt-6">
          <div className="bg-red-50"></div>
          <Input
            label="Start Age (if not already receiving)"
            value={income.startAge.toString()}
            setValue={(name) =>
              setIncome({ ...income, startAge: parseInt(name) })
            }
          />
          <Input
            label="First-Year Pro-Rate %"
            value={income.firstYearProratePercent.toString()}
            setValue={(name) =>
              setIncome({ ...income, firstYearProratePercent: parseInt(name) })
            }
          />
          <Input
            label="Annual Income"
            value={income.annualIncome.toString()}
            setValue={(name) =>
              setIncome({ ...income, annualIncome: parseInt(name) })
            }
          />
          <Input
            label="Yearly increase %"
            value={income.yearlyIncreasePercent.toString()}
            setValue={(name) =>
              setIncome({ ...income, yearlyIncreasePercent: parseInt(name) })
            }
          />
          <Input
            label="Retirement Age (year)"
            value={income.retirementAgeYear.toString()}
            setValue={(name) =>
              setIncome({ ...income, retirementAgeYear: parseInt(name) })
            }
          />
          <MonthPicker
            selected={income.retirementAgeMonth}
            setSelected={(i) =>
              setIncome({ ...income, retirementAgeMonth: i.id })
            }
          />
        </div>
      </div>
    </Section>
  );
};

export default EmploymentIncome;
