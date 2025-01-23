import MapChart from "../MapChart";

const IncomeChart = ({ scenario, client }: any) => {
  return (
    <div className="max-h-screen">
      <div className="w-full pt-5 flex justify-center">
        <div className="text-2xl mx-auto mb-5">Income </div>
      </div>
      <MapChart settings={scenario} client={client} print />
    </div>
  );
};

export default IncomeChart;
