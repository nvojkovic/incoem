import SpendingTable from "../Spending/SpendingTable";

const Spending = ({ scenario }: { scenario: ScenarioSettings }) => {
  if (!scenario.spending) return null;
  return (
    <div className="mx-20 flex justify-center flex-col">
      <div className="text-2xl mx-auto">Spending</div>
      <SpendingTable
        settings={scenario}
        spending={scenario.spending}
        data={scenario.data}
      />
    </div>
  );
};

export default Spending;
