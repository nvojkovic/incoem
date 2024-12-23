import ResultTable from "src/components/IncomeTable/ResultTable";
import { UserProvider } from "src/useUser";
import Header from "./Header";

interface PrintProps {
  client: any;
  scenario: any;
}

const IncomeTable = ({ client, scenario }: PrintProps) => {
  return (
    <UserProvider ignoreLogin>
      <Header client={client} scenario={scenario} />

      <div className="w-full pt-5 flex justify-center">
        <div className="text-2xl mx-auto mb-5">Income</div>
      </div>
      <div className="mx-auto px-10">
        <div>
          <ResultTable
            client={client}
            settings={scenario}
            changeFullScreen={() => { }}
            fullScreen={true}
            id={scenario.id}
            removeScenario={() => { }}
            selectedYear={0}
            setSelectedYear={() => { }}
            selectedColumn={{ id: 0, type: "none" }}
            setSelectedColumn={() => { }}
          />
        </div>
      </div>
    </UserProvider>
  );
};

export default IncomeTable;
