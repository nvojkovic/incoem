import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPrintClient } from "../services/client";
import Print from "../components/Report/Print";
import Report from "../components/Report/Report";

const PrintPage = () => {
  const [client, setClient] = useState({} as any);
  const { id, scenarioId } = useParams();
  const [searchParams, _] = useSearchParams();
  useEffect(() => {
    getPrintClient(id)
      .then((data) => data.json())
      .then((data) => {
        setClient(data);
      });
  }, [id, scenarioId]);

  const scenario = client?.scenarios?.find((s: any) => s.id == scenarioId);
  console.log(scenario, client);
  if (!client) return <div>Loading...</div>;
  // if (!scenario) return null;
  //
  return (
    <Report
      client={client}
      scenario={scenario}
      page={searchParams.get("page")}
    />
  );
  return <div>{scenario && <Print client={client} scenario={scenario} />}</div>;
};
export default PrintPage;
