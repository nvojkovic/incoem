import calculate from "../calculator/calculate";
import title from "../calculator/title";
import Input from "./Inputs/Input";

const yearRange: (start: number, end: number) => number[] = (start, end) => {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const print = (a: number | string) => {
  if (typeof a === "number") {
    return `${formatter.format(a)}`;
  }
  return a;
};

const ResultTable = ({
  data,
  settings,
  name,
}: {
  data: IncomeMapData;
  settings: ScenarioSettings;
  name?: string;
}) => {
  const startYear = new Date().getFullYear();
  return (
    <div className="rounded-xl border-[#EAECF0] border">
      {name && (
        <div className="flex p-5 py-8 gap-5 items-center justify-between">
          <div className="text-[#101828] font-semibold text-[18px] ">
            {name}
          </div>
          <div className="flex gap-5">
            {data.people.length > 1 &&
              data.people.map(
                (person, i) =>
                  settings.whoDies == i && (
                    <Input
                      subtype="number"
                      disabled
                      label={`${person.name}'s death`}
                      value={settings.deathYears[i]?.toString()}
                      setValue={() => { }}
                    />
                  ),
              )}
            <Input
              label="Max years shown"
              subtype="number"
              size="md"
              disabled
              value={settings.maxYearsShown?.toString()}
              setValue={() => { }}
            />
            <Input
              label="Inflation"
              disabled
              subtype="percent"
              value={settings.inflation?.toString()}
              setValue={() => { }}
            />
          </div>
        </div>
      )}
      <table className=" w-full">
        <thead className="text-xs bg-[#F9FAFB] text-[#475467] font-medium text-left">
          <th className="px-6 py-3">Year</th>
          <th className="px-6 py-3">Age</th>
          {data.incomes.map((_, i) => (
            <th className="px-6 py-3">{title(data.incomes, data.people, i)}</th>
          ))}
          <th className="px-6 py-3">Total</th>
        </thead>
        <tbody className="text-sm">
          {yearRange(startYear, startYear + settings.maxYearsShown - 1).map(
            (currentYear, i) => (
              <tr
                className={`${i % 2 == 1 ? "bg-[#F9FAFB]" : "bg-white"} border border-[#EAECF0]`}
              >
                <td className="font-medium px-6 py-4">{currentYear}</td>
                <td className="font-medium px-6 py-4">
                  {data.people.map((p) => currentYear - p.birthYear).join("/")}
                </td>
                {data.incomes.map((income) => (
                  <td className="px-6 py-4 text-[#475467]">
                    {print(
                      calculate({
                        people: data.people,
                        income,
                        startYear,
                        currentYear,
                        deathYears: settings.deathYears as any,
                        dead: settings.whoDies,
                        inflation: settings.inflation,
                      }),
                    )}
                  </td>
                ))}
                <td className="font-normal px-6 py-4 text-[#475467]">
                  {formatter.format(
                    data?.incomes
                      .map(
                        (income) =>
                          calculate({
                            people: data.people,
                            income,
                            startYear,
                            currentYear,
                            deathYears: settings.deathYears as any,
                            dead: settings.whoDies,
                            inflation: settings.inflation,
                          }) as any,
                      )
                      .filter((t) => typeof t === "number")
                      .reduce((a, b) => a + b, 0)
                      .toFixed(0),
                  )}
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ResultTable;
