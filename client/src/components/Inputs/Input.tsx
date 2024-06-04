import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import Toggle from "./Toggle";
import CurrencyInput from "react-currency-input-field";
import { Tooltip } from "flowbite-react";

interface Props {
  label: string;
  value: any;
  disabled?: boolean;
  vertical?: boolean;
  tooltip?: string;
  toggleable?: boolean;
  placeholder?: string;
  onKeyDown?: (e: any) => void;
  subtype?:
    | "money"
    | "percent"
    | "text"
    | "number"
    | "date"
    | "toggle"
    | "password"
    | "textarea";
  size?: "xs" | "sm" | "md" | "lg" | "full";
  setValue: (value: any) => void;
}
const calcSize = (s: any) => {
  if (s == "xs") return "w-20";
  if (s == "sm") return "w-28";
  if (s == "md") return "w-36";
  if (s == "lg") return "w-48";
  if (s == "full") return "w-full";
};
const Input = ({
  subtype = "text",
  size = "sm",
  placeholder,
  vertical = false,
  label,
  value,
  toggleable = false,
  setValue,
  tooltip,
  disabled = false,
  ...props
}: Props) => {
  let input = null as any;
  const basic =
    "focus:outline-none focus:border-[#FF6C47] focus:ring-1 focus:ring-[#FF6C47] rounded-lg border border-[#D0D5DD] px-3 py-2 disabled:bg-gray-100";
  if (subtype === "money") {
    input = (
      <CurrencyInput
        prefix="$"
        value={value}
        decimalsLimit={2}
        disabled={disabled}
        className={`${basic} ${size == "sm" && "w-full"} ${calcSize(size)}`}
        onValueChange={(_, __, values) => setValue(values?.float)}
        {...props}
      />
    );
  } else if (subtype === "number") {
    input = (
      <CurrencyInput
        defaultValue={value}
        disableAbbreviations={true}
        disabled={disabled}
        disableGroupSeparators={true}
        className={`${basic}  ${size == "sm" && "w-full"} ${calcSize(size)}`}
        onValueChange={(_, __, values) => setValue(values?.float)}
        {...props}
      />
    );
  } else if (subtype === "percent") {
    input = (
      <CurrencyInput
        suffix="%"
        defaultValue={value}
        disabled={disabled}
        decimalsLimit={2}
        className={`${basic}  ${size == "sm" && "w-full"} ${calcSize(size)}`}
        onValueChange={(_, __, values) => setValue(values?.float)}
        {...props}
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
    input = (
      <div
        className={
          "focus:outline-none focus:border-[#FF6C47] focus:ring-1 focus:ring-[#FF6C47] rounded-lg py-2 disabled:bg-gray-100 m-auto"
        }
      >
        <Toggle enabled={value} setEnabled={setValue} />
      </div>
    );
  } else if (subtype == "text" || subtype == "password") {
    input = (
      <input
        type={subtype}
        disabled={disabled}
        className={`${basic} ${calcSize(size)} `}
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        {...props}
      />
    );
  } else if (subtype == "textarea") {
    input = (
      <textarea
        disabled={disabled}
        className={`${basic} h-56 ${calcSize(size)} `}
        value={value}
        cols={20}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  }
  return (
    <div
      className={`flex ${vertical && "flex-col"} gap-1 w-full lg:flex-row flex-col`}
    >
      <div
        className={`flex gap-2 ${vertical ? "items-start text-left" : "items-center"}`}
      >
        <label
          htmlFor={label}
          className={`text-sm text-[#344054] ${!vertical && "min-w-36"}`}
        >
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
      {tooltip ? (
        <div className={calcSize(size)}>
          <Tooltip
            content={tooltip}
            theme={{ target: "" }}
            placement="right-end"
            style="light"

            // className="border-black border"
          >
            <div className="relative cursor-pointer">
              <QuestionMarkCircleIcon className="h-5 w-5 text-[#D0D5DD] absolute right-2 top-1/2 transform -translate-y-1/2" />
              {input}
            </div>
          </Tooltip>
        </div>
      ) : (
        input
      )}
    </div>
  );
};

export default Input;
