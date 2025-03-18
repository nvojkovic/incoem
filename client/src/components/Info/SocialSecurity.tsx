import Select from "../Inputs/Select";
import Input from "../Inputs/Input";
import MonthPicker from "../Inputs/MonthPicker";
import { calculateAge } from "./PersonInfo";
import IncomeYearlyIncrease from "./IncomeYearlyIncrease";
import { monthsToFullRetirement } from "src/calculator/utils";
import { Person, SocialSecurityIncome } from "src/types";

interface Props {
  income: SocialSecurityIncome;
  people: Person[];
  setIncome: (income: SocialSecurityIncome) => void;
}

const SocialSecurity = ({ people, income: pension, setIncome }: Props) => {
  const canRecieve =
    calculateAge(new Date(people[pension.personId].birthday)) >= 62;

  const handleStartAgeMonthChange = (month: { id: number }) => {
    setIncome({ ...pension, startAgeMonth: month.id || 0 }); // Set to 1 if blank or 0
  };

  const amount = pension.amount
    ? pension.amount
    : { value: pension.annualAmount, type: "yearly" };

  const overage = monthsToFullRetirement(
    people[pension.personId].birthday,
    pension.startAgeYear,
    pension.startAgeMonth,
  );
  const invalid = overage < -60 && !!pension.startAgeYear;
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
              <Input
                label="Title"
                subtype="text"
                size="lg"
                value={pension.name}
                setValue={(name) => setIncome({ ...pension, name })}
              />
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
                  label="Amount"
                  subtype="mo/yr"
                  size="lg"
                  value={amount}
                  tooltip="Amount"
                  setValue={(name) => setIncome({ ...pension, amount: name })}
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
                  label="Start Age"
                  subtype="number"
                  size="lg"
                  value={pension.startAgeYear}
                  invalid={!!pension.startAgeYear && pension.startAgeYear > 100}
                  errorMessage="Start Age should be the age of the person, not the calendar year"
                  setValue={(startAgeYear) =>
                    setIncome({ ...pension, startAgeYear })
                  }
                />
              )}
              {!pension.alreadyReceiving && (
                <MonthPicker
                  label="Start Month"
                  errorMessage={
                    <div className="w-32">
                      Start month must be after {people[pension.personId].name}
                      's 62nd birthday.
                    </div>
                  }
                  invalid={invalid}
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

export default SocialSecurity;
