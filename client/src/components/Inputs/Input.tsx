import Toggle from "./Toggle";
import CurrencyInput from "react-currency-input-field";

interface Props {
  label: string;
  value: any;
  disabled?: boolean;
  toggleable?: boolean;
  placeholder?: string;
  subtype?: "money" | "percent" | "text" | "number" | "date" | "toggle";
  size?: "sm" | "md" | "lg" | "full";
  setValue: (value: any) => void;
}
const calcSize = (s: any) => {
  if (s == "sm") return "w-28";
  if (s == "md") return "w-36";
  if (s == "lg") return "w-48";
  if (s == "full") return "w-full";
};
const Input = ({
  subtype = "text",
  size = "sm",
  placeholder,
  label,
  value,
  toggleable = false,
  setValue,
  disabled = false,
}: Props) => {
  let input = null as any;
  const basic =
    "focus:outline-none focus:border-[#FF6C47] focus:ring-1 focus:ring-[#FF6C47] rounded-lg border border-[#D0D5DD] px-3 py-2 disabled:bg-gray-100";
  if (subtype === "money") {
    input = (
      <CurrencyInput
        prefix="$"
        defaultValue={value}
        decimalsLimit={2}
        disabled={disabled}
        className={`${basic} ${size == "sm" && "w-28"}`}
        onValueChange={(_, __, values) => setValue(values?.float)}
      />
    );
  } else if (subtype === "number") {
    input = (
      <CurrencyInput
        defaultValue={value}
        disableAbbreviations={true}
        disabled={disabled}
        decimalSeparator=""
        groupSeparator=""
        className={`${basic}  ${size == "sm" && "w-28"}`}
        onValueChange={(_, __, values) => setValue(values?.float)}
      />
    );
  } else if (subtype === "percent") {
    input = (
      <CurrencyInput
        suffix="%"
        defaultValue={value}
        disabled={disabled}
        decimalsLimit={2}
        className={`${basic}  ${size == "sm" && "w-28"}`}
        onValueChange={(_, __, values) => setValue(values?.float)}
      />
    );
  } else if (subtype === "date") {
    input = (
      <input
        type="date"
        disabled={disabled}
        className={`${basic} ${calcSize(size)} `}
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  } else if (subtype === "toggle") {
    input = <Toggle enabled={value} setEnabled={setValue} />;
  } else {
    input = (
      <input
        type="text"
        disabled={disabled}
        className={`${basic} ${calcSize(size)} `}
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  }
  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2 items-center">
        <label htmlFor={label} className="text-sm text-[#344054]">
          {label}
        </label>
        {toggleable && (
          <Toggle
            enabled={value != null}
            setEnabled={(value) =>
              value != null ? setValue(null as any) : setValue("asss")
            }
            size="sm"
          />
        )}
      </div>
      {input}
    </div>
  );
};

export default Input;
