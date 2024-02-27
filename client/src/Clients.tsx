import Layout from "./components/Layout";
import { useState } from "react";
import ClientOverview from "./components/Clients/ClientOverview";
import NewClient from "./components/Clients/NewClient";

const initial: Client[] = [];

const Clients = () => {
  const [clients, setClients] = useState<Client[]>(
    localStorage.getItem("clients")
      ? JSON.parse(localStorage.getItem("clients") as string)
      : initial,
  );

  const deleteClient = (id: number) => {
    setClients((prev) => {
      const newClients = prev.filter((client) => client.id !== id);
      localStorage.setItem("clients", JSON.stringify(newClients));
      return newClients;
    });
  };

  return (
    <Layout>
      <div className="flex justify-between">
        <div className="font-semibold text-[30px]">Clients overview</div>
        <div>
          <NewClient setClients={setClients} />
        </div>
      </div>
      <div className="flex flex-wrap">
        {clients.map((client) => (
          <ClientOverview
            key={client.id}
            client={client}
            onDelete={() => deleteClient(client.id)}
          />
        ))}
      </div>
    </Layout>
  );
};

export default Clients;
