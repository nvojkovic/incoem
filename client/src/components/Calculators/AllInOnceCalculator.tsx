import React from "react";
import TimeValueCalculator from "./TimeValueCalculator";

const AllInOneCalculator: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">All-In-One Calculator</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TimeValueCalculator />
        <TimeValueCalculator />
        <TimeValueCalculator />
      </div>
    </div>
  );
};

export default AllInOneCalculator;
