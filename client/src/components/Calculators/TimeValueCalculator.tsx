import React from "react";
import Input from "../Inputs/Input";
import Select from "../Inputs/Select";
import { formatter } from "../../utils";
import Button from "../Inputs/Button";
import { DocumentDuplicateIcon, TrashIcon } from "@heroicons/react/24/outline";

const initialState: CalculatorState = {
  futureValue: 0,
  presentValue: 0,
  interestRate: 0,
  annualPayment: 0,
  timePeriod: 0,
  calculatorType: "Future Value",
  timing: "End of Year",
  compounding: "Annual",
};

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

const TimeValueCalculator: React.FC<any> = ({
  data,
  setData,
  remove,
  duplicate,
}) => {
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
    setData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleClear = () => {
    setData(() => initialState);
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
    } = data;

    const n = compounding === "Annual" ? 1 : 12;
    const t = timePeriod;
    const tolerance = 0.0001;

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

  const inputs = [
    <Select
      label="Calculator"
      vertical
      options={calculatorOptions.map((option) => ({
        id: option,
        name:
          option === "Annual Payment" ? `${data.compounding} Payment` : option,
      }))}
      selected={{
        id: data.calculatorType,
        name:
          data.calculatorType === "Annual Payment"
            ? `${data.compounding} Payment`
            : data.calculatorType,
      }}
      setSelected={(option) =>
        handleInputChange("calculatorType", option.id as CalculatorType)
      }
    />,
    data.calculatorType !== "Future Value" && (
      <Input
        vertical
        label="Future Value"
        size="lg"
        value={data.futureValue}
        setValue={(value) => handleInputChange("futureValue", Number(value))}
        subtype="money"
      />
    ),
    data.calculatorType !== "Present Value" && (
      <Input
        vertical
        size="lg"
        label="Present Value"
        value={data.presentValue}
        setValue={(value) => handleInputChange("presentValue", Number(value))}
        subtype="money"
      />
    ),
    data.calculatorType !== "Interest Rate" && (
      <Input
        vertical
        size="lg"
        label="Interest Rate (%)"
        value={data.interestRate}
        setValue={(value) => handleInputChange("interestRate", Number(value))}
        subtype="percent"
      />
    ),
    <div>
      <Select
        label="Timing"
        vertical
        options={[
          { id: "Beginning of Year", name: "Beginning of Year" },
          { id: "End of Year", name: "End of Year" },
        ]}
        selected={{ id: data.timing, name: data.timing }}
        setSelected={(option) =>
          handleInputChange(
            "timing",
            option.id as "Beginning of Year" | "End of Year",
          )
        }
      />
    </div>,

    data.calculatorType !== "Annual Payment" && (
      <Input
        vertical
        label="Payment"
        size="lg"
        value={data.annualPayment}
        setValue={(value) => handleInputChange("annualPayment", Number(value))}
        subtype="money"
      />
    ),
    data.calculatorType !== "Time Period" && (
      <Input
        vertical
        label="Time Period (years)"
        size="lg"
        value={data.timePeriod}
        setValue={(value) => handleInputChange("timePeriod", Number(value))}
        subtype="number"
      />
    ),
  ].filter((i) => i);

  return (
    <div className="border p-4 rounded-lg">
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex gap-6 justify-center">
          <div className="flex flex-col gap-2">
            {inputs.slice(0, 4).map((i) => i)}
          </div>
          <div className="flex flex-col gap-2">
            <div className="mb0 mt-[-4px]">
              <label className="text-sm text-[#344054] w-36 ">Compunding</label>
              <div className="flex gap-2 mt-[6px]">
                <button
                  className={`flex-1 py-[7px] px-4 rounded ${data.compounding === "Annual"
                      ? "bg-main-orange text-white"
                      : "bg-gray-200"
                    }`}
                  onClick={() => handleInputChange("compounding", "Annual")}
                >
                  Annual
                </button>
                <button
                  className={`flex-1 py-1 px-4 rounded ${data.compounding === "Monthly"
                      ? "bg-main-orange text-white"
                      : "bg-gray-200"
                    }`}
                  onClick={() => handleInputChange("compounding", "Monthly")}
                >
                  Monthly
                </button>
              </div>
            </div>
            {inputs.slice(4, 7).map((i) => i)}
            <div className="mt-[25px]">
              <Button type="secondary" onClick={handleClear}>
                Clear
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="">
              <div
                className="bg-gray-100 p-3 rounded-full cursor-pointer"
                onClick={duplicate}
              >
                <DocumentDuplicateIcon className="w-5" />
              </div>
            </div>
            <div className="">
              <div
                className="bg-[rgba(240,82,82,0.1)] p-3 rounded-full cursor-pointer"
                onClick={remove}
              >
                <TrashIcon className="text-red-500 w-5" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 p-2 rounded text-center">
          <span className="font-bold">
            {data.calculatorType === "Annual Payment"
              ? `${data.compounding} Payment`
              : data.calculatorType}
            :
          </span>{" "}
          {(() => {
            const result = calculateResult();
            if (isNaN(result) || !isFinite(result)) {
              return "N/A";
            }
            switch (data.calculatorType) {
              case "Interest Rate":
                return result.toFixed(2) + "%";
              case "Time Period":
                return result.toFixed(2) + " years";
              default:
                return formatter.format(result);
            }
          })()}
        </div>
      </div>
    </div>
  );
};

export default TimeValueCalculator;
