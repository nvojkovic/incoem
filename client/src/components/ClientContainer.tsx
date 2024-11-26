import "../App.css";
import { Outlet, useParams } from "react-router-dom";
import { useInfo } from "../useData";
import Layout from "./Layout";
import Spinner from "./Spinner";
import { useEffect } from "react";
import { getClient } from "src/services/client";

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
  const { data: clientData, setLocal: updateClientData } = useInfo();
  const { id } = useParams();
  useEffect(() => {
    if (!clientData || clientData.id?.toString() !== id) {
      getClient(id)
        .then((data) => data.json())
        .then((data) => {
          updateClientData(data);
        });
    }
  }, [id]);

  if (!clientData || clientData.id?.toString() !== id) {
    return (
      <Layout page="">
        <Spinner />
      </Layout>
    );
  }

  return <Outlet />;
}

export default ClientContainer;
