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
import { useUser } from "../../hooks/useUser";
import Select from "../Inputs/Select";
import {
  Client,
  Person,
  RetirementSpendingSettings,
  ScenarioSettings,
  User,
} from "src/types";
import { initialVersatileSettings } from "src/components/Calculators/Versatile/versatileTypes";

const PersonInfo = ({
  person,
  onChange,
}: {
  person: Person;
  onChange: (updated: Person) => void;
}) => {
  if (!person) return <div className="h-20"></div>;
  return (
    <div className="flex flex-col gap-5 my-8 w-full">
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
      <Select
        label="Sex"
        vertical
        options={[
          { id: "Male", name: "Male" },
          { id: "Female", name: "Female" },
        ]}
        selected={{ id: person.sex, name: person.sex }}
        setSelected={(option) => onChange({ ...person, sex: option.id })}
      />
    </div>
  );
};
const initializeNewClient = (user: User | null): Client => ({
  id: undefined as any,
  title: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  incomes: [],
  people: [
    { name: "", birthday: null as any, id: 0 },
    { name: "", birthday: null as any, id: 1 },
  ],
  scenarios: [],
  needsFlag: !!user?.info?.needsFlag,
  stabilityRatioFlag: !!user?.info?.stabilityRatioFlag,
  longevityFlag: !!user?.info?.longevityFlag,
  taxesFlag: !!user?.info?.taxesFlag,
  assetSummary: {
    debts: [],
    income: [],
    socialInsurance: [
      {
        owner: 0,
        id: crypto.randomUUID(),
      },
      {
        owner: 1,
        id: crypto.randomUUID(),
      },
    ] as any,
    hardAssets: [],
    cashAssets: [],
    statementWealth: [],
    inheritance: [],
    lifeInsurance: [],
    longTermCare: [],
    accumulationAnnuity: [],
    personalPensionAnnuity: [],
    pension: [],
  },
  spending: {
    preTaxRate: user?.info?.globalPreRetirementTaxRate,
    postTaxRate: user?.info?.globalPostRetirementTaxRate,
    retirementYear: undefined as unknown as number,
    preSpending: [],
    postSpending: [],
    yearlyIncrease: { type: "general" },
    newCurrentSpending: { type: "yearly", value: 0 },
    currentSpending: 0,
    decreaseAtDeath: [0, 0],
  } as RetirementSpendingSettings,
  allInOneCalculator: [],
  versatileCalculator: initialVersatileSettings,
  versatileCalculators: [],
  liveSettings: {
    id: -1,
    name: "",
    inflation: user?.info?.globalInflation,
    maxYearsShown: user?.info?.globalYearsShown,
    ssSurvivorAge: [],
    whoDies: -1,
    taxType: "Pre-Tax",
    inflationType: "Nominal",
    incomes: [],
    people: [],
    longevityPercent: 50,
    chartType: "income",
    deathYears: [
      user?.info?.globalLifeExpectancy,
      user?.info?.globalLifeExpectancy,
    ],
    mapType: "result",
    monthlyYearly: "yearly",
  } as ScenarioSettings,
  reportSettings: user?.info?.globalReportSettings || [],
});

