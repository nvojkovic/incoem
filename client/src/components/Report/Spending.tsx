import SpendingTable from "../Spending/SpendingTable";
import Header from "./Header";
import { PrintCard } from "./PrintCard";

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
      <div className="flex mt-5 gap-3 mx-auto">
        {scenario?.retirementYear && (
          <PrintCard
            title={`Retirement Year`}
            subtitle={scenario.retirementYear}
          />
        )}

        {client.spending?.preTaxRate && (
          <PrintCard
            title={`Pre-Retirement Tax Rate`}
            subtitle={`${client.spending.preTaxRate}%`}
          />
        )}
        {client.spending?.postTaxRate && (
          <PrintCard
            title={`Post-Retirement Tax Rate`}
            subtitle={`${client.spending.postTaxRate}%`}
          />
        )}
      </div>
      <SpendingTable
        settings={scenario}
        spending={spending}
        data={scenario.data}
      />
    </div>
  );
};

export default Spending;
