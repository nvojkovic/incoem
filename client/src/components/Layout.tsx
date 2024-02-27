import useUser from "../useUser";
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
  const user = useUser();
  console.log("USER", user);
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
      <div className="max-w-[1280px] m-auto mb-32">{children}</div>
    </div>
  );
};

export default Layout;
