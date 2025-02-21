import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPrintClient } from "../services/client";
import { IncomeProvider } from "src/hooks/useData";
import AssetSummary from "src/components/Report/AssetSummary";
import { PrintClient } from "src/types";

const PrintAssetSummary = () => {
  const [client, setClient] = useState<PrintClient>(null as any);
  const [searchParams, _] = useSearchParams();
  console.log(searchParams);
  const { id } = useParams();
  useEffect(() => {
    if (id)
      getPrintClient(id).then((data) => {
        setClient(data);
      });
  }, [id]);

  console.log(client);
  if (!client) return <div>Loading... </div>;
  return (
    <IncomeProvider data={client} setLocal={() => {}}>
      <div className="bg-white ">
        <AssetSummary client={client} />
      </div>
    </IncomeProvider>
  );
};
export default PrintAssetSummary;
