const WhoDies = ({ active, setWhoDies, i, title }: any) => {
  return (
    <div
      className={`px-4 ${active ? "bg-[#F9FAFB]" : "bg-white"} py-2 flex items-center gap-2 cursor-pointer border border-1 ${i == 1 && "rounded-e-lg"} ${i == -1 && "rounded-s-lg"}`}
      onClick={() => setWhoDies(i)}
    >
      {active ? (
        <div className="bg-[#FF6C47] h-[10px] w-[10px] rounded-full" />
      ) : (
        <div className="bg-white h-[10px] w-[10px] rounded-full" />
      )}
      {title}
    </div>
  );
};

export default WhoDies;
