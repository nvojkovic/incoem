import { TrashIcon } from "@heroicons/react/24/outline";
import Section from "../Section";
import Select from "../Inputs/Select";
import Input from "../Inputs/Input";

interface Props {
  pension: CompanyPension;
  people: Person[];
  setIncome: (income: CompanyPension) => void;
  remove: () => void;
}

const CompanyPension = ({ people, remove, pension, setIncome }: Props) => {
  return (
    <div className="">
      <Section>
        <div className="flex-grow">
          <div className="flex gap-4 items-center">
            <Select
              options={[...people]}
              selected={people[pension.personId]}
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
              label="Annual amount"
              subtype="money"
              value={pension.annualAmount}
              setValue={(name) => setIncome({ ...pension, annualAmount: name })}
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
            <button>
              <TrashIcon
                className="text-red-500 w-6 cursor-pointer"
                onClick={remove}
              />
            </button>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default CompanyPension;
