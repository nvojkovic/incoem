import SpendingTable from "../Spending/SpendingTable";
import Header from "./Header";

const Spending = ({
  scenario,
  spending,
  client,
}: {
  scenario: ScenarioSettings;
  spending: RetirementSpendingSettings;
  client: PrintClient;
}) => {
  if (!spending) return null;
  return (
    <div className="mx-20 flex justify-center flex-col">
      <Header client={client} scenario={scenario} />
      <div className="text-2xl mx-auto">Spending</div>
      <SpendingTable
        settings={scenario}
        spending={spending}
        data={scenario.data}
      />
    </div>
  );
};

export default Spending;
