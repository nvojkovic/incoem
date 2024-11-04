import Input from "./Inputs/Input";

const WhoDies = ({ active, setWhoDies, i, title, age, setAge }: any) => {
  return (
    <div
      className={`px-4 ${active ? "bg-[#F9FAFB]" : "bg-white"} h-12 flex items-center gap-2 cursor-pointer border border-1 ${i == 1 && "rounded-e-lg"} ${i == -1 && "rounded-s-lg text-xs"}`}
      onClick={() => setWhoDies(i)}
    >
      {active ? (
        <div className="bg-main-orange h-[10px] w-[10px] rounded-full" />
      ) : (
        <div className="bg-white h-[10px] w-[10px] rounded-full" />
      )}
      <span className="text-sm text-nowrap flex items-center gap-3">
        {title}
        {i != -1 &&
          (active ? (
            <Input
              width="!w-12"
              label=""
              labelLength={0}
              value={age}
              setValue={setAge}
            />
          ) : (
            ` ${age !== null && age !== undefined ? age : ""}`
          ))}
      </span>
    </div>
  );
};

export default WhoDies;
