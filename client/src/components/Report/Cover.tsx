import logo from "src/assets/logo.png";

const PrintCard = ({ title, subtitle }: any) => (
  <div className="bg-gray-100 py-3 px-6 rounded-lg border">
    <div className="uppercase text-gray-500 font-semibold text-xs mb-1 tracking-wider">
      {title}
    </div>
    <div className="font-semibold text-">{subtitle}</div>
  </div>
);

interface CoverProps {
  settings: ScenarioSettings;
  client: PrintClient;
}
const ReportCover = ({ settings, client }: CoverProps) => {
  return (
    <div className="w-screen h-full flex items-center p-10 ">
      <div className="flex gap-8 w-full">
        <div className="w-[45%]">
          <div className="flex flex-col gap-4">
            <div>
              <img
                src={
                  client?.userdata?.logo
                    ? `${import.meta.env.VITE_API_URL}logo?logo=${client?.userdata?.logo}`
                    : logo
                }
                alt="logo"
                className="h-20"
              />
            </div>
            <div className="font-light text-3xl">
              {client?.userdata.firmName}
            </div>
            <div>
              <b>Prepared by: </b>
              <div>{client?.userdata.name}</div>
            </div>
            <div>
              <b className="mr-3">Disclosure: </b>
              <div className="text-xs max-w- italic text-gray-600">
                {client?.userdata.disclosures
                  ?.split("\n")
                  .map((i) => <p className="mb-2">{i}</p>)}
              </div>
            </div>
          </div>
        </div>
        <div className="w-[65%] flex flex-col gap-4">
          <div className="h-20"></div>
          <div className="text-2xl font-light">
            {client?.title} {settings.name && `(${settings.name})`}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <PrintCard
              title="Inflation"
              subtitle={`${settings.inflation || 0}%`}
            />

            {settings.data.people.length > 1 &&
              settings.data.people.map(
                (person, i) =>
                  settings.whoDies == i && (
                    <PrintCard
                      title={`${person.name}'s Death`}
                      subtitle={`${settings.deathYears[i]?.toString()} years`}
                    />
                  ),
              )}

            {settings.spending?.preTaxRate && (
              <PrintCard
                title={`Pre-Retirement Tax Rate`}
                subtitle={`${settings.spending.preTaxRate}%`}
              />
            )}
            {settings.spending?.postTaxRate && (
              <PrintCard
                title={`Post-Retirement Tax Rate`}
                subtitle={`${settings.spending.postTaxRate}%`}
              />
            )}
            {settings?.retirementYear && (
              <PrintCard
                title={`Retirement Year`}
                subtitle={settings.retirementYear}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCover;
