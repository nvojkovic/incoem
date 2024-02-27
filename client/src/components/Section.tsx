const Section = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="border rounded-xl p-6 border-[#EAECF0] flex-grow bg-white">
      {children}
    </div>
  );
};

export default Section;
