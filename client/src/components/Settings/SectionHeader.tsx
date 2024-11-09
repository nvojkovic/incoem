import { SectionHeaderProps } from "./types";

const SectionHeader = ({ title }: SectionHeaderProps) => (
  <div className="text-lg border-r border-black pr-4 w-96">{title}</div>
);

export default SectionHeader;
