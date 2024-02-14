import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface Props {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}
const MapSection = ({ title, defaultOpen = false, children }: Props) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="flex-grow">
      <div
        className="flex justify-between mb-6 pb-3 border-b border-[#EAECF0] cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex flex-col">
          <div className="font-semibold text-lg ">{title}</div>
          <div className="text-[#475467]">{}</div>
        </div>
        {open ? (
          <ChevronUpIcon className="text-[#475467] w-6" />
        ) : (
          <ChevronDownIcon className="text-[#475467] w-6" />
        )}
      </div>
      <div
        className={` overflow-hidden transition-maxHeight duration-500 ease-in-out ${open ? "max-h-[1000px]" : "max-h-0 "}`}
      >
        {children}
      </div>
    </div>
  );
};

export default MapSection;
