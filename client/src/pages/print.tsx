import { useParams } from "react-router-dom";
import logo from "../assets/logo.png";
import ResultTable from "../components/ResultTable";
import { useEffect, useState } from "react";
import { getClient } from "../services/client";
import useUser from "../useUser";

const Print = () => {
  const [client, setClient] = useState({} as any);
  const { id, scenarioId } = useParams();
  const { user } = useUser();
  useEffect(() => {
    getClient(id)
      .then((data) => data.json())
      .then((data) => {
        setClient(data);
      });
  }, [id, scenarioId]);

  const scenario = client?.scenarios?.find((s: any) => s.id == scenarioId);
  if (!scenario) return null;
  return (
    <div className="max-w-[1280px] mx-auto mt-10 px-10">
      <div className="mb-10 flex justify-between">
        <div className="font-semibold text-3xl">{scenario.name}</div>
        <div className="flex gap-6">
          <div>
            <div className="font-semibold text-2xl mb-3">
              {user?.info.firmName}
            </div>
            <div className="font-regular text-xl">{user?.info.name}</div>
          </div>
          <img src={logo} alt="logo" className="w-20" />
        </div>
      </div>
      <div>
        <ResultTable
          settings={scenario}
          fullScreen={true}
          id={scenario.id}
          removeScenario={() => { }}
          selectedYear={0}
          setSelectedYear={() => { }}
          selectedColumn={{ id: 0, type: "none" }}
          setSelectedColumn={() => { }}
          data={scenario.data as any}
          name={scenario.name}
        />
      </div>
      <div className="mt-10 mb-20 italic">
        <b>Disclosure: </b>
        {user?.info?.disclosures}
      </div>
    </div>
  );
};
export default Print;
