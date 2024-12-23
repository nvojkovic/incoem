import Composite from "./Composite";
import Cover from "./Cover";
import IncomeChart from "./IncomeChart";
import IncomeTable from "./IncomeTable";
import Longevity from "./Longevity";
import Spending from "./Spending";
import SpendingChart from "./SpendingChart";

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
    return <IncomeTable scenario={scenario} client={client} />;
  if (page.name == "income-chart")
    return <IncomeChart scenario={scenario} client={client} print />;
  if (page.name == "spending-chart")
    return <SpendingChart scenario={scenario} client={client} print />;
  if (page.name == "spending")
    return (
      <Spending
        scenario={scenario}
        spending={client.spending}
        client={client}
      />
    );

  if (page.name == "composite")
    return (
      <Composite
        spending={client.spending}
        scenario={scenario}
        client={client}
      />
    );

  if (page.name == "longevity")
    return <Longevity scenario={scenario} client={client} />;
  return <div></div>;
};

export default Report;

// <div className="text-2xl mx-auto mb-5">Composite</div>
