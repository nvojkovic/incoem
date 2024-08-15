import Layout from "./components/Layout";
import { useEffect, useState } from "react";
import ClientOverview from "./components/Clients/ClientOverview";
import NewClient from "./components/Clients/NewClient";
import { deleteClient, getClients } from "./services/client";
import Spinner from "./components/Spinner";
import Input from "./components/Inputs/Input";
import { useUser } from "./useUser";

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

  const [search, setSearch] = useState("");

  const deleteCl = async (client: Client) => {
    await deleteClient(client);
    await fetchClients();
  };

  return (
    <Layout page="home" onTabChange={() => { }}>
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
          <div className="grid grid-cols-2 gap-6">
            {(clients || [])
              .filter(
                (i) =>
                  !search ||
                  i.title.toLowerCase().includes(search.toLowerCase()),
              )
              .map((client) => (
                <ClientOverview
                  key={client.id}
                  client={client}
                  onDelete={() => deleteCl(client)}
                />
              ))}
          </div>
        ) : (
          <Spinner />
        )}
      </div>
    </Layout>
  );
};

export default Clients;
