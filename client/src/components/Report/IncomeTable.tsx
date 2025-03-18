import ResultTable from "src/components/IncomeTable/ResultTable";
import { UserProvider } from "src/hooks/useUser";
import Header from "./Header";
import { PrintClient } from "src/types";

interface PrintProps {
  client: PrintClient;
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
            selectedYear={0}
            setSelectedYear={() => { }}
            selectedColumn={{ id: 0, type: "none" }}
            setSelectedColumn={() => { }}
          />
        </div>
        {client.liveSettings.showTaxType && (
          <div className="flex gap-4 text-sm mt-3">
            <div className="flex items-center gap-1">
              <div className={`h-4 w-4 rounded-full bg-green-100`}></div>
              <div>Tax-Free</div>
            </div>
            <div className="flex items-center gap-1">
              <div className={`h-4 w-4 rounded-full bg-pink-100`}></div>
              <div>Tax-Deferred</div>
            </div>
          </div>
        )}
      </div>
    </UserProvider>
  );
};

export default IncomeTable;
