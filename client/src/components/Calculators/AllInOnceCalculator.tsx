import React from "react";
import TimeValueCalculator from "./TimeValueCalculator";
import { ArrowLeftIcon, PlusIcon } from "@heroicons/react/24/outline";

const initialState = {
  futureValue: 0,
  presentValue: 0,
  interestRate: 0,
  annualPayment: 0,
  timePeriod: 0,
  calculatorType: "Future Value",
  timing: "End of Year",
  compounding: "Annual",
};
const AllInOneCalculator: React.FC<any> = ({ back, data, setData }) => {
  return (
    <div className="bg-white p-6 rounded-lg">
      <div className="flex gap-3 items-center mb-8">
        <div
          className="rounded-full border border-gray-400 h-8 w-8 flex justify-center items-center cursor-pointer"
          onClick={back}
        >
          <ArrowLeftIcon className="h-5 text-gray-500" />
        </div>
        <h1 className="text-3xl font-bold">All-In-One Calculator</h1>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-2 gap-10">
        {data.map((item: any, index: any) => (
          <TimeValueCalculator
            data={item}
            setData={(fn: any) => {
              setData(
                data.map((item: any, i: any) => (i == index ? fn(item) : item)),
              );
            }}
            remove={() => setData(data.filter((_: any, i: any) => i !== index))}
            duplicate={() =>
              setData(
                data.flatMap((item: any, i: any) =>
                  i === index ? [item, { ...item }] : [item],
                ),
              )
            }
          />
        ))}
        <div
          className="border p-4 rounded-lg h-[400px] flex justify-center items-center cursor-pointer"
          onClick={() => setData([...data, initialState])}
        >
          <div className="flex flex-col justify-center items-center gap-2 ">
            <div
              className="text-main-orange rounded-full w-12"
              style={{
                backgroundColor: "rgba(var(--primary-color-segment),0.1)",
              }}
            >
              <PlusIcon />
            </div>
            <div>Add another calculator</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllInOneCalculator;
