import { useEffect, useState } from "react";
import { imageUrlToBase64 } from "src/utils";
import { deathText } from "./Cover";
import { PrintClient, ScenarioSettings } from "src/types";

const Header = ({
  client,
  scenario,
}: {
  client: PrintClient;
  scenario: ScenarioSettings;
}) => {
  const logoUrl = client?.userdata?.logo
    ? `${import.meta.env.VITE_API_URL}logo?logo=${client?.userdata?.logo}`
    : `${import.meta.env.VITE_APP_URL}/logo.png`;
  const [logoData, setLogoData] = useState("");
  useEffect(() => {
    imageUrlToBase64(logoUrl).then((data) => {
      setLogoData(data);
    });
  }, [logoUrl]);
  return (
    <div className="hidden">
      <div id="print-header">
        <div
          style={{
            width: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            fontSize: "12px",
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
              // color: "black",
              // backgroundColor: "#f0f0f0",
              color: "#444",
              display: "flex",
              justifyContent: "space-between",
              WebkitPrintColorAdjust: "exact",
              marginLeft: 10,
              marginRight: 10,
            }}
          >
            <div>{scenario.name}</div>
            <div style={{ display: "flex", gap: "10px" }}>
              <div>
                Inflation-Adjustment:{" "}
                <b>{`${scenario.inflationType === "Real" ? scenario.inflation || 0 : 0}%`}</b>
              </div>
              {scenario.people.length > 1 &&
                scenario.people.map(
                  (person, i) =>
                    scenario.whoDies == i &&
                    scenario.deathYears[i] && (
                      <div>
                        {`${person.name}'s Death: `}
                        <b>{deathText(person, scenario.deathYears[i])}</b>
                      </div>
                    ),
                )}
            </div>
            <div>
              <img
                src={`${logoData}`}
                alt="logo"
                style={{
                  height: "25px",
                  width: "auto",
                  maxHeight: "20px",
                  objectFit: "contain",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
