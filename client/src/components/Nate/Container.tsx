import { Spinner } from "flowbite-react";
import Layout from "../Layout";
import { Link } from "react-router-dom";
import { useState } from "react";

const NavItem = ({ name, active, link, color }: any) => {
  return (
    <Link to={`../${link}`} className="w-full rounded-b-lg block">
      <div
        className={`font-semibold cursor-pointer text-medium rounded-b-lg w-full text-center py-2 ${active ? "bg-main-orange text-white" : "bg-white"}`}
        style={{ backgroundColor: active && color }}
      >
        {name}
      </div>
    </Link>
  );
};

const Container = ({ active, children }: any) => {
  const [printing, setPrinting] = useState(false);

  const print = () => {
    setPrinting(true);
    setTimeout(() => {
      setPrinting(false);
    }, 1000);
  };
  return (
    <Layout page="asset-summary">
      <div className="flex justify-between fixed top-[71px] w-[1400px] z-[499] shadow-md bg-white">
        <NavItem
          name="Income/Cash"
          active={active === "incomecash"}
          link="income-cash"
          color="#002060"
        />
        <NavItem
          name="Social Insurance"
          active={active === "social-insurance"}
          link="social-insurance"
          color="#4471c4"
        />
        <NavItem
          name="Contractual Wealth"
          active={active === "contractual-wealth"}
          link="contractual-wealth"
          color="#00b050"
        />
        <NavItem
          name="Statement Wealth"
          active={active === "statement-wealth"}
          link="statement-wealth"
          color="#c00000"
        />
        <NavItem
          name="Hard Assets"
          active={active === "hard-assets"}
          link="hard-assets"
          color="#4471c4"
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

        <div
          className={`flex gap-2 p-2 ${printing ? "w-72" : "w-72"} justify-center`}
          onClick={print}
        >
          {printing ? (
            <Spinner className="h-5" />
          ) : (
            <img src="/icons/print.png" className="h-6  cursor-pointer" />
          )}
        </div>
      </div>
      <div className="mt-20">{children}</div>
    </Layout>
  );
};

export default Container;
