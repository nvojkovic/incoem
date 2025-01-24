import SpendChart from "../SpendChart";

const SpendingChart = ({ scenario, client }: any) => {
  return (
    <div>
      <div className="w-full pt-5 flex justify-center">
        <div className="text-2xl mx-auto mb-5">Spending</div>
      </div>
      <SpendChart settings={scenario} client={client} print />
    </div>
  );
};

export default SpendingChart;
