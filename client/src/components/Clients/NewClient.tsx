import { PlusIcon } from "@heroicons/react/24/solid";
import Button from "../Inputs/Button";
import { useState } from "react";
import Modal from "../Modal";
import Input from "../Inputs/Input";
import userImg from "../../assets/user.png";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { updateAtIndex } from "../../utils";
import { createClient } from "../../services/client";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../useUser";

const PersonInfo = ({
  person,
  onChange,
}: {
  person: Person;
  onChange: (updated: Person) => void;
}) => {
  if (!person) return <div className="h-20"></div>;
  return (
    <div className="flex gap-5 my-8">
      <Input
        label="First Name"
        value={person.name}
        vertical
        subtype="text"
        size="lg"
        setValue={(name) => onChange({ ...person, name })}
      />
      <Input
        label="Birthday"
        subtype="date"
        size="lg"
        vertical
        value={person.birthday}
        setValue={(birthday) => onChange({ ...person, birthday })}
      />
    </div>
  );
};
const initializeNewClient = (user: User | null): Client => ({
  id: 1,
  title: "",
  createdAt: new Date().toISOString(),
  data: {
    incomes: [],
    people: [
      { name: "", birthday: null as any, id: 0 },
      { name: "", birthday: null as any, id: 1 },
    ],
    version: 1,
  },
  scenarios: [],
  needsFlag: !!user?.info?.needsFlag,
  stabilityRatioFlag: !!user?.info?.stabilityRatioFlag,
  spending: {
    preTaxRate: 0,
    postTaxRate: 0,
    retirementYear: new Date().getFullYear(),
  } as RetirementSpendingSettings,
  calculators: {},
  allInOneCalculator: [],
  versatileCalculator: {},
  liveSettings: {
    id: -1,
    name: "",
    inflation: user?.info?.globalInflation,
    maxYearsShown: user?.info?.globalYearsShown,
    ssSurvivorAge: [],
    whoDies: -1,
    taxType: "Pre-Tax",
    inflationType: "Nominal",
    data: {} as any,
    deathYears: [
      user?.info?.globalLifeExpectancy,
      user?.info?.globalLifeExpectancy,
    ],
  } as ScenarioSettings,
});

