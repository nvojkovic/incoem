import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPrintClient } from "../services/client";
import { IncomeProvider } from "src/useData";
import AssetSummary from "src/components/Report/AssetSummary";

const PrintAssetSummary = () => {
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
    incomes: client.incomes,
    people: client.people,
    spending: client.spending,
  };
  console.log(scenario, client);
  if (!scenario || !client.userdata) return <div>Loading...</div>;
  scenario.name = "Live";
  return (
    <IncomeProvider data={client as any} setLocal={() => { }}>
      <div className="bg-white ">
        <AssetSummary client={client} />
      </div>
    </IncomeProvider>
  );
};
export default PrintAssetSummary;
