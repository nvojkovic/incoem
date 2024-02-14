import Toggle from "./Toggle";
import CurrencyInput from "react-currency-input-field";

interface Props {
  label: string;
  value: any;
  disabled?: boolean;
  toggleable?: boolean;
  subtype?: "money" | "percent" | "text" | "number";
  size?: "sm" | "md" | "lg";
  setValue: (value: any) => void;
}
const calcSize = (s: any) => {
  if (s == "sm") return "w-28";
  if (s == "md") return "w-36";
  if (s == "lg") return "w-48";
};
const Input = ({
  subtype = "text",
  size = "sm",
  label,
  value,
  toggleable = false,
  setValue,
  disabled = false,
}: Props) => {
  let input = null as any;
  if (subtype === "money") {
    input = (
      <CurrencyInput
        prefix="$"
        defaultValue={value}
        decimalsLimit={2}
        className={`rounded-lg border border-[#D0D5DD] px-3 py-2 disabled:bg-gray-100  ${size == "sm" && "w-28"}`}
        onValueChange={(_, __, values) => setValue(values?.float)}
      />
    );
  } else if (subtype === "number") {
    input = (
      <CurrencyInput
        defaultValue={value}
        disableAbbreviations={true}
        decimalSeparator=""
        groupSeparator=""
        className={`rounded-lg border border-[#D0D5DD] px-3 py-2 disabled:bg-gray-100  ${size == "sm" && "w-28"}`}
        onValueChange={(_, __, values) => setValue(values?.float)}
      />
    );
  } else if (subtype === "percent") {
    input = (
      <CurrencyInput
        suffix="%"
        defaultValue={value}
        decimalsLimit={2}
        className={`rounded-lg border border-[#D0D5DD] px-3 py-2 disabled:bg-gray-100  ${size == "sm" && "w-28"}`}
        onValueChange={(_, __, values) => setValue(values?.float)}
      />
    );
  } else {
    input = (
      <input
        type="text"
        disabled={disabled}
        className={`rounded-lg border border-[#D0D5DD] px-3 py-2 disabled:bg-gray-100 ${calcSize(size)}`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  }
  return (
    <div className="flex flex-col gap-1 flex-shrink">
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
