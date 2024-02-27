import Navbar from "./Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar active="data" />
      <div className="mt-6 max-w-[1280px] m-auto mb-32">{children}</div>
    </div>
  );
};

export default Layout;
