import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
  ChevronUpDownIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { Tooltip } from "flowbite-react";

interface Props {
  options: any;
  selected: any;
  vertical?: boolean;
  label?: string;
  width?: string;
  labelLength?: number;
  errorMessage?: string | React.ReactElement;
  invalid?: boolean;
  setSelected: (s: any) => void;
}

function Select({
  label,
  vertical,
  options,
  selected,
  width,
  setSelected,
  labelLength = 0,
  errorMessage,
  invalid,
}: Props) {
  return (
    <div
      className={`flex ${vertical && "flex-col"} gap-1 flex-shrink ${
        vertical ? "items-start" : "lg:items-center"
      } `}
    >
      {label && (
        <label
          htmlFor={label}
          className={`text-sm text-[#344054] w-36 text-left`}
          style={labelLength !== 0 ? { width: `${labelLength}px` } : {}}
        >
          {label}
        </label>
      )}
      <div
        className={
          labelLength === 0
            ? ` ${width ? width : "min-w-[200px]"}`
            : `w-full ${width}`
        }
      >
        <Listbox value={selected} onChange={setSelected}>
          <div className="relative">
            <Listbox.Button
              className={`relative w-full cursor-default rounded-lg bg-white py-[6px] pl-3 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm border border-[#D0D5DD] flex justify-between ${invalid ? "border-red-500 border-2" : ""}`}
            >
              <span className="block truncate min-h-6 text-base">
                <div className="relative w-full">{selected?.name}</div>
              </span>
              <span className=" flex items-center pr-2">
                {errorMessage && invalid ? (
                  <div className={""}>
                    <Tooltip
                      content={
                        <div>
                          {errorMessage && invalid && (
                            <div className="text-red-500 w-32">
                              {errorMessage}
                            </div>
                          )}
                        </div>
                      }
                      theme={{ target: "" }}
                      placement="right-end"
                      style="light"
                      // className="border-black border"
                    >
                      <div className="relative cursor-pointer">
                        {errorMessage && invalid ? (
                          <ExclamationTriangleIcon
                            className={`h-5 w-5 ${invalid ? "text-red-500" : "text-[#D0D5DD]"} `}
                          />
                        ) : null}
                      </div>
                    </Tooltip>
                  </div>
                ) : null}
                <ChevronUpDownIcon
                  className={`h-5 w-5 text-gray-400 ${errorMessage && invalid && "]"}`}
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            <div className="relative">
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-[5000]">
                  {options.map((person: any, personIdx: number) => (
                    <Listbox.Option
                      key={personIdx}
                      className={({ active }) =>
                        `relative cursor-default min-h-8 select-none py-2 text-left pl-8 ${
                          active
                            ? " text-main-orange bg-[rgba(var(--primary-color-segment),0.1)]"
                            : "text-gray-900"
                        }`
                      }
                      value={person}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {person.name}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                              {/*<CheckIcon className="h-5 w-5" aria-hidden="true" />*/}
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </div>
        </Listbox>
      </div>
    </div>
  );
}

export default Select;
