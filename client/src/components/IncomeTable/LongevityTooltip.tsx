import { Tooltip } from "flowbite-react";
import { Client } from "src/types";
import { jointTable, makeTable } from "../Longevity/calculate";

const LongevityTooltip = ({
  client,
  currentYear,
  children,
}: {
  client: Client;
  currentYear: number;
  children: React.ReactElement;
}) => {
  const people = client.people;

  if (!client.longevityFlag || !client.people.every((p) => p.sex))
    return children;

  return (
    <Tooltip
      content={(() => {
        const joint =
          people.length > 1 ? (
            <div>
              Joint:{" "}
              {Math.round(
                (jointTable(people[0], people[1]).find(
                  (i) => i.year === currentYear,
                )?.oneAlive || 0) * 1000,
              ) / 10}
              %
            </div>
          ) : null;
        const table = people.map((p) => {
          const t = makeTable(p);
          const item = t.table.find((i) => i.year == currentYear);
          if (!item) return null;
          return (
            <div key={p.name}>
              {p.name}: {Math.round(item?.probability * 1000) / 10}%
            </div>
          );
        });
        return (
          <div className="z-[5000000] bg-white w-40 sticky">
            <b>Survival Probability</b>
            {<>{table}</>}
            {joint}
          </div>
        );
      })()}
      theme={{ target: "" }}
      placement="bottom"
      style="light"
      arrow={false}
      className={`!z-[50000] border-2 border-main-orange bg-white print:hidden cursor-pointer`}
    >
      {children}
    </Tooltip>
  );
};

export default LongevityTooltip;
