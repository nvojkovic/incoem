import Select from "./Select";
const months = [
  { name: " ", id: 0 },
  { name: "January", id: 1 },
  { name: "February", id: 2 },
  { name: "March", id: 3 },
  { name: "April", id: 4 },
  { name: "May", id: 5 },
  { name: "June", id: 6 },
  { name: "July", id: 7 },
  { name: "August", id: 8 },
  { name: "September", id: 9 },
  { name: "October", id: 10 },
  { name: "November", id: 11 },
  { name: "December", id: 12 },
];

interface MonthPickerProps {
  selected: number;
  setSelected: (id: any) => void;
  label?: string;
  errorMessage?: string | React.ReactElement;
  invalid?: boolean;
}

const MonthPicker = ({
  selected,
  setSelected,
  label,
  errorMessage,
  invalid,
}: MonthPickerProps) => {
  return (
    <Select
      invalid={invalid}
      errorMessage={errorMessage}
      label={label}
      options={months}
      selected={months.find((i) => i.id == selected) || null}
      setSelected={setSelected}
    />
  );
};

export default MonthPicker;
