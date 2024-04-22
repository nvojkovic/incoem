import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPrintClient } from "../services/client";
import Print from "../components/Print";

const PrintLivePage = () => {
  const [client, setClient] = useState({} as any);
  const [searchParams, _] = useSearchParams();
  console.log(searchParams);
  const { id } = useParams();
  useEffect(() => {
    getPrintClient(id)
      .then((data) => data.json())
      .then((data) => {
        setClient(data);
      });
  }, [id]);

  const scenario = JSON.parse(searchParams.get("data") || "null");
  console.log(scenario, client);
  if (!scenario || !client.userdata) return <div>Loading...</div>;
  scenario.name = "Live";
  return <Print client={client} scenario={scenario} />;
};
export default PrintLivePage;
