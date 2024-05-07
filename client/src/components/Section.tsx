const Section = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`border rounded-xl p-6 border-[#EAECF0] flex-grow bg-white ${className}`}
    >
      {children}
    </div>
  );
};

export default Section;
