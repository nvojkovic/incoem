import Input from "../Inputs/Input";
import Section from "../Section";

interface Props {
  title: string;
  subtitle: string;
  person: Person;
  setPerson: (person: Person) => void;
}

const PersonInfo = ({ title, person, setPerson }: Props) => {
  return (
    <Section>
      <div className="">
        <div className="flex flex-col pb-6 border-b border-[#EAECF0]">
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
        </div>
      </div>
    </Section>
  );
};

export default PersonInfo;
