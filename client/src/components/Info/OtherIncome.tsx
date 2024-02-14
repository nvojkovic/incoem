import { TrashIcon } from "@heroicons/react/24/outline";
import Section from "../Section";
import Select from "../Inputs/Select";
import Input from "../Inputs/Input";

interface Props {
  annuity: OtherIncome;
  people: Person[];
  setIncome: (income: OtherIncome) => void;
  remove: () => void;
}

const BasicAnnuity = ({
  people,
  remove,
  annuity: pension,
  setIncome,
}: Props) => {
  return (
    <div className="">
      <Section>
        <div className="flex-grow">
          <div className="flex  gap-4 mt-6 items-center">
            <Select
              options={[...people, { name: "Joint", id: -1 }]}
              selected={
                pension.personId == -1
                  ? { name: "Joint", id: -1 }
                  : people[pension.personId]
              }
              setSelected={(i) => setIncome({ ...pension, personId: i.id })}
              label="Person"
            />
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
                { name: "Quarterly", id: "quarterly" },
                { name: "Monthly", id: "monthly" },
                { name: "Semi-Annually", id: "semi-annually" },
                { name: "Annually", id: "annually" },
              ]}
              selected={{ name: pension.frequency, id: pension.frequency }}
              setSelected={(i) => setIncome({ ...pension, frequency: i.id })}
              label="Person"
            />
            <Input
              label="Start year"
              subtype="number"
              value={pension.startYear}
              setValue={(name) => setIncome({ ...pension, startYear: name })}
            />
            <Input
              label="End year"
              subtype="number"
              value={pension.endYear}
              setValue={(name) => setIncome({ ...pension, endYear: name })}
            />
            <Input
              label="Yearly increase"
              subtype="percent"
              value={pension.yearlyIncreasePercent}
              setValue={(name) =>
                setIncome({ ...pension, yearlyIncreasePercent: name })
              }
            />
            <Input
              label="Survivor"
              subtype="percent"
              value={pension.survivorPercent}
              setValue={(name) =>
                setIncome({ ...pension, survivorPercent: name })
              }
            />
            <Input
              label="First-Year Prorate"
              subtype="percent"
              value={pension.firstYearProRatePercent}
              setValue={(name) =>
                setIncome({
                  ...pension,
                  firstYearProRatePercent: name,
                })
              }
            />
            <TrashIcon
              className="text-red-500 w-6 h-6 cursor-pointer"
              onClick={remove}
            />
          </div>
        </div>
      </Section>
    </div>
  );
};

export default BasicAnnuity;
