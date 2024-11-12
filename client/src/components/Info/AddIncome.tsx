import { newIncome } from "../../createIncome";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Fragment, useMemo } from "react";
import { Menu, Transition } from "@headlessui/react";
import { useInfo } from "../../useData";

interface AddIncomeProps { }

const AddIncome = ({ }: AddIncomeProps) => {
  const { addIncome, data } = useInfo();
  const people = data.data.people;
  const incomes = data.data.incomes;
  const addItem = useMemo(() => {
    return (type: string, title: string, person: Person) => (
      <div className="px-1 py-1" key={type + person.name}>
        <Menu.Item>
          {({ active }: any) =>
            type == "social-security" && people.length == 0 ? (
              <div></div>
            ) : (
              <div
                className={`${active ? "bg-main-orange text-white" : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                onClick={() => {
                  addIncome(newIncome(type as IncomeType, person));
                }}
              >
                {title}
              </div>
            )
          }
        </Menu.Item>
      </div>
    );
  }, []);

  return (
    <Menu as="div" className="">
      <Menu.Button className="px-4 py-3 relative inline-block text-left rounded-md font-semibold text-[16px] cursor-pointer bg-main-orange text-white">
        <div className="flex items-center gap-2 ">
          <PlusIcon className="w-5" />
          <div>Add income</div>
        </div>
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-[10px] mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-50 cursor-pointer">
          {[
            "employment-income",
            "social-security",
            "company-pension",
            "annuity",
            "other-income",
            "paydown",
          ]
            .map((type) =>
              type == "social-security" && people.length == 2
                ? [
                  !incomes?.find(
                    (item) =>
                      item.personId === 0 && item.type === "social-security",
                  ) &&
                  addItem(
                    type,
                    type
                      .split("-")
                      .map((i) => (i as any).capitalize())
                      .join(" ") + ` (${people[0].name})`,
                    people[0],
                  ),

                  !incomes?.find(
                    (item) =>
                      item.personId === 1 && item.type === "social-security",
                  ) &&
                  addItem(
                    type,
                    type
                      .split("-")
                      .map((i) => (i as any).capitalize())
                      .join(" ") + ` (${people[1].name})`,
                    people[1],
                  ),
                ]
                : [
                  addItem(
                    type,
                    type
                      .split("-")
                      .map((i) => (i as any).capitalize())
                      .join(" "),
                    people[0],
                  ),
                ],
            )
            .flat()}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
export default AddIncome;
