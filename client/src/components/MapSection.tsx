import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface Props {
  title: string | React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
  toggleabble?: boolean;
}
const MapSection = ({
  title,
  toggleabble,
  defaultOpen = false,
  children,
}: Props) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white p-3 border shadow-md rounded-lg">
      <div
        className={`flex justify-between mb-3 pb-3 border-b border-[#EAECF0] font-semibold text-2xl cursor-pointer ${toggleabble ? "" : "z-50 sticky top-[72px]"}`}
        onClick={() => toggleabble && setOpen(!open)}
      >
        {title}
        {toggleabble ? (
          open ? (
            <ChevronUpIcon className="text-[#475467] w-6" />
          ) : (
            <ChevronDownIcon className="text-[#475467] w-6" />
          )
        ) : null}
      </div>
      <div
        className={` transition-maxHeight w-full duration-500 ease-in-out ${open ? "max-h-[1000px]" : "max-h-0 overflow-hidden"}`}
      >
        {children}
      </div>
    </div>
  );
};

export default MapSection;

//
//
