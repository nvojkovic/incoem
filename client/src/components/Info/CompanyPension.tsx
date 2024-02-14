import { TrashIcon } from "@heroicons/react/24/outline";
import Section from "../Section";
import Select from "../Inputs/Select";
import Input from "../Inputs/Input";
import Toggle from "../Inputs/Toggle";
import { useState } from "react";
import Button from "../Inputs/Button";

interface Props {
  pension: CompanyPension;
  people: Person[];
  setIncome: (income: CompanyPension) => void;
  remove: () => void;
}

const CompanyPension = ({ people, remove, pension, setIncome }: Props) => {
  const [startAgeEnabled, setStartAgeEnabled] = useState(false);
  return (
    <div className="">
      <Section>
        <div className="flex-grow">
          <div className="flex flex-col pb-6 border-b border-[#EAECF0]">
            <div className="font-semibold text-lg flex justify-between">
              <Select
                options={[...people, { name: "Joint", id: -1 }]}
                selected={
                  pension.personId == -1
                    ? { name: "Joint", id: -1 }
                    : people[pension.personId]
                }
                setSelected={(i) => setIncome({ ...pension, personId: i.id })}
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
              label="Annual amount"
              value={pension.annualAmount.toString()}
              setValue={(name) =>
                setIncome({ ...pension, startAge: parseInt(name) })
              }
            />
            <Input
              label="Survivor %"
              value={pension.survivorPercent.toString()}
              setValue={(name) =>
                setIncome({ ...pension, survivorPercent: parseInt(name) })
              }
            />
            <Input
              label="Yearly increase %"
              value={pension.yearlyIncreasePercent.toString()}
              setValue={(name) =>
                setIncome({ ...pension, yearlyIncreasePercent: parseInt(name) })
              }
            />
            <div className="flex items-center flex-grow justify-between gap-6">
              <div className="flex-grow">
                <Input
                  label="Start Age"
                  disabled={!startAgeEnabled}
                  value={pension.startAge?.toString() || ""}
                  setValue={(name) =>
                    setIncome({ ...pension, startAge: parseInt(name) })
                  }
                />
              </div>
              <div className="mt-5">
                <Toggle
                  enabled={startAgeEnabled}
                  setEnabled={() => setStartAgeEnabled(!startAgeEnabled)}
                />
              </div>
            </div>
            <Input
              label="First-Year Pro-Rate %"
              value={pension.firstYearProRatePercent.toString()}
              setValue={(name) =>
                setIncome({
                  ...pension,
                  firstYearProRatePercent: parseInt(name),
                })
              }
            />
          </div>
        </div>
      </Section>
    </div>
  );
};

export default CompanyPension;
