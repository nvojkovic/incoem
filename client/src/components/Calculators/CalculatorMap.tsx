import React, { useState } from "react";
import VersatileCalculator from "./VersatileCalculator";

interface CalculatorCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const calculators: CalculatorCard[] = [
  {
    id: "versatile",
    title: "Versatile Calculator",
    description: "Calculate projections and estimate necessary rate of return",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

const CalculatorMap: React.FC = () => {
  const [calculator, setCalculator] = useState("");
  if (calculator === "versatile") return <VersatileCalculator />;
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Financial Calculators</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {calculators.map((calc) => (
          <div
            className="border rounded-xl  border-[#EAECF0] flex-grow w-fullransition-shadow duration-300 p-5 cursor-pointer"
            onClick={() => setCalculator(calc.id)}
          >
            <div className="flex items-center mb-4">
              <div className="bg-[#fff0ec] rounded-full p-3 mr-4">
                {calc.icon}
              </div>
              <h2 className="text-xl font-semibold">{calc.title}</h2>
            </div>
            <p className="text-gray-600">{calc.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalculatorMap;
