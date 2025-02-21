import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPrintClient } from "../services/client";
import Report from "../components/Report/Report";

const PrintPage = () => {
  const [client, setClient] = useState(null as any);
  const { id, scenarioId } = useParams();
  const [searchParams, _] = useSearchParams();
  useEffect(() => {
    if (id)
      getPrintClient(id).then((data) => {
        setClient(data);
      });
  }, [id, scenarioId]);

  const scenario = client?.scenarios?.find((s: any) => s.id == scenarioId);
  if (!client) return <div>Loading...</div>;
  const scenarioData = {
    ...scenario,
    mapType: client.liveSettings.mapType,
    inflationType: client.liveSettings.inflationType,
    monthlyYearly: client.liveSettings.monthlyYearly,
    chartType: client.liveSettings.chartType,
    maxYearsShown: client.liveSettings.maxYearsShown,
    taxType: client.liveSettings.taxType,
  };

  return (
    <Report
      client={client}
      scenario={scenarioData}
      page={JSON.parse(searchParams.get("page") || "{}")}
    />
  );
};
export default PrintPage;
