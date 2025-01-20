const SmallToggle = ({ item1, item2, active, toggle }: any) => {
  return (
    <div className="flex text-sm cursor-pointer border-collapse">
      <div
        className={`${active === item1 ? "bg-main-orange text-white" : "bg-gray-200 text-black"} px-3 py-[3px] rounded-l-md  border  border-gray-300 border-1`}
        onClick={toggle}
      >
        {item1}
      </div>
      <div
        className={`${active === item2 ? "bg-main-orange text-white" : "bg-gray-200 text-black"} px-3 py-[3px] rounded-r-md ml-[-1px] border  border-gray-300 border-1`}
        onClick={toggle}
      >
        {item2}
      </div>
    </div>
  );
};

export default SmallToggle;
