import { useInfo } from "../../useData";
import Input from "../Inputs/Input";
import Select from "../Inputs/Select";

interface Props {
  subtitle: string;
  person: Person;
}
export function calculateAge(birthday: Date) {
  // birthday is a date
  var ageDifMs = Date.now() - (birthday as any);
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export const PersonInfo = ({ person }: Props) => {
  const { setPerson } = useInfo();
  return (
    <div className="flex flex-col pb-6 border-b border-[#EAECF0] ">
      <div className="flex flex-col gap-4 mt-6">
        <Input
          label="First Name"
          width="!w-40"
          labelLength={100}
          value={person.name}
          size="lg"
          subtype="text"
          setValue={(name) => setPerson({ ...person, name })}
        />
        <Input
          label="Birthday"
          subtype="date"
          width="!w-40"
          labelLength={100}
          size="lg"
          value={person.birthday}
          setValue={(birthday) => setPerson({ ...person, birthday })}
        />
        <Select
          label="Sex"
          width="!w-40"
          labelLength={100}
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
          labelLength={100}
          width="!w-40"
          value={calculateAge(new Date(person.birthday))}
          setValue={(_) => { }}
          disabled
        />
      </div>
    </div>
  );
};

export const PeopleInfo = () => {
  const { data, setField } = useInfo();

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
              setValue={setField("title")}
            />
          </div>
        </div>
      </div>
      {data.data.people.map((person, i) => (
        <PersonInfo
          key={i}
          subtitle="Details about how this works"
          person={person}
        />
      ))}
    </div>
  );
};

export default PersonInfo;
