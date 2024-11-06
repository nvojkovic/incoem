import SpendingTable from "../Spending/SpendingTable";

const Spending = ({
  scenario,
  spending,
}: {
  scenario: ScenarioSettings;
  spending: RetirementSpendingSettings;
}) => {
  if (!spending) return null;
  return (
    <div className="mx-20 flex justify-center flex-col">
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