const NewClient = () => {
  const [step, setStep] = useState(1);
  const [newOpen, setNewOpen] = useState(false);
  const { user } = useUser();
  const [client, setClient] = useState<Client>(() => initializeNewClient(user));
  const navigate = useNavigate();
  const addClient = async () => {
    const d = await createClient(client as any);
    const js = await d.json();
    setNewOpen(false);
    setClient(initializeNewClient(user));
    setStep(1);
    // await updateClients();
    navigate(`/client/${js.data.id}/income`);
  };
  const cancel = () => {
    setNewOpen(false);
    setClient(initializeNewClient(user));
    setStep(1);
  };

  const Step1 = (
    <div className="">
      <div className="flex gap-8">
        <Input
          label="Household name"
          value={client.title}
          setValue={(title) => setClient((prev) => ({ ...prev, title }))}
          vertical
          width="!w-[200px]"
          placeholder="e.g. John and Katie"
        />
        <div className="w-full">
          <Input
            subtype="toggle"
            vertical
            label="Single mode"
            value={client.data.people.length === 1}
            setValue={(singleMode) => {
              setClient((prev) => ({
                ...prev,
                data: {
                  ...prev.data,
                  people: singleMode
                    ? [prev.data.people[0]]
                    : [
                        ...prev.data.people,
                        { name: "", birthday: null, id: 1 },
                      ],
                },
              }));
            }}
          />
        </div>
      </div>
      <div>
        {client.data.people.map((person, i) => (
          <PersonInfo
            person={person}
            key={i}
            onChange={(updated) => {
              setClient((prev) => ({
                ...prev,
                data: {
                  ...prev.data,
                  people: updateAtIndex(prev.data.people, i, updated),
                },
              }));
            }}
          />
        ))}
        {client.data.people.length === 1 && <div className="h-[69px]"></div>}
      </div>
    </div>
  );

  const Step2 = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          subtype="number"
          label="Inflation (%)"
          value={client.liveSettings.inflation}
          setValue={(inflation) =>
            setClient((prev) => ({
              ...prev,
              liveSettings: { ...prev.liveSettings, inflation }
            }))
          }
          vertical
        />
        <Input
          subtype="number"
          label="Years Shown"
          value={client.liveSettings.maxYearsShown}
          setValue={(maxYearsShown) =>
            setClient((prev) => ({
              ...prev,
              liveSettings: { ...prev.liveSettings, maxYearsShown }
            }))
          }
          vertical
        />
        <Input
          subtype="number"
          label="Pre-Tax Rate (%)"
          value={client.spending.preTaxRate}
          setValue={(preTaxRate) =>
            setClient((prev) => ({
              ...prev,
              spending: { ...prev.spending, preTaxRate }
            }))
          }
          vertical
        />
        <Input
          subtype="number"
          label="Post-Tax Rate (%)"
          value={client.spending.postTaxRate}
          setValue={(postTaxRate) =>
            setClient((prev) => ({
              ...prev,
              spending: { ...prev.spending, postTaxRate }
            }))
          }
          vertical
        />
      </div>
      <Input
        subtype="number"
        label="Retirement Year"
        value={client.spending.retirementYear}
        setValue={(retirementYear) =>
          setClient((prev) => ({
            ...prev,
            spending: { ...prev.spending, retirementYear }
          }))
        }
        vertical
      />
      <div className="pt-4">
        <Input
          subtype="toggle"
          label="Stability Ratio"
          value={client.stabilityRatioFlag}
          setValue={(flag) =>
            setClient((prev) => ({ ...prev, stabilityRatioFlag: flag }))
          }
        />
        <Input
          subtype="toggle"
          label="Spending"
          value={client.needsFlag}
          setValue={(flag) => setClient((prev) => ({ ...prev, needsFlag: flag }))}
        />
      </div>
    </div>
  );

  return (
    <>
      <Modal isOpen={newOpen} onClose={cancel}>
        <div className="min-w-[500px]">
          <div className="flex justify-between items-center mr-2 mb-6">
            <div className="flex gap-5">
              <div className="w-[48px] h-[48px] border-[#EAECF0] border rounded-md flex items-center justify-center">
                <img src={userImg} alt="user" className="h-6 w-6 mx-auto" />
              </div>
              <div className="flex flex-col items-start ">
                <div className="font-semibold text-[18px] mb-1">
                  Add new client
                </div>
                <div className="text-[14px] text-[#475467]">
                  {step == 1
                    ? "Please enter a name for this client."
                    : "Please enter the details of the people in this household."}
                </div>
              </div>
            </div>
            <div>
              <XMarkIcon className="h-6 w-6 cursor-pointer" onClick={cancel} />
            </div>
          </div>
          {step === 1 ? Step1 : Step2}

          <div className="flex gap-4 justify-between mt-6">
            <Button
              type="secondary"
              onClick={() => (step == 1 ? cancel() : setStep(1))}
            >
              <div className="px-4 text-center">
                {step == 1 ? "Cancel" : "Back"}
              </div>
            </Button>
            <Button
              type="primary"
              disabled={
                (step === 1 &&
                  (!client.title ||
                    !client.data.people.every((p) => p.name && p.birthday))) ||
                (step === 2 &&
                  !client.data.people.every((p) => p.name && p.birthday))
              }
              onClick={() => (step == 1 ? setStep(2) : addClient())}
            >
              <div className="px-4 text-center">
                {step == 1 ? "Next" : "Confirm"}
              </div>
            </Button>
          </div>
        </div>
      </Modal>
      <Button type="primary" onClick={() => setNewOpen(true)}>
        <div className="flex items-center">
          <PlusIcon className="h-5 w-5" />
          <div>Add new client</div>
        </div>
      </Button>
    </>
  );
};

export default NewClient;
