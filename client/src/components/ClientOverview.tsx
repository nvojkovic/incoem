import { useInfo } from "../useData";
import { PeopleInfo } from "./Info/PersonInfo";
import Input from "./Inputs/Input";
import Layout from "./Layout";

const ClientOverview = () => {
  const { data, setField } = useInfo();
  return (
    <Layout page="basic">
      <div>
        <div title="Basic information">
          <div className="font-semibold text-2xl mb-5">Income information</div>
          <PeopleInfo />
        </div>
        <div className="h-10"></div>
        <div title="Settings">
          <div className="font-semibold text-2xl mb-5">Settings</div>
          <div className="w-72 bg-white p-3 rounded-lg shadow-md">
            <Input
              value={data.stabilityRatioFlag}
              setValue={setField("stabilityRatioFlag")}
              label="Stability Ratio"
              size="full"
              subtype="toggle"
            />
            <Input
              value={data.needsFlag}
              setValue={setField("needsFlag")}
              label="Spending"
              size="full"
              subtype="toggle"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ClientOverview;