const NewClient = () => {
  const [step, setStep] = useState(1);
  const [newOpen, setNewOpen] = useState(false);
  const { user } = useUser();
  const [client, setClient] = useState<Client>(() => initializeNewClient(user));
  const navigate = useNavigate();
  const addClient = async () => {
    const d = await createClient(client);
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
            value={client.people.length === 1}
            setValue={(singleMode) => {
              setClient({
                ...client,
                people: singleMode
                  ? [client.people[0]]
                  : [
                      ...client.people,
                      { name: "", birthday: null as any, id: 1 },
                    ],
                assetSummary: {
                  ...client.assetSummary,
                  socialInsurance: client.assetSummary.socialInsurance.map(
                    (item) => ({
                      ...item,
                      owner: singleMode ? 0 : item.owner,
                      id: crypto.randomUUID(),
                    }),
                  ),
                },
              });
            }}
          />
        </div>
      </div>
      <div className="flex justify-between">
        {client.people.map((person, i) => (
          <PersonInfo
            person={person}
            key={i}
            onChange={(updated) => {
              setClient((prev) => ({
                ...prev,
                people: updateAtIndex(prev.people, i, updated),
              }));
            }}
          />
        ))}
        {client.people.length === 1 && <div className="h-[69px]"></div>}
      </div>
    </div>
  );

  const Step2 = (
    <div className="space-y-4">
      <div className="border-b text-left font-semibold pb-1">
        Live Settings
        <span className="text-gray-400 text-sm italic font-normal inline-block ml-3">
          (These fields are optional)
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          subtype="percent"
          label="Inflation (%)"
          value={client.liveSettings.inflation}
          setValue={(inflation) =>
            setClient((prev) => ({
              ...prev,
              liveSettings: { ...prev.liveSettings, inflation },
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
              liveSettings: { ...prev.liveSettings, maxYearsShown },
            }))
          }
          vertical
        />
        {client.people.map((item, i) => (
          <Input
            subtype="number"
            label={`${item.name}'s Mortality`}
            value={client.liveSettings.deathYears[i]}
            setValue={(e) =>
              setClient((prev) => ({
                ...prev,
                liveSettings: {
                  ...prev.liveSettings,
                  deathYears: updateAtIndex(
                    prev.liveSettings.deathYears,
                    i,
                    parseInt(e),
                  ),
                },
              }))
            }
            vertical
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          subtype="percent"
          label="Pre-Retirement Tax Rate (%)"
          value={client.spending.preTaxRate}
          setValue={(preTaxRate) =>
            setClient((prev) => ({
              ...prev,
              spending: { ...prev.spending, preTaxRate },
            }))
          }
          vertical
        />
        <Input
          subtype="percent"
          label="Post-Retirement Tax Rate (%)"
          value={client.spending.postTaxRate}
          setValue={(postTaxRate) =>
            setClient((prev) => ({
              ...prev,
              spending: { ...prev.spending, postTaxRate },
            }))
          }
          vertical
        />
        <Input
          subtype="number"
          label="Retirement Year"
          value={client.liveSettings.retirementYear}
          setValue={(retirementYear) =>
            setClient((prev) => ({
              ...prev,
              liveSettings: { ...prev.liveSettings, retirementYear },
            }))
          }
          vertical
        />
      </div>
      <div className="border-b text-left font-semibold pb-1">
        Extra Features
      </div>
      <div className="grid grid-cols-2 gap-x-4 w-[380px]">
        <Input
          subtype="toggle"
          labelLength={110}
          label="Stability Ratio"
          value={client.stabilityRatioFlag}
          setValue={(flag) =>
            setClient((prev) => ({ ...prev, stabilityRatioFlag: flag }))
          }
        />
        <Input
          subtype="toggle"
          labelLength={110}
          label="Spending"
          value={client.needsFlag}
          setValue={(flag) =>
            setClient((prev) => ({ ...prev, needsFlag: flag }))
          }
        />
        <Input
          subtype="toggle"
          labelLength={110}
          label="Longevity"
          value={client.longevityFlag}
          setValue={(flag) =>
            setClient((prev) => ({ ...prev, longevityFlag: flag }))
          }
        />
        <Input
          subtype="toggle"
          labelLength={110}
          label="Taxes"
          value={client.taxesFlag}
          setValue={(flag) =>
            setClient((prev) => ({ ...prev, taxesFlag: flag }))
          }
        />
      </div>
    </div>
  );

  const firstStepFilled =
    client.title && client.people.every((p) => p.name && p.birthday && p.sex);

  return (
    <>
      <Modal isOpen={newOpen} onClose={cancel}>
        <div className="min-w-[500px]">
          <div className="flex justify-between items-center mr-2 mb-6">
            <div className="flex gap-5">
              <div className="w-[48px] h-[48px] border-[#EAECF0] border rounded-md flex items-center justify-center">
                <img src={userImg} alt="user" className="h-6 w-6 mx-auto" />
              </div>
              <div className="flex items-center ">
                <div className="font-semibold text-[18px]">Add new client</div>
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
                (step === 1 && !firstStepFilled) ||
                (step === 2 &&
                  !client.people.every((p) => p.name && p.birthday))
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
