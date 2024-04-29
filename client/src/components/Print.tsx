import logo from "../assets/logo.png";
import ResultTable from "../components/ResultTable";

interface PrintProps {
  client: any;
  scenario: any;
}

const Print = ({ client, scenario }: PrintProps) => {
  return (
    <div className="mx-auto mt-10 px-10">
      <div className="mb-10 flex justify-between">
        <div className="font-semibold text-3xl">{client.title}</div>
        <div className="flex gap-6 items-center">
          <div>
            <div className="font-semibold text-2xl">
              {client?.userdata.firmName}
            </div>
          </div>
          <div>
            <img
              src={
                client?.userdata?.logo
                  ? `${import.meta.env.VITE_API_URL}logo?logo=${client?.userdata?.logo}`
                  : logo
              }
              alt="logo"
              className="h-10"
            />
          </div>
        </div>
      </div>
      <div>
        <ResultTable
          clientId={client.id}
          settings={scenario}
          changeFullScreen={() => {}}
          fullScreen={true}
          id={scenario.id}
          removeScenario={() => {}}
          selectedYear={0}
          setSelectedYear={() => {}}
          selectedColumn={{ id: 0, type: "none" }}
          setSelectedColumn={() => {}}
          data={scenario.data as any}
          name={scenario.name}
        />
      </div>
      <div className="mt-10 mb-20 italic">
        <div className="flex mb-10 gap-4">
          <div>
            <b>Prepared by: </b>
          </div>
          <div>
            <div>{client?.userdata.name}</div>
            <div>{client?.userdata.firmName}</div>
          </div>
        </div>
        <b className="mr-3">Disclosure: </b>
        {client?.userdata?.disclosures}
      </div>
    </div>
  );
};

export default Print;
