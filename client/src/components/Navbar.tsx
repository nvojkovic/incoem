import { Fragment } from "react";
import Session from "supertokens-web-js/recipe/session";
import logo from "../assets/logo.png";
import { Menu, Transition } from "@headlessui/react";
import { UserIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import useUser from "../useUser";

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

// user?.info?.logo
//   ? import.meta.env.VITE_API_URL +
//   "logo?logo=" +
//   user?.info?.logo
const Navbar = ({
  active,
  onTabChange,
  household,
}: {
  active: string;
  onTabChange: any;
  household?: string;
}) => {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <div className="max-w-[1480px] px-10 m-auto flex justify-between items-center h-[72px] sticky top-10 bg-white z-40">
      <div className=" flex justify-between items-center h bg-white w-full">
        <div className="flex items-center justify-start w-full">
          <Link to="/clients">
            <div className="flex items-center cursor-pointer">
              {user?.info ? (
                <img
                  src={
                    user?.info?.logo
                      ? `${import.meta.env.VITE_API_URL}logo/?logo=${user.info.logo}`
                      : logo
                  }
                  className="w-9 h-9 mr-2"
                />
              ) : (
                <div className="w-9 h-9"></div>
              )}
              <div className="font-bold text-[20px] leading-5">
                Income Mapper
              </div>
            </div>
          </Link>
          {active == "data" || active == "calculator" ? (
            <div className="ml-3 flex gap-0">
              <NavItem
                name="Data"
                active={active == "data"}
                onClick={() => onTabChange("data")}
              />
              <NavItem
                name="Calculator"
                active={active == "calculator"}
                onClick={() => onTabChange("calculator")}
              />
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex gap-6 items-center">
        <div className="font-semibold text-[16px] ml-3 w-96 text-right text-main-orange">
          {household ? ` ${household}` : ""}
        </div>
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
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link to="/profile">
                        <button
                          className={`${active
                              ? "bg-main-orange text-white"
                              : "text-gray-900"
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          Settings
                        </button>
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link to="/help">
                        <button
                          className={`${active
                              ? "bg-main-orange text-white"
                              : "text-gray-900"
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          Help Center
                        </button>
                      </Link>
                    )}
                  </Menu.Item>
                </div>
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${active ? "bg-main-orange text-white" : "text-gray-900"
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        onClick={async () => {
                          await Session.signOut();
                          navigate("/login");
                        }}
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
  );
};
export default Navbar;
