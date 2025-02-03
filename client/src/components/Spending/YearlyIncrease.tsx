import { YearlyIncrease } from "src/types";
import Input from "../Inputs/Input";
import Select from "../Inputs/Select";

interface Props {
  increase: YearlyIncrease;
  setYearlyIncrease: (a: YearlyIncrease) => void;
  labels: boolean;
}
const YearlyIncreaseComponent = ({
  increase,
  setYearlyIncrease,
  labels,
}: Props) => {
  return (
    <div className="flex gap-4">
      <div className={labels ? "" : "mt-1"}>
        <Select
          width="!w-[130px]"
          label={labels ? "Yearly Increase" : ""}
          tooltip={
            increase.type === "general"
              ? 'General will set the yearly increase equal to the "inflation" input set throughout the client file'
              : ""
          }
          vertical
          options={[
            { value: "general", name: "General" },
            { value: "none", name: "None" },
            { value: "custom", name: "Custom" },
          ]}
          selected={{
            name: (increase.type as any)?.capitalize(),
            value: increase.type,
          }}
          setSelected={(type) =>
            setYearlyIncrease({ ...increase, type: type.value })
          }
        />
      </div>
      {increase.type == "custom" && (
        <div className="">
          <Input
            label={labels ? "Increase (%)" : ""}
            vertical
            width={labels ? "" : "!w-[80px]"}
            size="md"
            subtype="percent"
            value={increase.percent}
            setValue={(v) => setYearlyIncrease({ ...increase, percent: v })}
          />
        </div>
      )}
    </div>
  );
};

export default YearlyIncreaseComponent;
