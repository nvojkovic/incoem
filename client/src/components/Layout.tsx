import Navbar from "./Navbar";

const Layout = ({
  page,
  children,
  household,
  hidden,
  onTabChange,
}: {
  children: React.ReactNode;
  page: string;
  hidden?: boolean;
  household?: string;
  onTabChange: any;
}) => {
  return (
    <div>
      <div className="sticky top-0 bg-white mb-6 z-[500]">
        {!hidden && (
          <Navbar
            active={page}
            onTabChange={onTabChange}
            household={household}
          />
        )}
      </div>
      <div className="max-w-[1480px] m-auto mb-32">{children}</div>
      {import.meta.env.VITE_ENV === "staging" && (
        <div className="fixed bottom-0 w-screen bg-red-500 h-10 text-white text-center flex items-center justify-center font-bold z-[10000]">
          DEVELOPMENT SERVER
        </div>
      )}
    </div>
  );
};

export default Layout;
