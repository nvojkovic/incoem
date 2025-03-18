import { Fragment } from "react";
import Session from "supertokens-web-js/recipe/session";
import { Menu, Transition } from "@headlessui/react";
import { UserIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { useInfo } from "../hooks/useData";
import { calculateAge } from "./Info/PersonInfo";
import { router } from "src/main";
import { Client } from "src/types";
import config from "src/services/config";

const NavItem = ({
  name,
  active,
  link,
}: {
  name: string;
  active: boolean;
  link: string;
}) => {
  return (
    <Link to={link}>
      <div
        className={`cursor-pointer py-2 px-3 font-semibold rounded-md ${active ? "bg-main-orange text-white" : ""}`}
      >
        {name}
      </div>
    </Link>
  );
};

const Navbar = ({ active, client }: { active: string; client?: Client }) => {
  const navigate = router.navigate;
  const { user } = useUser();
  const { data } = useInfo();

  const assetSummaryVisible = [
    "nikola.vojkovic@live.com",
    "nikola.vojkovic@toptal.com",
    "taylor@ataroke.com",
    "mike@beausayfinancial.com",
    "nclark@envisionrs.com",
  ].includes(user?.info?.email as any);

  return (
    <div className="max-w-[1480px] px-10 m-auto flex justify-between items-center h-[72px] sticky top-10 bg-white z-[5000] ">
      <div className=" flex justify-between items-center h bg-white w-full flex-1">
        <div className="flex items-center justify-start w-full flex-1">
          <Link to="/clients">
            <div
              className={`flex items-center cursor-pointer ${user?.info?.logo ? "" : "min-w-[200px]"}`}
            >
              {user?.info ? (
                <img
                  src={
                    user?.info?.logo
                      ? `${config.API_URL}logo/?logo=${user.info.logo}`
                      : "/img/logo.png"
                  }
                  className="h-9 mr-2 "
                />
              ) : (
                <div className="w-9 h-9"></div>
              )}

              {user?.info ? (
                <div className="font-bold text-[20px] leading-5">
                  {user?.info?.logo ? "" : "Income Mapper"}
                </div>
              ) : (
                <div className="w-9 h-9"></div>
              )}
            </div>
          </Link>
          {active == "data" ||
          active == "calculator" ||
          active == "map" ||
          active == "asset-summary" ||
          active == "basic" ||
          active == "longevity" ||
          active == "spending" ? (
            <div className="ml-3 flex gap-0">
              <NavItem
                name="Income"
                active={active == "data"}
                link={`/client/${data.id}/income`}
              />
              {data.needsFlag && (
                <NavItem
                  name="Spending"
                  active={active == "spending"}
                  link={`/client/${data.id}/spending`}
                />
              )}
              {data.longevityFlag && (
                <NavItem
                  name="Longevity"
                  active={active == "longevity"}
                  link={`/client/${data.id}/longevity`}
                />
              )}
              <NavItem
                name="Map"
                active={active == "map"}
                link={`/client/${data.id}/map`}
              />
              <NavItem
                name="Calculators"
                active={active == "calculator"}
                link={`/client/${data.id}/calculator`}
              />
              {assetSummaryVisible && (
                <NavItem
                  name="Asset Summary"
                  active={active == "asset-summary"}
                  link={`/client/${data.id}/asset-summary/income-cash`}
                />
              )}
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex gap-6 items-center ">
        {window.location.href.includes("/client/") && (
          <Link to={`/client/${data.id}/basic`}>
            <div className="font-semibold text-[16px] ml-3 max-w-96 text-right text-main-orange cursor-pointer">
              {client?.people ? ` ${client?.title} ` : ""}{" "}
              <div className="font-normal text-gray-500 text-sm">
                {client?.people
                  ?.map(
                    (item) =>
                      `${item.name} (${calculateAge(new Date(item.birthday))})`,
                  )
                  .join(" | ")}
              </div>
            </div>
          </Link>
        )}
        <Menu as="div" className="relative inline-block text-left z-[5000]">
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
            <Menu.Items className="absolute block right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-[50000]">
              <div className="px-1 py-1 z-[50000]">
                <Menu.Item>
                  {({ active }) => (
                    <Link to="/profile">
                      <button
                        className={`${
                          active ? "bg-main-orange text-white" : "text-gray-900"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        Settings
                      </button>
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="https://intercom.help/income-mapper/en/"
                      target="_blank"
                    >
                      <button
                        className={`${
                          active ? "bg-main-orange text-white" : "text-gray-900"
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
                      className={`${
                        active ? "bg-main-orange text-white" : "text-gray-900"
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
  );
};
export default Navbar;
