import { SectionHeaderProps } from "./types";

const SectionHeader = ({ title, subtitle }: SectionHeaderProps) => (
  <div className="text-lg border-black pr-4 w-80 min-w-80">
    {title}
    <div className="italic text-gray-500 mt-1 text-sm">{subtitle}</div>
  </div>
);

export default SectionHeader;
