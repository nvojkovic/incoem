import Layout from "./components/Layout";
import { useEffect, useMemo, useState } from "react";
import ClientOverview from "./components/Clients/ClientOverview";
import NewClient from "./components/Clients/NewClient";
import { deleteClient, getClients } from "./services/client";
import Spinner from "./components/Spinner";
import Input from "./components/Inputs/Input";
import { useUser } from "./useUser";
import { calculateAge } from "./components/Info/PersonInfo";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

const Clients = () => {
  const { } = useUser();
  const [clients, setClients] = useState<Client[]>(null as any);

  const fetchClients = () => {
    return getClients().then((data) => {
      setClients(data);
    });
  };
  useEffect(() => {
    fetchClients();
  }, []);

  const SortIcon = useMemo(
    ({ name, key }: { name: string; key: string }) => {
      const handleClick = () => {
        if (sortKey === key) {
          setSortDir(sortDir === "up" ? "down" : "up");
        } else {
          setSortKey(key);
          setSortDir("up");
        }
      };

      return (
        <div className="w-full cursor-pointer" onClick={handleClick}>
          {name}
          {sortKey === key && (
            sortDir === "up" ? 
              <ChevronUpIcon className="w-4 inline-block ml-1 mb-[2px]" /> :
              <ChevronDownIcon className="w-4 inline-block ml-1 mb-[2px]" />
          )}
        </div>
      );
    },
    [sortDir, sortKey],
  );

  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState("up");

  const deleteCl = async (client: Client) => {
    await deleteClient(client);
    await fetchClients();
  };

  return (
    <Layout page="home">
      <div className="flex justify-between px-10 items-center mb-10">
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
      <div className="px-10">
        {clients ? (
          <table className=" w-full border bg-white">
            <thead
              className={`text-xs cursor-pointer bg-[#F9FAFB] text-black font-medium text-left sticky z-50 border-1`}
            >
              <tr>
                <th className="pl-2 py-3">
                  <SortIcon name="Name" key="name" />
                </th>
                <th className="px-2 py-3">
                  <SortIcon name="Updated At" key="updated_at" />
                </th>
                <th className="px-2 py-3">People</th>
                <th className="px-2 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="print:text-sm">
              {clients
                ?.filter(client => 
                  client.title.toLowerCase().includes(search.toLowerCase())
                )
                ?.sort((a, b) => {
                  if (sortKey === "name") {
                    return sortDir === "up" 
                      ? a.title.localeCompare(b.title)
                      : b.title.localeCompare(a.title);
                  }
                  if (sortKey === "updated_at") {
                    return sortDir === "up"
                      ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                      : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                  }
                  return 0;
                })
                ?.map((client, i) => (
                <ClientOverview
                  i={i}
                  key={client.id}
                  client={client}
                  onDelete={() => deleteCl(client)}
                />
              ))}
            </tbody>
          </table>
        ) : (
          <Spinner />
        )}
      </div>
    </Layout>
  );
};

export default Clients;
