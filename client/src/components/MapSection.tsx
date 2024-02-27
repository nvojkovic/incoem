import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface Props {
  title: string | React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}
const MapSection = ({ title, defaultOpen = false, children }: Props) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="flex-grow">
      <div
        className="flex justify-between mb-6 pb-3 border-b border-[#EAECF0] cursor-pointer font-semibold text-lg"
        onClick={() => setOpen(!open)}
      >
        {title}
        {open ? (
          <ChevronUpIcon className="text-[#475467] w-6" />
        ) : (
          <ChevronDownIcon className="text-[#475467] w-6" />
        )}
      </div>
      <div
        className={` transition-maxHeight duration-500 ease-in-out ${open ? "max-h-[1000px]" : "max-h-0 overflow-hidden"}`}
      >
        {children}
      </div>
    </div>
  );
};

export default MapSection;
