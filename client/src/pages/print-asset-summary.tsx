import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPrintClient } from "../services/client";
import { IncomeProvider } from "src/hooks/useData";
import AssetSummary from "src/components/Report/AssetSummary";

const PrintAssetSummary = () => {
  const [client, setClient] = useState(null as any);
  const [resp, setResp] = useState(null as any);
  const [searchParams, _] = useSearchParams();
  console.log(searchParams);
  const { id } = useParams();
  useEffect(() => {
    getPrintClient(id)
      .then((data) => data.json())
      .then((data) => {
        setClient(data);
        setResp(data);
      })
      .catch((e) => {
        setResp(e);
      });
  }, [id]);

  console.log(client);
  if (!client) return <div>Loading... {resp?.toString()}</div>;
  return (
    <IncomeProvider data={client as any} setLocal={() => { }}>
      <div className="bg-white ">
        <AssetSummary client={client} />
      </div>
    </IncomeProvider>
  );
};
export default PrintAssetSummary;
