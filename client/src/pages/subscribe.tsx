import { useNavigate } from "react-router-dom";
import useWindowFocus from "use-window-focus";
import Button from "../components/Inputs/Button";
import Session from "supertokens-web-js/recipe/session";
import { useUser } from "../hooks/useUser";
import { useEffect } from "react";

const KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const TABLE = import.meta.env.VITE_STRIPE_PRICING_TABLE_ID;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "stripe-pricing-table": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

const Subscribe = () => {
  const { user, fetchUser } = useUser();
  const navigate = useNavigate();

  const windowFocused = useWindowFocus();

  useEffect(() => {
    if (user?.info?.subsciptionStatus === "active") {
      navigate("/");
    }
  }, [user]);

  useEffect(() => {
    if (windowFocused) {
      fetchUser();
    }
  }, [windowFocused]);
  // const subscribe = async () => {
  //   const d = await fetch(
  //     import.meta.env.VITE_API_URL + "stripeSubscribe",
  //   ).then((a) => a.json());
  //   window.open(d.url, "_blank");
  // };
  return (
    <div className="w-full flex justify-center">
      <div className="flex items-center justify-center h-screen m-auto w-auto relative">
        <div className="text-black top-[200px] flex w-full z-50 flex-col items-center bg-white py-4 px-12 rounded-xl shadow-lg border">
          <div className="flex flex-col items-center justify-start w-[360px]">
            <img src="logo.png" alt="" className="w-20 h-20" />
            <div className="font-semibold text-[30px] text-center mb-6">
              Choose a plan to start using Income Mapper
            </div>
            <stripe-pricing-table
              pricing-table-id={TABLE}
              customer-email={user?.info?.email}
              publishable-key={KEY}
            ></stripe-pricing-table>
            <div className="mb-4"></div>
            <Button
              type="secondary"
              onClick={async () => {
                navigate("/login");
                await Session.signOut();
              }}
            >
              Sign out
            </Button>

            <div className="mb-6"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
