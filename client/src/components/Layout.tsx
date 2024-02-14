import logo from "../assets/logo.png";

const NavItem = ({ name, active }: { name: string; active: boolean }) => {
  return (
    <div
      className={`cursor-pointer py-2 px-3 font-semibold rounded-md ${active ? "bg-[#FF7957] text-white" : ""}`}
    >
      {name}
    </div>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div className="border-b border-[#EAECF0]">
        <div className="max-w-[1280px] m-auto flex justify-between items-center">
          <div className=" flex justify-between items-center h-[72px] bg-[#ffffff]">
            <div className="flex items-center">
              <img src={logo} className="w-9 h-9 mr-2" />
              <div className="font-bold text-[20px] leading-5">
                Income Mapper
              </div>
              <div className="ml-3 flex gap-0">
                <NavItem name="Home" active={true} />
                <NavItem name="Income Map" active={false} />
                <NavItem name="Summary" active={false} />
              </div>
            </div>
          </div>
          <div>profile</div>
        </div>
      </div>
      <div className="mt-6 max-w-[1280px] m-auto mb-32">{children}</div>
    </div>
  );
};

export default Layout;
