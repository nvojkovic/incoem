import Layout from "./components/Layout";
import { useEffect, useState } from "react";
import ClientOverview from "./components/Clients/ClientOverview";
import NewClient from "./components/Clients/NewClient";
import { deleteClient, duplicateClient, getClients } from "./services/client";
import Spinner from "./components/Spinner";
import Input from "./components/Inputs/Input";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { Client } from "./types";

const Clients = () => {
  const [clients, setClients] = useState<Client[]>(null as any);

  const fetchClients = () => {
    return getClients().then((data) => {
      setClients(data);
    });
  };
  useEffect(() => {
    fetchClients();
  }, []);

  const [sortKey, setSortKey] = useState("updated_at");
  const [sortDir, setSortDir] = useState("down");

  const SortIcon = ({ name, item: key }: { name: string; item: string }) => {
    console.log(sortKey);
    const handleClick = () => {
      if (sortKey === key) {
        setSortDir(sortDir === "up" ? "down" : "up");
      } else {
        console.log("setting", key);
        setSortKey(key);
        setSortDir("up");
      }
    };

    return (
      <div
        className="w-full cursor-pointer flex items-center gap-3 py-3"
        onClick={handleClick}
      >
        {name}
        <div className="inline-block">
          <div className="flex flex-col">
            <ChevronUpIcon
              className={
                sortKey == key && sortDir == "up"
                  ? "text-black mb-[-3px]"
                  : "text-gray-400 mb-[-3px]"
              }
            />
            <ChevronDownIcon
              className={
                sortKey == key && sortDir == "down"
                  ? "text-black w-3"
                  : "text-gray-400 w-3"
              }
            />
          </div>
        </div>
      </div>
    );
  };

  const [search, setSearch] = useState("");

  const deleteCl = async (client: Client) => {
    await deleteClient(client);
    await fetchClients();
  };
  const duplicateCl = async (client: Client, name: string) => {
    await duplicateClient(client, name);
    await fetchClients();
  };

  return (
    <Layout page="home">
      <div className="border bg-white rounded-xl shadow-lg">
        <div className="flex justify-between px-10 items-center pt-8 ">
          <div className="font-semibold text-[30px]">Clients overview</div>
          <div className="flex h-10 gap-5">
            <div className="w-[400px]">
              <Input
                placeholder="Search clients"
                label=""
                value={search}
                setValue={setSearch}
                size="full"
              />
            </div>
            <div>
              <NewClient />
            </div>
          </div>
        </div>
        <div className="px-10 bg-white p-9 rounded-full">
          {clients ? (
            <div className="rounded-lg">
              <table className=" w-full border  rounded-lg border-separate border-spacing-0 ">
                <thead
                  className={`text-sm cursor-pointer bg-[#F9FAFB] text-black font-medium text-left sticky z-50 border-1`}
                >
                  <tr className="">
                    <th className="pl-2 rounded-lg">
                      <SortIcon name="Household" item="name" />
                    </th>
                    <th className="px-2 ">
                      <SortIcon name="Last Updated" item="updated_at" />
                    </th>
                    <th className="px-2 ">People</th>
                    <th className="px-2 ">Actions</th>
                  </tr>
                </thead>
                <tbody className="print:text-sm">
                  {clients
                    ?.filter((client) =>
                      client.title.toLowerCase().includes(search.toLowerCase()),
                    )
                    ?.sort((a, b) => {
                      if (sortKey === "name") {
                        return sortDir === "up"
                          ? a.title.localeCompare(b.title)
                          : b.title.localeCompare(a.title);
                      }
                      if (sortKey === "updated_at") {
                        return sortDir === "up"
                          ? new Date(a.updatedAt).getTime() -
                              new Date(b.updatedAt).getTime()
                          : new Date(b.updatedAt).getTime() -
                              new Date(a.updatedAt).getTime();
                      }
                      return 0;
                    })
                    ?.map((client, i) => (
                      <ClientOverview
                        i={i}
                        key={client.id}
                        client={client}
                        onDelete={() => deleteCl(client)}
                        onDuplicate={(client: any, name: any) =>
                          duplicateCl(client, name)
                        }
                      />
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Clients;
