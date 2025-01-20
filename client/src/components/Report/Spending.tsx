import {
  PrintClient,
  RetirementSpendingSettings,
  ScenarioSettings,
} from "src/types";
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
  if (!spending || !client.needsFlag) return null;
  return (
    <div className="mx-5 flex justify-center flex-col pt-6">
      <Header client={client} scenario={scenario} />
      <div className="text-2xl mx-auto pb-3">Spending</div>
      <SpendingTable
        settings={scenario}
        spending={spending}
        data={scenario.data}
      />
    </div>
  );
};

export default Spending;

// <div className="flex mt-6 mb-8 gap-3 mx-auto">
//   {scenario?.retirementYear && (
//     <PrintCard
//       title={`Retirement Year`}
//       subtitle={scenario.retirementYear}
//     />
//   )}
//
//   {client.spending?.preTaxRate ? (
//     <PrintCard
//       title={`Pre-Retirement Tax Rate`}
//       subtitle={`${client.spending.preTaxRate}%`}
//     />
//   ) : null}
//   {client.spending?.postTaxRate ? (
//     <PrintCard
//       title={`Post-Retirement Tax Rate`}
//       subtitle={`${client.spending.postTaxRate}%`}
//     />
//   ) : null}
// </div>
