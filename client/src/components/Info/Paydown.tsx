import { TrashIcon } from "@heroicons/react/24/outline";
import Section from "../Section";
import Select from "../Inputs/Select";
import Input from "../Inputs/Input";

interface Props {
  paydown: Paydown;
  people: Person[];
  setIncome: (income: Paydown) => void;
  remove: () => void;
}

const BasicAnnuity = ({ people, remove, paydown, setIncome }: Props) => {
  const options = [...people] as any[];
  if (people.length == 2) {
    options.push({ name: "Joint", id: -1 });
  }
  return (
    <div className="">
      <Section>
        <div className="flex-grow">
          <div className="flex  gap-4 items-center">
            <Select
              options={options}
              selected={
                paydown.personId == -1
                  ? { name: "Joint", id: -1 }
                  : people[paydown.personId]
              }
              setSelected={(i) => setIncome({ ...paydown, personId: i.id })}
              label="Person"
            />
            <Input
              label="Title"
              subtype="text"
              size="lg"
              value={paydown.name}
              setValue={(name) => setIncome({ ...paydown, name })}
            />
            <Input
              label="Start Amount"
              subtype="money"
              value={paydown.total}
              setValue={(name) => setIncome({ ...paydown, total: name })}
            />
            <Input
              label="Interest Rate"
              subtype="percent"
              value={paydown.interestRate}
              setValue={(name) => setIncome({ ...paydown, interestRate: name })}
            />
            <Select
              label="Payment Time"
              options={[
                { id: "beginning", name: "Beginning" },
                { id: "end", name: "End" },
              ]}
              selected={paydown.paymentInYear}
              setSelected={(i) =>
                setIncome({ ...paydown, paymentInYear: i.id })
              }
            />
            <Input
              label="Start Year"
              subtype="number"
              value={paydown.startYear}
              setValue={(name) => setIncome({ ...paydown, startYear: name })}
            />
            <Input
              label="Length (years)"
              subtype="number"
              value={paydown.length}
              setValue={(name) =>
                setIncome({
                  ...paydown,
                  length: parseInt(name),
                })
              }
            />
            <TrashIcon
              className="text-red-500 w-6 cursor-pointer"
              onClick={remove}
            />
          </div>
        </div>
      </Section>
    </div>
  );
};

export default BasicAnnuity;
