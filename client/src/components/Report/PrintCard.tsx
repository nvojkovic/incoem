export const PrintCard = ({ title, subtitle }: any) => (
  <div className="bg-gray-100 py-3 px-6 rounded-lg border">
    <div className="uppercase text-gray-500 font-semibold text-xs mb-1 tracking-wider">
      {title}
    </div>
    <div className="font-semibold text-">{subtitle}</div>
  </div>
);
