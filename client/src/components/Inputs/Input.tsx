import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import Toggle from "./Toggle";
import CurrencyInput from "react-currency-input-field";
import { Tooltip } from "flowbite-react";
import { useEffect, useState } from "react";

interface Props {
  label: string;
  value: any;
  disabled?: boolean;
  vertical?: boolean;
  tooltip?: string;
  toggleable?: boolean;
  labelLength?: number;
  invalid?: boolean;
  placeholder?: string;
  errorMessage?: string;
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
  width?: string;
  setValue: (value: any) => void;
  [key: string]: any;
}
const calcSize = (s: any) => {
  if (s == "xs") return "w-20";
  if (s == "sm") return "w-28";
  if (s == "md") return "w-36";
  if (s == "lg") return "w-[200px]";
  if (s == "full") return "w-full";
};
const Input = ({
  subtype = "text",
  size = "sm",
  placeholder,
  vertical = false,
  invalid = false,
  errorMessage,
  label,
  value,
  toggleable = false,
  setValue,
  labelLength = 0,
  tooltip,
  disabled = false,
  width,
  ...props
}: Props) => {
  let input = null as any;

  const [internalValue, setInternalValue] = useState("");
  useEffect(() => {
    // Update internal string value when external numeric value changes
    setInternalValue(value?.toString());
  }, [value]);

  const basic = `focus:outline-none focus:border-main-orange-light focus:ring-1 focus:ring-main-orange rounded-lg border border-[#D0D5DD] px-3 py-[6px] text-m disabled:bg-gray-100 ${width} ${invalid ? "border-red-500 border-2" : ""}`;
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
        value={value}
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
        value={internalValue}
        disabled={disabled}
        decimalsLimit={3}
        className={`${basic}  ${size == "sm" && "w-full"} ${calcSize(size)}`}
        // onValueChange={(_, __, values) => setValue(values?.float)}
        onValueChange={(value, __, values) => {
          setInternalValue(value || "");
          setValue(values?.float);
        }}
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
          "focus:outline-none focus:border-[#FF6C47] focus:ring-1 focus:ring-[#FF6C47] rounded-lg py-2 disabled:bg-gray-100 "
        }
      >
        <Toggle enabled={value} setEnabled={setValue} {...props} />
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
        cols={40}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        {...props}
      />
    );
  }
  return (
    <div
      className={`flex ${vertical ? "flex-col" : "lg:flex-row md:flex-row"} gap-1 w-full  flex-col`}
    >
      <div
        className={`flex gap-2 ${vertical ? "items-start text-left" : "items-center"}`}
      >
        {label && (
          <label
            htmlFor={label}
            className={`text-sm text-[#344054] ${!vertical && labelLength === 0 && "min-w-36"} `}
            style={labelLength !== 0 ? { width: `${labelLength}px` } : {}}
          >
            {label}
          </label>
        )}
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
            content={
              <div>
                {tooltip}
                {errorMessage && invalid && (
                  <div className="text-red-500">{errorMessage}</div>
                )}
              </div>
            }
            theme={{ target: "" }}
            placement="right-end"
            style="light"

          // className="border-black border"
          >
            <div className="relative cursor-pointer">
              <QuestionMarkCircleIcon
                className={`h-5 w-5 ${invalid ? "text-red-500" : "text-[#D0D5DD]"} absolute right-2 top-1/2 transform -translate-y-1/2`}
              />
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
