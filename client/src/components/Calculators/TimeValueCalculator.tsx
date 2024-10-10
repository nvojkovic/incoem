// src/components/Calculators/TimeValueCalculator.tsx

import React, { useState, useEffect } from "react";
import Input from "../Inputs/Input";
import Select from "../Inputs/Select";

type CalculatorType =
  | "Future Value"
  | "Present Value"
  | "Interest Rate"
  | "Annual Payment"
  | "Time Period";

interface CalculatorState {
  futureValue: number;
  presentValue: number;
  interestRate: number;
  annualPayment: number;
  timePeriod: number;
  calculatorType: CalculatorType;
  timing: "Beginning of Year" | "End of Year";
  compounding: "Annual" | "Monthly";
}

const TimeValueCalculator: React.FC = () => {
  const [state, setState] = useState<CalculatorState>({
    futureValue: 0,
    presentValue: 0,
    interestRate: 0,
    annualPayment: 0,
    timePeriod: 0,
    calculatorType: "Future Value",
    timing: "End of Year",
    compounding: "Annual",
  });

  const calculatorOptions: CalculatorType[] = [
    "Future Value",
    "Present Value",
    "Interest Rate",
    "Annual Payment",
    "Time Period",
  ];

  const handleInputChange = (
    field: keyof CalculatorState,
    value: number | string,
  ) => {
    setState((prev) => ({ ...prev, [field]: value }));
  };

  const calculateResult = () => {
    const {
      futureValue,
      presentValue,
      interestRate,
      annualPayment,
      timePeriod,
      calculatorType,
      timing,
      compounding,
    } = state;

    const n = compounding === "Annual" ? 1 : 12;
    const t = timePeriod;

    const calculateFV = (r: number) => {
      const rate = r / 100;
      const paymentFactor = timing === "Beginning of Year" ? 1 + rate / n : 1;
      return (
        presentValue * Math.pow(1 + rate / n, n * t) +
        (annualPayment * paymentFactor * (Math.pow(1 + rate / n, n * t) - 1)) /
          (rate / n)
      );
    };

    switch (calculatorType) {
      case "Future Value":
        return calculateFV(interestRate);
      case "Present Value":
        const rate = interestRate / 100;
        const paymentFactor = timing === "Beginning of Year" ? 1 + rate / n : 1;
        return (
          futureValue / Math.pow(1 + rate / n, n * t) -
          (annualPayment *
            paymentFactor *
            (Math.pow(1 + rate / n, n * t) - 1)) /
            ((rate / n) * Math.pow(1 + rate / n, n * t))
        );
      case "Interest Rate":
        // Bisection method to find interest rate
        let low = 0;
        let high = 100;
        const tolerance = 0.0001;
        const maxIterations = 100;

        for (let i = 0; i < maxIterations; i++) {
          const mid = (low + high) / 2;
          const calculatedFV = calculateFV(mid);

          if (Math.abs(calculatedFV - futureValue) < tolerance) {
            return mid;
          }

          if (calculatedFV > futureValue) {
            high = mid;
          } else {
            low = mid;
          }
        }
        return (low + high) / 2;
      case "Annual Payment":
        const r = interestRate / 100;
        const pf = timing === "Beginning of Year" ? 1 + r / n : 1;
        return (
          (futureValue - presentValue * Math.pow(1 + r / n, n * t)) /
          ((pf * (Math.pow(1 + r / n, n * t) - 1)) / (r / n))
        );
      case "Time Period":
        // Newton-Raphson method for time period
        let guess = t;
        const maxIterations2 = 100;
        for (let i = 0; i < maxIterations2; i++) {
          const fv = calculateFV(interestRate);
          const derivative = (calculateFV(interestRate + 0.0001) - fv) / 0.0001;
          const newGuess = guess - (fv - futureValue) / derivative;
          if (Math.abs(newGuess - guess) < tolerance) {
            return newGuess;
          }
          guess = newGuess;
        }
        return guess;
      default:
        return 0;
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <Select
        label="Calculator"
        vertical
        options={calculatorOptions.map((option) => ({
          id: option,
          name: option,
        }))}
        selected={{ id: state.calculatorType, name: state.calculatorType }}
        setSelected={(option) =>
          handleInputChange("calculatorType", option.id as CalculatorType)
        }
      />

      {state.calculatorType !== "Future Value" && (
        <Input
          vertical
          label="Future Value"
          value={state.futureValue}
          setValue={(value) => handleInputChange("futureValue", Number(value))}
          subtype="money"
        />
      )}

      {state.calculatorType !== "Present Value" && (
        <Input
          vertical
          label="Present Value"
          value={state.presentValue}
          setValue={(value) => handleInputChange("presentValue", Number(value))}
          subtype="money"
        />
      )}

      {state.calculatorType !== "Interest Rate" && (
        <Input
          vertical
          label="Interest Rate (%)"
          value={state.interestRate}
          setValue={(value) => handleInputChange("interestRate", Number(value))}
          subtype="percent"
        />
      )}

      {state.calculatorType !== "Annual Payment" && (
        <Input
          vertical
          label="Annual Payment"
          value={state.annualPayment}
          setValue={(value) =>
            handleInputChange("annualPayment", Number(value))
          }
          subtype="money"
        />
      )}

      {state.calculatorType !== "Time Period" && (
        <Input
          vertical
          label="Time Period (years)"
          value={state.timePeriod}
          setValue={(value) => handleInputChange("timePeriod", Number(value))}
          subtype="number"
        />
      )}

      <Select
        label="Timing"
        vertical
        options={[
          { id: "Beginning of Year", name: "Beginning of Year" },
          { id: "End of Year", name: "End of Year" },
        ]}
        selected={{ id: state.timing, name: state.timing }}
        setSelected={(option) =>
          handleInputChange(
            "timing",
            option.id as "Beginning of Year" | "End of Year",
          )
        }
      />

      <div className="flex gap-2 mt-4">
        <button
          className={`flex-1 py-2 px-4 rounded ${
            state.compounding === "Annual"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => handleInputChange("compounding", "Annual")}
        >
          Annual
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded ${
            state.compounding === "Monthly"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => handleInputChange("compounding", "Monthly")}
        >
          Monthly
        </button>
      </div>

      <div className="mt-4 p-2 bg-green-100 rounded">
        <span className="font-bold">{state.calculatorType}:</span>{" "}
        {(() => {
          const result = calculateResult();
          if (isNaN(result) || !isFinite(result)) {
            return "Invalid input or calculation error";
          }
          switch (state.calculatorType) {
            case "Interest Rate":
              return result.toFixed(2) + "%";
            case "Time Period":
              return result.toFixed(2) + " years";
            default:
              return result.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              });
          }
        })()}
      </div>
    </div>
  );
};

export default TimeValueCalculator;
