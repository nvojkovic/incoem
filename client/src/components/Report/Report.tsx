import MapChart from "../MapChart";
import Cover from "./Cover";
import Print from "./Print";
import Spending from "./Spending";

interface ReportProps {
  scenario: ScenarioSettings;
  client: PrintClient;
  page: any;
}
const Report = ({ scenario, client, page }: ReportProps) => {
  if (page == "cover") return <Cover settings={scenario} client={client} />;
  if (page == "incomes") return <Print scenario={scenario} client={client} />;
  if (page == "chart")
    return <MapChart settings={scenario} client={client} print />;
  if (page == "spending") return <Spending scenario={scenario} />;
  return <div></div>;
};

export default Report;
