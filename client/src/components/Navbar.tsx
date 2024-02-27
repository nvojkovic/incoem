import { Fragment, useState } from "react";
import logo from "../assets/logo.png";
import { Menu, Transition } from "@headlessui/react";
import { UserIcon } from "@heroicons/react/24/outline";

const NavItem = ({
  name,
  active,
  onClick,
}: {
  name: string;
  active: boolean;
  onClick: any;
}) => {
  return (
    <div
      className={`cursor-pointer py-2 px-3 font-semibold rounded-md ${active ? "bg-[#FF7957] text-white" : ""}`}
      onClick={onClick}
    >
      {name}
    </div>
  );
};

const Navbar = ({ active }: { active: string }) => {
  const [tab, setTab] = useState<"data" | "calculator">("data");
  if (active) 1;
  return (
    <div className="border-b border-[#EAECF0] fullscreen-hidden">
      <div className="max-w-[1280px] px-10 m-auto flex justify-between items-center">
        <div className=" flex justify-between items-center h-[72px] bg-[#ffffff]">
          <div className="flex items-center">
            <img src={logo} className="w-9 h-9 mr-2" />
            <div className="font-bold text-[20px] leading-5">Income Mapper</div>
            <div className="ml-3 flex gap-0">
              <NavItem
                name="Home"
                active={tab == "data"}
                onClick={() => setTab("data")}
              />
              <NavItem
                name="Income Map"
                active={tab == "calculator"}
                onClick={() => setTab("calculator")}
              />
            </div>
          </div>
        </div>
        <div className="">
          <div className="">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="w-10 h-10 rounded-full bg-[#F2F4F7] flex items-center justify-center cursor-pointer">
                  <UserIcon className="h-6 text-[#667085]" />
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
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                  <div className="px-1 py-1 ">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${active
                              ? "bg-main-orange text-white"
                              : "text-gray-900"
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          Account Menu
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${active
                              ? "bg-main-orange text-white"
                              : "text-gray-900"
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          View profile
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${active
                              ? "bg-main-orange text-white"
                              : "text-gray-900"
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          Change client
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${active
                              ? "bg-main-orange text-white"
                              : "text-gray-900"
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          Log out
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Navbar;
