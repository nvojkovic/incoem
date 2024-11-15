import { useInfo } from "../../useData";
import Input from "../Inputs/Input";
import Select from "../Inputs/Select";

interface Props {
  title: string;
  subtitle: string;
  person: Person;
}
export function calculateAge(birthday: Date) {
  // birthday is a date
  var ageDifMs = Date.now() - (birthday as any);
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

const PersonInfo = ({ title, person }: Props) => {
  const { setPerson } = useInfo();
  return (
    <div className="shadow-md w-full bg-white p-6 rounded-lg">
      <div className="">
        <div className="flex flex-col pb-6 border-b border-[#EAECF0] ">
          <div className="font-semibold text-lg">{title}</div>
        </div>
        <div className="flex flex-col gap-4 mt-6">
          <Input
            label="First Name"
            value={person.name}
            size="lg"
            subtype="text"
            setValue={(name) => setPerson({ ...person, name })}
          />
          <Input
            label="Birthday"
            subtype="date"
            size="lg"
            value={person.birthday}
            setValue={(birthday) => setPerson({ ...person, birthday })}
          />
          <Select
            label="Timing"
            width="!w-44"
            labelLength={140}
            options={[
              { id: "Male", name: "Male" },
              { id: "Female", name: "Female" },
            ]}
            selected={{ id: person.sex, name: person.sex }}
            setSelected={(option) => setPerson({ ...person, sex: option.id })}
          />
          <Input
            label="Age"
            subtype="text"
            size="lg"
            value={calculateAge(new Date(person.birthday))}
            setValue={(_) => { }}
            disabled
          />
        </div>
      </div>
    </div>
  );
};

export const PeopleInfo = () => {
  const { data, setTitle } = useInfo();

  return (
    <div className="flex gap-6">
      <div className="shadow-md w-full bg-white p-6 rounded-lg">
        <div className="h-full">
          <div className="flex flex-col pb-6 border-b border-[#EAECF0] ">
            <div className="font-semibold text-lg">Household</div>
          </div>
          <div className="flex flex-col gap-4 mt-6">
            <Input
              label="Household Name"
              value={data.title}
              size="lg"
              subtype="text"
              setValue={(name) => setTitle(name)}
            />
          </div>
        </div>
      </div>
      {data.data.people.map((person, i) => (
        <PersonInfo
          title={`Person ${i + 1}`}
          key={i}
          subtitle="Details about how this works"
          person={person}
        />
      ))}
    </div>
  );
};

export default PersonInfo;
