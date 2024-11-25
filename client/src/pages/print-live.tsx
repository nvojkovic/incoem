import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPrintClient } from "../services/client";
import Report from "src/components/Report/Report";

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

  const scenario = {
    ...client.liveSettings,
    data: client.data,
    spending: client.spending,
  }; //JSON.parse(searchParams.get("data") || "null");
  console.log(scenario, client);
  if (!scenario || !client.userdata) return <div>Loading...</div>;
  scenario.name = "Live";
  return (
    <div className="bg-white ">
      <Report
        client={client}
        scenario={scenario}
        page={JSON.parse(searchParams.get("page") || "{}")}
      />
    </div>
  );
};
export default PrintLivePage;
