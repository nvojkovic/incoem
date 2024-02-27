import Button from "../Inputs/Button";
import { newIncome } from "../../createIncome";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
const AddIncome = ({ addIncome }: any) => {
  return (
    <Button
      type="primary"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="flex items-center gap-2">
            Add income
            <div className="text-sm">
              <PlusIcon className="h-5 w-5" />
            </div>
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-[-10px] mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
            {[
              "employment-income",
              "social-security",
              "company-pension",
              "annuity",
              "other-income",
              "paydown",
            ].map((type) => (
              <div className="px-1 py-1 " key={type}>
                <Menu.Item>
                  {({ active }) => (
                    <div
                      className={`${active ? "bg-main-orange text-white" : "text-gray-900"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      onClick={() => {
                        addIncome(newIncome(type as IncomeType));
                      }}
                    >
                      {type
                        .split("-")
                        .map((i) => (i as any).capitalize())
                        .join(" ")}
                    </div>
                  )}
                </Menu.Item>
              </div>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
    </Button>
  );
};
export default AddIncome;
