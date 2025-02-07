import React, { useState } from "react";
import Button from "src/components/Inputs/Button";
import { printNumber, yearRange } from "src/utils";
import {
  CalculatorSettings,
  cagr,
  calculateProjection,
  getReturns,
  initialVersatileSettings,
} from "./versatileTypes";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { useInfo } from "src/hooks/useData";
import Layout from "src/components/Layout";
import { Tooltip } from "flowbite-react";
import VersatileBalance from "src/components//Charts/VersatileBalance";
import VersatileSettings from "./VersatileSettings";
import Solve from "./Solve";
import Table from "./Table";

const VersatileCalculator: React.FC = () => {
  const { data: client, setField } = useInfo();
  const settings = client.versatileCalculator as CalculatorSettings;

  const returnsMemo = getReturns(settings);
  const calculations = calculateProjection(settings, returnsMemo);
  const [open, setOpen] = useState(true);
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
    <Layout page="calculator" wide>
      <div className="max-w-[1600px] mx-auto px-4 mt-[-25px]">
        <div className="flex gap-12">
          <div>
            <VersatileSettings />
          </div>
          <div className="w-[1200px]">
            <div className="sticky top-[50px] bg-[#f3f4f6] flex justify-between items-center gap-5 pb-8 z-[10] pt-12 mt-[-150px]">
              <div className="flex gap-4">
                <div className="flex flex-col items-center  bg-white px-6 py-3 rounded-lg shadow-md border">
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
                <div className="flex flex-col items-center  bg-white px-6 py-3 rounded-lg shadow-md border">
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
                <div className="flex flex-col items-center bg-white px-6 py-3 rounded-lg shadow-md border w-40 relative">
                  <div className="uppercase tracking-wide text-sm text-gray-800 flex gap-2">
                    <Tooltip
                      content={`Compound Annual Growth Rate for all ${settings.user.endYear} years`}
                      placement="bottom-end"
                      className="normal-case "
                    >
                      <div className="flex gap-2">
                        <div>CAGR</div>
                        <QuestionMarkCircleIcon className="h-5 w-5 text-[#D0D5DD] print:hidden" />
                      </div>
                    </Tooltip>
                  </div>
                  <div className="font-semibold text-lg mt-[2px] ml-[10px]">
                    {cagr(calculations.map((y) => returnsMemo(y.year)))}%
                  </div>
                </div>
              </div>
              <div className="flex gap-4 items-end">
                <Solve />
                <div className="w-40">
                  <Button
                    type="secondary"
                    onClick={() => {
                      setField("versatileCalculator")(initialVersatileSettings);
                    }}
                  >
                    Reset Inputs
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-white pt-3 pr-3 border rounded-lg mt-20 shadow-md sticky top-[200px]">
              {
                <div
                  className={`flex justify-end cursor-pointer ${"z-50 sticky top-[72px]"}`}
                  onClick={() => setOpen(!open)}
                >
                  {open ? (
                    <ChevronUpIcon className="text-[#475467] w-6" />
                  ) : (
                    <ChevronDownIcon className="text-[#475467] w-6" />
                  )}
                </div>
              }
              <div
                className={` transition-maxHeight w-full duration-500 ease-in-out ${open ? "max-h-[1500px]" : "max-h-0 overflow-hidden"}`}
              >
                <VersatileBalance datasets={chartData} />
              </div>
            </div>
            <div className=""></div>

            <div className="mt-[40px]">
              <Table
                calculations={calculations}
                returnsMemo={returnsMemo}
                open={open}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VersatileCalculator;
