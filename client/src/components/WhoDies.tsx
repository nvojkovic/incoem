import Input from "./Inputs/Input";

const WhoDies = ({ active, setWhoDies, i, title, age, setAge }: any) => {
  return (
    <div
      className={`px-4 ${active ? "bg-main-orange text-white" : "bg-gray-200"} h-10 flex items-center gap-2 cursor-pointer border border-gray-300 border-1 ${i == 1 && "rounded-e-lg"} ${i == -1 && "rounded-s-lg text-xs"}`}
      onClick={() => setWhoDies(i)}
    >
      <span className="text-sm text-nowrap flex items-center gap-3">
        {title}
        {i != -1 && (
          <Input
            width="!w-12 text-black !py-0"
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
