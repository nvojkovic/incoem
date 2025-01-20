import Input from "./Inputs/Input";

const WhoDies = ({
  active,
  setWhoDies,
  i,
  title,
  age,
  setAge,
  disabled,
}: any) => {
  return (
    <div
      className={`pl-4 ${i !== -1 ? "pr-1" : "pr-3"} ${active ? "bg-main-orange text-white" : "bg-gray-200 text-[#555860]"} font-medium h-10 flex items-center gap-2 cursor-pointer border border-gray-300 border-1 ${i == 1 && "rounded-e-lg"} h-[32px] ${i == -1 && "rounded-s-lg text-xs"}`}
      onClick={() => setWhoDies(i)}
    >
      <span className="text-sm text-nowrap flex items-center gap-3">
        {title}
        {i != -1 && (
          <Input
            disabled={disabled}
            width="!w-12 text-black !font-normal !py-0 !rounded-[5px]"
            label=""
            labelLength={0}
            value={age || ""}
            setValue={setAge}
          />
        )}
      </span>
    </div>
  );
};

export default WhoDies;
