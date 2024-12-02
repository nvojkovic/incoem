import Select from "../Inputs/Select";
import Input from "../Inputs/Input";
import MonthPicker from "../Inputs/MonthPicker";
import { calculateAge } from "./PersonInfo";
import IncomeYearlyIncrease from "./IncomeYearlyIncrease";

interface Props {
  income: SocialSecurityIncome;
  people: Person[];
  setIncome: (income: SocialSecurityIncome) => void;
}

const BasicAnnuity = ({ people, income: pension, setIncome }: Props) => {
  const canRecieve =
    calculateAge(new Date(people[pension.personId].birthday)) >= 62;

  const handleStartAgeMonthChange = (month: { id: number }) => {
    setIncome({ ...pension, startAgeMonth: month.id || 0 }); // Set to 1 if blank or 0
  };
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
              <IncomeYearlyIncrease
                labels={false}
                customLabel="COLA"
                increase={
                  pension.yearlyIncrease || {
                    type: "custom",
                    percent: pension.cola,
                  }
                }
                setYearlyIncrease={(yearlyIncrease) =>
                  setIncome({ ...pension, yearlyIncrease })
                }
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
                  invalid={!!pension.startAgeYear && pension.startAgeYear > 100}
                  errorMessage="Start Age should be the age of the person, not the calendar year"
                  setValue={(name) =>
                    setIncome({ ...pension, startAgeYear: name })
                  }
                />
              )}
              {!pension.alreadyReceiving && (
                <MonthPicker
                  label="Start Age Month"
                  selected={pension.startAgeMonth} // Use 1 if startAgeMonth is 0 or undefined
                  setSelected={handleStartAgeMonthChange}
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
