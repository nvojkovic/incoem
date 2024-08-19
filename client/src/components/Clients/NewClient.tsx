import { PlusIcon } from "@heroicons/react/24/solid";
import Button from "../Inputs/Button";
import { useState } from "react";
import Modal from "../Modal";
import Input from "../Inputs/Input";
import Toggle from "../Inputs/Toggle";
import user from "../../assets/user.png";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { updateAtIndex } from "../../utils";
import { createClient } from "../../services/client";
import { useNavigate } from "react-router-dom";

const PersonInfo = ({ person, setPerson }: any) => {
  return (
    <div className="flex gap-5 my-8">
      <Input
        label="First Name"
        value={person.name}
        vertical
        subtype="text"
        size="lg"
        setValue={(name) => setPerson({ ...person, name })}
      />
      <Input
        label="Birthday"
        subtype="date"
        size="lg"
        vertical
        value={person.birthday}
        setValue={(birthday) => setPerson({ ...person, birthday })}
      />
    </div>
  );
};
const newPerson = (id: number) => ({
  name: "",
  birthday: null as any,
  id,
});

const NewClient = () => {
  const [step, setStep] = useState(1);
  const [newOpen, setNewOpen] = useState(false);
  const [people, setPeople] = useState<Person[]>([newPerson(0), newPerson(1)]);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const addClient = async () => {
    const client = {
      id: 1,
      title: name,
      createdAt: new Date().toISOString(),
      data: {
        incomes: [],
        people: people,
        version: 1 as const,
      },
      scenarios: [],
    };
    const d = await createClient(client);
    const js = await d.json();
    setNewOpen(false);
    setName("");
    setPeople([newPerson(0)]);
    setStep(1);
    // await updateClients();
    navigate(`/client/${js.data.id}`);
  };
  const cancel = () => {
    setNewOpen(false);
    setName("");
    setPeople([newPerson(0), newPerson(1)]);
    setStep(1);
  };

  const Step1 = (
    <div className="flex gap-8">
      <div className="flex mb-6 mt-6">
        <Input
          label="Household name"
          value={name}
          setValue={setName}
          size="full"
          vertical
          placeholder="e.g. John and Katie"
        />
      </div>
      <div className="flex flex-col mb-6 mt-6 gap-3 justify-start items-start">
        <div className="text-sm text-[#344054]">Single mode</div>
        <Toggle
          enabled={people.length == 1}
          setEnabled={(b) => {
            if (b) {
              setPeople([people[0]]);
            } else {
              setPeople([people[0], newPerson(1)]);
            }
          }}
        />
      </div>
    </div>
  );

  const Step2 = people.map((item, i) => (
    <PersonInfo
      person={item}
      key={i}
      setPerson={(person: any) =>
        setPeople((prev) => updateAtIndex(prev, i, person))
      }
    />
  ));

  return (
    <>
      <Modal isOpen={newOpen} onClose={cancel}>
        <div className="min-w-[500px]">
          <div className="flex justify-between items-center mr-2 mb-6">
            <div className="flex gap-5">
              <div className="w-[48px] h-[48px] border-[#EAECF0] border rounded-md flex items-center justify-center">
                <img src={user} alt="user" className="h-6 w-6 mx-auto" />
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
                (step == 1 && !name) ||
                (step == 2 && !people.every((i) => i.name && i.birthday))
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
