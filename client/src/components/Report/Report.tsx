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
  console.log(":page", page.name, client);
  if (!client.userdata) return null;
  if (page.name == "cover")
    return <Cover settings={scenario} client={client} />;
  if (page.name == "incomes")
    return <Print scenario={scenario} client={client} />;
  if (page.name == "income-chart")
    return <MapChart settings={scenario} client={client} print />;
  if (page.name == "spending")
    return (
      <Spending
        scenario={scenario}
        spending={client.spending}
        client={client}
      />
    );
  return <div></div>;
};

export default Report;
