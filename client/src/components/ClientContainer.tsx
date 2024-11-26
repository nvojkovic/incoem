import "../App.css";
import { Outlet, useLoaderData } from "react-router-dom";
import { IncomeProvider } from "../useData";
import Layout from "./Layout";
import Spinner from "./Spinner";
import { useState } from "react";

function ClientContainer() {
  // const { id } = useParams();

  // const fetchData = () => {
  //   console.log("fetchData");
  //   return getClient(id)
  //     .then((data) => data.json())
  //     .then((data) => {
  //       setData(data);
  //       data = { ...data.data, scenarios: data.scenarios };
  //     });
  // };
  // useEffect(() => {
  //   fetchData();
  // }, []);

  // const [data, setData] = useState<Client | null>(null);
  const loaderData = useLoaderData(); // Get initial data
  const [data, setData] = useState(loaderData as Client);

  // Allow IncomeProvider to update the client container's data

  if (!data)
    return (
      <Layout page="">
        <Spinner />
      </Layout>
    );

  return (
    <IncomeProvider data={data} setLocal={setData}>
      <Outlet />
    </IncomeProvider>
  );
}

export default ClientContainer;
