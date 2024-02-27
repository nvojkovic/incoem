import Input from "../Inputs/Input";
import MonthPicker from "../Inputs/MonthPicker";
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
      <div className="flex-grow">
        <div className="flex flex-col pb-6 border-b border-[#EAECF0]">
          <div className="font-semibold text-lg">{title}</div>
        </div>
        <div className="flex gap-4 mt-6">
          <Input
            label="First Name"
            value={person.name}
            size="lg"
            subtype="text"
            setValue={(name) => setPerson({ ...person, name })}
          />
          <Input
            label="Birth Year"
            subtype="date"
            size="lg"
            value={person.birthYear}
            setValue={(birthYear) =>
              setPerson({ ...person, birthYear: parseInt(birthYear) })
            }
          />
          <MonthPicker
            label="Birth Month"
            selected={person.birthMonth}
            setSelected={(i) => setPerson({ ...person, birthMonth: i.id })}
          />
        </div>
      </div>
    </Section>
  );
};

export default PersonInfo;
