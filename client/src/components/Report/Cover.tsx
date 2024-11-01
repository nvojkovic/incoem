const PrintCard = ({ title, subtitle }: any) => (
  <div className="bg-gray-10 py-3 px-6 rounded-lg border">
    <div className="uppercase text-gray-500 font-semibold text-xs mb-1 tracking-wider">
      {title}
    </div>
    <div className="font-semibold text-lg">{subtitle}</div>
  </div>
);

interface CoverProps {
  settings: ScenarioSettings;
  data: IncomeMapData;
  spending: RetirementSpendingSettings;
}
const ReportCover = ({ settings, data, spending }: CoverProps) => {
  return (
    <div>
      <div>
        <div className="flex gap-4">
          <PrintCard
            title="Inflation"
            subtitle={`${settings.inflation || 0}%`}
          />

          {data.people.length > 1 &&
            data.people.map(
              (person, i) =>
                settings.whoDies == i && (
                  <PrintCard
                    title={`${person.name}'s Death`}
                    subtitle={`${settings.deathYears[i]?.toString()} years`}
                  />
                ),
            )}

          {spending?.preTaxRate && (
            <PrintCard
              title={`Pre-Retirement Tax Rate`}
              subtitle={`${spending.preTaxRate}%`}
            />
          )}
          {settings?.retirementYear && (
            <PrintCard
              title={`Retirement Year`}
              subtitle={settings.retirementYear}
            />
          )}
        </div>
        <table className="border border-gray-400 text-xs hidden">
          <tbody>
            <tr className="border-b border-gray-400 ">
              <td className="border border-gray-400 px-2 bg-[#f9fafb] font-medium">
                Inflation
              </td>
              <td className="px-2 py-1">{settings.inflation}%</td>
            </tr>

            {data.people.length > 1 &&
              data.people.map(
                (person, i) =>
                  settings.whoDies == i && (
                    <tr>
                      <td className="border border-gray-400 px-2 bg-[#f9fafb] font-medium">{`${person.name}'s Death`}</td>
                      <td className="px-2 py-1">
                        {settings.deathYears[i]?.toString()}
                      </td>
                    </tr>
                  ),
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportCover;
