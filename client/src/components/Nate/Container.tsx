import Layout from "../Layout";
import { Link } from "react-router-dom";

const NavItem = ({ name, active, link }: any) => {
  return (
    <Link to={`../${link}`} className="w-full rounded-b-lg block">
      <div
        className={`font-semibold cursor-pointer text-medium rounded-b-lg w-full text-center py-2 ${active ? "bg-main-orange text-white" : "bg-white"}`}
      >
        {name}
      </div>
    </Link>
  );
};

const Container = ({ active, children }: any) => {
  return (
    <Layout page="nate">
      <div className="flex justify-between fixed top-[71px] w-[1400px] z-[500] shadow-md">
        <NavItem
          name="Income/Cash"
          active={active === "incomecash"}
          link="income-cash"
        />
        <NavItem
          name="Social Insurance"
          active={active === "social-insurance"}
          link="social-insurance"
        />
        <NavItem
          name="Contractual Wealth"
          active={active === "contractual-wealth"}
          link="contractual-wealth"
        />
        <NavItem
          name="Statement Wealth"
          active={active === "statement-wealth"}
          link="statement-wealth"
        />
        <NavItem
          name="Hard Assets"
          active={active === "hard-assets"}
          link="hard-assets"
        />
        <NavItem
          name="Debt/Inheritance"
          active={active === "debt-inheritance"}
          link="debt-inheritance"
        />
        <NavItem
          name="Analysis"
          active={active === "analysis"}
          link="analysis"
        />
      </div>
      <div className="mt-20">{children}</div>
    </Layout>
  );
};

export default Container;
