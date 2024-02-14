import { ChangeEventHandler } from "react";

interface Props {
  label: string;
  value: string;
  disabled?: boolean;
  setValue: (value: string) => void;
}
const Input = ({ label, value, setValue, disabled = false }: Props) => {
  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
  };
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={label} className="text-sm text-[#344054]">
        {label}
      </label>
      <input
        type="text"
        disabled={disabled}
        className="rounded-lg border border-[#D0D5DD] px-3 py-2 disabled:bg-gray-100"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Input;
