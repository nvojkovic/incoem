import Input from "../Inputs/Input";
import Section from "../Section";

interface Props {
  title: string;
  subtitle: string;
  person: Person;
  setPerson: (person: Person) => void;
}

const PersonInfo = ({ title, subtitle, person, setPerson }: Props) => {
  return (
    <Section>
      <div className="flex-grow">
        <div className="flex flex-col pb-6 border-b border-[#EAECF0]">
          <div className="font-semibold text-lg">{title}</div>
          <div className="text-[#475467] text-sm">{subtitle}</div>
        </div>
        <div className="flex flex-col gap-4 mt-6">
          <Input
            label="First Name"
            value={person.name}
            setValue={(name) => setPerson({ ...person, name })}
          />
          <Input
            label="Birth Year"
            value={person.birthYear.toString()}
            setValue={(birthYear) =>
              setPerson({ ...person, birthYear: parseInt(birthYear) })
            }
          />
        </div>
      </div>
    </Section>
  );
};

export default PersonInfo;
