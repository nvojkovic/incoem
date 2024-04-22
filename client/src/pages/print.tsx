import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPrintClient } from "../services/client";
import Print from "../components/Print";

const PrintPage = () => {
  const [client, setClient] = useState({} as any);
  const { id, scenarioId } = useParams();
  useEffect(() => {
    getPrintClient(id)
      .then((data) => data.json())
      .then((data) => {
        setClient(data);
      });
  }, [id, scenarioId]);

  const scenario = client?.scenarios?.find((s: any) => s.id == scenarioId);
  console.log(scenario, client);
  if (!scenario) return null;
  return <Print client={client} scenario={scenario} />;
};
export default PrintPage;
