import ResultTable from "src/components/IncomeTable/ResultTable";
import { UserProvider } from "src/useUser";
import Header from "./Header";

interface PrintProps {
  client: any;
  scenario: any;
}

const Print = ({ client, scenario }: PrintProps) => {
  return (
    <UserProvider ignoreLogin>
      <Header client={client} scenario={scenario} />
      <div className="mx-auto px-10">
        <div>
          <ResultTable
            client={client}
            settings={scenario}
            changeFullScreen={() => {}}
            fullScreen={true}
            id={scenario.id}
            removeScenario={() => {}}
            selectedYear={0}
            setSelectedYear={() => {}}
            selectedColumn={{ id: 0, type: "none" }}
            setSelectedColumn={() => {}}
            name={scenario.name}
          />
        </div>
      </div>
    </UserProvider>
  );
};

export default Print;
