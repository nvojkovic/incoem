import { useInfo } from "src/useData";
import MapSection from "../MapSection";
import Container from "./Container";
import { printNumber } from "src/utils";
import PieChart from "../Charts/PieChart";

const Analysis = () => {
  const {
    data: { nateClient },
  } = useInfo();

  const cashAssets = nateClient.cashAssets
    .map((i) => i.balance || 0)
    .reduce((a, b) => a + b, 0);
  const statementWealth = nateClient.statementWealth
    .map((i) => i.marketValue || 0)
    .reduce((a, b) => a + b, 0);
  const hardAssets = nateClient.hardAssets
    .map((i) => i.marketValue || 0)
    .reduce((a, b) => a + b, 0);

  const hardAssetLiabilites = nateClient.hardAssets
    .map((i) => i.debt || 0)
    .reduce((a, b) => a + b, 0);

  const contractualWealth =
    nateClient.lifeInsurance
      .map((i) => i.cashValue || 0)
      .reduce((a, b) => a + b, 0) +
    nateClient.accumulationAnnuity
      .map((i) => i.accountValue || 0)
      .reduce((a, b) => a + b, 0) +
    nateClient.personalPensionAnnuity
      .map((i) => i.accountValue || 0)
      .reduce((a, b) => a + b, 0);

  const assets = cashAssets + statementWealth + hardAssets;

  const liabilities =
    nateClient.debts.map((i) => i.balance || 0).reduce((a, b) => a + b, 0) +
    nateClient.hardAssets.map((i) => i.debt || 0).reduce((a, b) => a + b, 0);
  return (
    <Container active="analysis">
      <MapSection title="Analysis" defaultOpen>
        <div className="flex gap-4 p-4 w-full">
          <div className="flex flex-col gap-4 p-4 w-[500px]">
            <div className="w-full rounded-md">
              <table className="w-full border rounded-md">
                <thead
                  className={`text-xs cursor-pointer text-left sticky z-50 border-1 !font-normal`}
                >
                  <tr className="bg-gray-100">
                    <th className="px-2 py-3 font-medium rounded-tl-2xl">
                      Net Worth Summary
                    </th>
                    <th className="px-2 py-3 font-medium">Amount ($)</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="">
                    <td className="px-2 py-2 ">Assets</td>
                    <td className="px-2 py-2">{printNumber(assets)}</td>
                  </tr>
                  <tr className="">
                    <td className="px-2 py-2 ">Liabilities</td>
                    <td className="px-2 py-2">{printNumber(liabilities)}</td>
                  </tr>
                  <tr className=" font-semibold">
                    <td className="px-2 py-2 ">Net Worth</td>
                    <td className="px-2 py-2">
                      {printNumber(assets - liabilities)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="w-full">
              <table className="w-full border">
                <thead
                  className={`text-xs cursor-pointer text-left sticky z-50 border-1 !font-normal`}
                >
                  <tr className="bg-gray-100">
                    <th className="px-2 py-3 font-medium">
                      Asset Class - Summary
                    </th>
                    <th className="px-2 py-3 font-medium">Amount ($)</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="">
                    <td className="px-2 py-2 ">Cash</td>
                    <td className="px-2 py-2">{printNumber(cashAssets)}</td>
                  </tr>
                  <tr className="">
                    <td className="px-2 py-2 ">Contactual Wealth</td>
                    <td className="px-2 py-2">
                      {printNumber(contractualWealth)}
                    </td>
                  </tr>
                  <tr className="">
                    <td className="px-2 py-2 ">Statement Wealth</td>
                    <td className="px-2 py-2">
                      {printNumber(statementWealth)}
                    </td>
                  </tr>

                  <tr className="">
                    <td className="px-2 py-2 ">Hard Assets</td>
                    <td className="px-2 py-2">
                      {printNumber(hardAssets - hardAssetLiabilites)}
                    </td>
                  </tr>
                  <tr className="font-semibold">
                    <td className="px-2 py-2 ">Total Assets</td>
                    <td className="px-2 py-2">
                      {printNumber(
                        cashAssets +
                          statementWealth +
                          hardAssets -
                          hardAssetLiabilites,
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="w-full">
            <PieChart
              data={[
                {
                  label: "Cash",
                  value: cashAssets,
                },
                {
                  label: "Statement Wealth",
                  value: statementWealth,
                },
                {
                  label: "Hard Assets",
                  value: hardAssets,
                },
                {
                  label: "Contractual Wealth",
                  value: contractualWealth,
                },
              ]}
            />
          </div>
        </div>
      </MapSection>
    </Container>
  );
};

export default Analysis;
