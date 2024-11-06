import { useInfo } from "../useData";
import { PeopleInfo } from "./Info/PersonInfo";
import Input from "./Inputs/Input";
import Layout from "./Layout";
import MapSection from "./MapSection";

const ClientOverview = () => {
  const { data, setField } = useInfo();
  return (
    <Layout page="basic">
      <div>
        <MapSection title="Basic information" defaultOpen={true}>
          <PeopleInfo />
        </MapSection>
        <div className="h-10"></div>
        <MapSection title="Settings" defaultOpen>
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
        </MapSection>
      </div>
    </Layout>
  );
};

export default ClientOverview;
