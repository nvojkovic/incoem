import logo from "src/assets/logo.png";
import ResultTable from "src/components/IncomeTable/ResultTable";
import { UserProvider } from "src/useUser";

interface PrintProps {
  client: any;
  scenario: any;
}

const Print = ({ client, scenario }: PrintProps) => {
  return (
    <UserProvider ignoreLogin>
      <div className="hidden">
        <div id="print-header">
          <div
            style={{
              width: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              fontSize: "10px",
              color: "black",
              // backgroundColor: "#f0f0f0",
              display: "flex",
              justifyContent: "space-between",
              WebkitPrintColorAdjust: "exact",
            }}
          >
            <div
              className="flex justify-between border-b border-[#f0f]"
              style={{
                borderBottom: "1px solid #aaa",
                width: "calc(100% - 50px)",
                padding: "10px 20px",
                paddingTop: "20px",
                color: "black",
                // backgroundColor: "#f0f0f0",
                display: "flex",
                justifyContent: "space-between",
                WebkitPrintColorAdjust: "exact",
                marginLeft: 10,
                marginRight: 10,
              }}
            >
              <div>{scenario.name}</div>
              <div>Inflation: 3%</div>
              <div>
                <img
                  src={
                    client?.userdata?.logo
                      ? `${import.meta.env.VITE_API_URL}logo?logo=${client?.userdata?.logo}`
                      : logo
                  }
                  alt="logo"
                  className="h-5"
                />
              </div>
            </div>
          </div>
        </div>
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
            name={scenario.name}
          />
        </div>
      </div>
    </UserProvider>
  );
};

export default Print;
