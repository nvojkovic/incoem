import { TrashIcon } from "@heroicons/react/24/outline";
import Section from "../Section";
import Select from "../Inputs/Select";
import Input from "../Inputs/Input";

interface Props {
  income: SocialSecurityIncome;
  people: Person[];
  setIncome: (income: SocialSecurityIncome) => void;
  remove: () => void;
}

const BasicAnnuity = ({
  people,
  remove,
  income: pension,
  setIncome,
}: Props) => {
  return (
    <div className="">
      <Section>
        <div className="flex-grow">
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 items-center justify-between">
              <div className="flex gap-4 items-center justify-start">
                <Select
                  options={people}
                  selected={people[pension.personId]}
                  setSelected={(i) => setIncome({ ...pension, personId: i.id })}
                  label="Person"
                />
                <Select
                  options={[
                    { name: "Automatic", id: "automatic" },
                    { name: "Manual", id: "manual" },
                  ]}
                  selected={{
                    name: (pension.calculationMethod as any).capitalize(),
                    id: pension.calculationMethod,
                  }}
                  setSelected={(i) =>
                    setIncome({ ...pension, calculationMethod: i.id })
                  }
                  label="Calculation Method"
                />
                <Input
                  label="Monthly PIA"
                  subtype="money"
                  value={pension.pia}
                  setValue={(name) => setIncome({ ...pension, pia: name })}
                />
                <Input
                  label="COLA"
                  subtype="percent"
                  value={pension.cola}
                  setValue={(name) => setIncome({ ...pension, pia: name })}
                />

                <Input
                  label="Already receiving"
                  subtype="toggle"
                  value={pension.alreadyReceiving}
                  setValue={(name) =>
                    setIncome({ ...pension, alreadyReceiving: name })
                  }
                />
                {!pension.alreadyReceiving && (
                  <Input
                    label="Start age month"
                    subtype="number"
                    value={pension.startAgeMonth}
                    setValue={(name) =>
                      setIncome({ ...pension, startAgeMonth: name })
                    }
                  />
                )}
                {!pension.alreadyReceiving && (
                  <Input
                    label="Start age year"
                    subtype="number"
                    value={pension.startAgeYear}
                    setValue={(name) =>
                      setIncome({ ...pension, startAgeYear: name })
                    }
                  />
                )}
              </div>
              <TrashIcon
                className="text-red-500 w-6 h-6 cursor-pointer"
                onClick={remove}
              />
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default BasicAnnuity;
