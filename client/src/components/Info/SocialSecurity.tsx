import Select from "../Inputs/Select";
import Input from "../Inputs/Input";
import MonthPicker from "../Inputs/MonthPicker";

interface Props {
  income: SocialSecurityIncome;
  people: Person[];
  setIncome: (income: SocialSecurityIncome) => void;
}

const BasicAnnuity = ({ people, income: pension, setIncome }: Props) => {
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
              {pension.calculationMethod == "manual" && (
                <Input
                  label="Monthly PIA"
                  subtype="money"
                  value={pension.pia}
                  setValue={(name) => setIncome({ ...pension, pia: name })}
                  tooltip="Primary Insurance Amount"
                />
              )}
              {pension.calculationMethod == "automatic" && (
                <Input
                  label="Annual amount"
                  subtype="money"
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
                tooltip="Cost of Living Adjustment"
                value={pension.cola}
                setValue={(name) => setIncome({ ...pension, cola: name })}
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
                <MonthPicker
                  label="Start age month"
                  selected={pension.startAgeMonth}
                  setSelected={(name) =>
                    setIncome({ ...pension, startAgeMonth: name.id })
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
          </div>
        </div>
      </div>
    </>
  );
};

export default BasicAnnuity;
