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

    const n = compounding === "Annual" ? 1 : 12; // Compounding frequency
    const timingFactor = timing === "Beginning of Year" ? 1 : 0;

    const calculateFV = (
      pv: number,
      r: number,
      t: number,
      pmt: number,
    ): number => {
      const i = r / (100 * n);
      return (
        pv * Math.pow(1 + i, n * t) +
        pmt * ((Math.pow(1 + i, n * t) - 1) / i) * (1 + i * timingFactor)
      );
    };

    const calculatePV = (
      fv: number,
      r: number,
      t: number,
      pmt: number,
    ): number => {
      const i = r / (100 * n);
      return (
        fv / Math.pow(1 + i, n * t) -
        pmt * ((1 - Math.pow(1 + i, -n * t)) / i) * (1 + i * timingFactor)
      );
    };

    const calculatePMT = (
      fv: number,
      pv: number,
      r: number,
      t: number,
    ): number => {
      const i = r / (100 * n);
      return (
        (fv - pv * Math.pow(1 + i, n * t)) /
        (((Math.pow(1 + i, n * t) - 1) / i) * (1 + i * timingFactor))
      );
    };

    // Newton-Raphson method for finding roots
    const newtonRaphson = (
      func: (x: number) => number,
      derivFunc: (x: number) => number,
      x0: number,
      epsilon: number = 1e-7,
      maxIterations: number = 100,
    ): number => {
      let x = x0;
      for (let i = 0; i < maxIterations; i++) {
        const fx = func(x);
        if (Math.abs(fx) < epsilon) {
          return x;
        }
        const dfx = derivFunc(x);
        if (dfx === 0) {
          throw new Error("Derivative is zero. Cannot continue.");
        }
        x = x - fx / dfx;
      }
      throw new Error("Failed to converge");
    };

    switch (calculatorType) {
      case "Future Value":
        return calculateFV(
          presentValue,
          interestRate,
          timePeriod,
          annualPayment,
        );
      case "Present Value":
        return calculatePV(
          futureValue,
          interestRate,
          timePeriod,
          annualPayment,
        );
      case "Interest Rate": {
        const func = (r: number) =>
          calculateFV(presentValue, r, timePeriod, annualPayment) - futureValue;
        const derivFunc = (r: number) => {
          const h = 1e-7;
          return (func(r + h) - func(r)) / h;
        };
        return newtonRaphson(func, derivFunc, 5); // Start with 5% guess, convert to percentage
      }
      case "Annual Payment":
        return calculatePMT(
          futureValue,
          presentValue,
          interestRate,
          timePeriod,
        );
      case "Time Period": {
        const func = (t: number) =>
          calculateFV(presentValue, interestRate, t, annualPayment) -
          futureValue;
        const derivFunc = (t: number) => {
          const h = 1e-7;
          return (func(t + h) - func(t)) / h;
        };
        return newtonRaphson(func, derivFunc, 10); // Start with 10 years guess
      }
      default:
        return 0;
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <Select
        label="Calculator"
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
          label="Future Value"
          value={state.futureValue}
          setValue={(value) => handleInputChange("futureValue", Number(value))}
          subtype="number"
        />
      )}

      {state.calculatorType !== "Present Value" && (
        <Input
          label="Present Value"
          value={state.presentValue}
          setValue={(value) => handleInputChange("presentValue", Number(value))}
          subtype="number"
        />
      )}

      {state.calculatorType !== "Interest Rate" && (
        <Input
          label="Interest Rate (%)"
          value={state.interestRate}
          setValue={(value) => handleInputChange("interestRate", Number(value))}
          subtype="number"
        />
      )}

      {state.calculatorType !== "Annual Payment" && (
        <Input
          label="Annual Payment"
          value={state.annualPayment}
          setValue={(value) =>
            handleInputChange("annualPayment", Number(value))
          }
          subtype="number"
        />
      )}

      {state.calculatorType !== "Time Period" && (
        <Input
          label="Time Period (years)"
          value={state.timePeriod}
          setValue={(value) => handleInputChange("timePeriod", Number(value))}
          subtype="number"
        />
      )}

      <Select
        label="Timing"
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
        {calculateResult().toFixed(2)}
      </div>
    </div>
  );
};

export default TimeValueCalculator;
