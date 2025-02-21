import { printNumber, yearRange } from "src/utils";
import Table from "../Calculators/Versatile/Table";
import VersatileSettings from "../Calculators/Versatile/VersatileSettings";
import {
  CalculatorSettings,
  StoredCalculator,
  cagr,
  calculateProjection,
  getReturns,
} from "../Calculators/Versatile/versatileTypes";
import VersatileBalance from "../Charts/VersatileBalance";
import { PrintClient } from "src/types";
import config from "src/services/config";

interface VersatileCalculatorProps {
  settings: StoredCalculator;
  client: PrintClient;
}

const VersatileReport = ({ client, settings }: VersatileCalculatorProps) => {
  const returnsMemo = getReturns(settings);
  const calculations = calculateProjection(settings, returnsMemo);
  const getRandom = (
    settings: CalculatorSettings,
    type: "best" | "mean" | "worst" | "25th" | "75th",
  ) => {
    const sett = {
      ...settings,
      returns: {
        ...settings.returns,
        selectedRandom: type as any,
      },
    };
    const s = getReturns(sett);
    return {
      data: calculateProjection(sett, s),
      returns: yearRange(1, settings.user.endYear).map((i) => s(i)),
    };
  };

  const chartData =
    settings.returns.returnType === "random"
      ? [
          {
            label: "Worst",
            ...getRandom(settings, "worst"),
            color: "#e74c3c", // Indigo color
          },
          {
            label: "25th",
            ...getRandom(settings, "25th"),
            color: "#ff8614", // Indigo color
          },
          {
            label: "Median",
            ...getRandom(settings, "mean"),
            color: "#46C6FF", // Indigo color
          },
          {
            label: "75th",
            ...getRandom(settings, "75th"),
            color: "#4693FF", // Indigo color
          },
          {
            label: "Best",
            ...getRandom(settings, "best"),
            color: "#2ecc71", // Indigo color
          },
        ]
      : [
          {
            label: "Balance",
            data: calculations,
            returns: yearRange(1, settings.user.endYear).map((i) =>
              returnsMemo(i),
            ),
            color: "#3498db", // Indigo color
          },
        ];
  return (
    <div className="px-10">
      <div className="flex">
        <div className="">
          <div className="flex flex-col gap-6">
            <div className="flex gap-3 items-center mb-9">
              <div>
                <img
                  src={
                    client?.userdata?.logo
                      ? `${config.PRINT_API_URL}logo?logo=${client?.userdata?.logo}`
                      : "/img/logo.png"
                  }
                  alt="logo"
                  className="h-16"
                />
              </div>
              <h1 className="font-light text-3xl">
                Versatile Report — {settings.name || "Live"}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <VersatileSettings settings={{ ...settings, id: null as any }} print />
      <div className="mb-12"></div>

      <div className="flex gap-4 justify-center mb-10">
        <div className="flex flex-col items-center  bg-white px-6 py-3 rounded-lg border">
          <div className="uppercase tracking-wide text-sm text-gray-800">
            Ending Balance
          </div>
          <div className="font-semibold text-lg mt-[2px]">
            <span
              className={
                calculations.length &&
                calculations[calculations.length - 1].endingBalance < 0
                  ? "text-red-500"
                  : ""
              }
            >
              {printNumber(
                calculations.length &&
                  calculations[calculations.length - 1].endingBalance,
              )}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center  bg-white px-6 py-3 rounded-lg border">
          <div className="uppercase tracking-wide text-sm text-gray-800">
            Total Payments
          </div>
          <div className="font-semibold text-lg mt-[2px]">
            {printNumber(
              calculations
                .map((i) => i.totalPayments)
                .reduce((a, b) => a + b, 0),
            )}{" "}
          </div>
        </div>
        <div className="flex flex-col items-center bg-white px-6 py-3 rounded-lg border w-40 relative">
          <div className="uppercase tracking-wide text-sm text-gray-800 flex gap-2">
            <div className="flex gap-2">
              <div>CAGR</div>
            </div>
          </div>
          <div className="font-semibold text-lg mt-[2px] ml-[10px]">
            {cagr(calculations.map((y) => returnsMemo(y.year)))}%
          </div>
        </div>
      </div>

      <VersatileBalance datasets={chartData} print prefix="" />
      <div className="break-after-page"></div>

      <Table
        calculations={calculations}
        returnsMemo={returnsMemo}
        open={true}
      />
    </div>
  );
};

export default VersatileReport;
