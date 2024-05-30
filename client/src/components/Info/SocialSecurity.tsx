import Select from "../Inputs/Select";
import Input from "../Inputs/Input";
import MonthPicker from "../Inputs/MonthPicker";
import { calculateAge } from "./PersonInfo";

interface Props {
  income: SocialSecurityIncome;
  people: Person[];
  setIncome: (income: SocialSecurityIncome) => void;
}

const BasicAnnuity = ({ people, income: pension, setIncome }: Props) => {
  const canRecieve =
    calculateAge(new Date(people[pension.personId].birthday)) >= 62;
  return (
    <>
      <div className="flex-grow">
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 items-center justify-between">
            <div className="flex flex-col gap-4 justify-start">
              {people.length > 1 && (
                <Select
                  options={people}
                  selected={people[pension.personId]}
                  setSelected={(i) => setIncome({ ...pension, personId: i.id })}
                  label="Person"
                />
              )}
              <Select
                options={[
                  { name: "Manual", id: "manual" },
                  { name: "PIA", id: "pia" },
                ]}
                selected={{
                  name: pension.calculationMethod === "pia" ? "PIA" : "Manual",
                  id: pension.calculationMethod,
                }}
                setSelected={(i) =>
                  setIncome({ ...pension, calculationMethod: i.id })
                }
                label="Calculation Method"
              />
              {pension.calculationMethod == "pia" && (
                <Input
                  label="Monthly PIA"
                  subtype="money"
                  size="lg"
                  value={pension.pia}
                  setValue={(name) => setIncome({ ...pension, pia: name })}
                  tooltip="Primary Insurance Amount"
                />
              )}
              {pension.calculationMethod == "manual" && (
                <Input
                  label="Annual Amount"
                  subtype="money"
                  size="lg"
                  value={pension.annualAmount}
                  tooltip="Annual amount"
                  setValue={(name) =>
                    setIncome({ ...pension, annualAmount: name })
                  }
                />
              )}
              <Input
                label="COLA"
                subtype="percent"
                size="lg"
                tooltip="Cost of Living Adjustment"
                value={pension.cola}
                setValue={(name) => setIncome({ ...pension, cola: name })}
              />

              {pension.calculationMethod === "manual" && (
                <Input
                  label="Already Receiving"
                  subtype="toggle"
                  size="lg"
                  tooltip="Person must be at least 62 years old"
                  value={pension.alreadyReceiving}
                  setValue={(name) =>
                    canRecieve &&
                    setIncome({ ...pension, alreadyReceiving: name })
                  }
                />
              )}
              {!pension.alreadyReceiving && (
                <Input
                  label="Start Age Year"
                  subtype="number"
                  size="lg"
                  value={pension.startAgeYear}
                  setValue={(name) =>
                    setIncome({ ...pension, startAgeYear: name })
                  }
                />
              )}
              {!pension.alreadyReceiving && (
                <MonthPicker
                  label="Start Age Month"
                  selected={pension.startAgeMonth}
                  setSelected={(name) =>
                    setIncome({ ...pension, startAgeMonth: name.id })
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BasicAnnuity;
