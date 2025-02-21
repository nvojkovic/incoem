import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VersatileReport from "src/components/Report/VersatileCalculator";
import { getPrintClient } from "src/services/client";
import { PrintClient } from "src/types";

const VersatilePrintPage = () => {
  const [client, setClient] = useState<PrintClient>({} as any);
  const { id, scenarioId } = useParams();
  useEffect(() => {
    if (id)
      getPrintClient(id).then((data) => {
        setClient(data);
      });
  }, [id, scenarioId]);
  const scenario = parseInt(scenarioId || "");
  if (!client) return <div>Loading...</div>;

  const settings =
    scenario === -1
      ? client.versatileCalculator
      : client.versatileCalculators?.find((s: any) => s.id == scenarioId);

  if (!settings) return <div>Loading... </div>;
  return <VersatileReport settings={settings as any} client={client} />;
};

export default VersatilePrintPage;
