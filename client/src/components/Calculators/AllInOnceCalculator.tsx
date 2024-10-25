import React from "react";
import TimeValueCalculator from "./TimeValueCalculator";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const AllInOneCalculator: React.FC<any> = ({ back }) => {
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
        <TimeValueCalculator />
        <TimeValueCalculator />
        <TimeValueCalculator />
        <TimeValueCalculator />
      </div>
    </div>
  );
};

export default AllInOneCalculator;
