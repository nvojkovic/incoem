import React from "react";
import Layout from "../Layout";
import { Link } from "react-router-dom";

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
  {
    id: "payment",
    title: "Payment Calculator",
    description: "Time value of money calculator",
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
          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
  },
];

const CalculatorMap: React.FC<any> = ({ }: any) => {
  return (
    <Layout page="calculator">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {calculators.map((calc) => (
            <Link to={calc.id}>
              <div
                key={calc.id}
                className="border rounded-xl border-[#EAECF0] flex-grow w-full transition-shadow duration-300 p-5 cursor-pointer bg-white shadow-md h-full"
              >
                <div className="flex items-center mb-4 ">
                  <div className="bg-main-orange-light rounded-full p-3 mr-4">
                    {calc.icon}
                  </div>
                  <h2 className="text-xl font-semibold">{calc.title}</h2>
                </div>
                <p className="text-gray-600">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default CalculatorMap;
