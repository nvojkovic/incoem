import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";

interface Props {
  options: any;
  selected: any;
  vertical?: boolean;
  label?: string;
  setSelected: (s: any) => void;
}

function Select({ label, vertical, options, selected, setSelected }: Props) {
  return (
    <div
      className={`flex ${vertical && "flex-col"} gap-1 flex-shrink ${
        vertical ? "items-start" : "items-center"
      }`}
    >
      <label htmlFor={label} className="text-sm text-[#344054] w-36">
        {label}
      </label>
      <div className="min-w-48 ">
        <Listbox value={selected} onChange={setSelected}>
          <div className="relative">
            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-[8px] pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm border border-[#D0D5DD]">
              <span className="block truncate min-h-6 text-base">
                {selected?.name}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
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
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-50">
                  {options.map((person: any, personIdx: number) => (
                    <Listbox.Option
                      key={personIdx}
                      className={({ active }) =>
                        `relative cursor-default min-h-8 select-none py-2 text-left pl-8 ${
                          active
                            ? "bg-[#ffd6cc] text-amber-900"
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
