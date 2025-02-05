import { useNavigate } from "react-router-dom";
import bg from "../assets/login-bg.png";
import useWindowFocus from "use-window-focus";
import Button from "../components/Inputs/Button";
import Session from "supertokens-web-js/recipe/session";
import { useUser } from "../hooks/useUser";
import { useEffect } from "react";

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

const Paused = () => {
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

  return (
    <div className="w-full flex justify-center">
      <div className="m-auto w-auto relative">
        <div className="w-[768px] h-[768px] relative mt-[-300px]">
          <img
            src={bg}
            alt=""
            className="w-[768px] h-[768px] absolute top-0 "
          />
          <div
            style={{ background: "radial-gradient(#aaa0,#fff)" }}
            className="w-full h-[768px] absolute top-0 left-0"
          ></div>
        </div>
        <div className="absolute text-black top-[200px] m-auto flex w-full z-50 flex-col items-center ">
          <div className="flex flex-col items-center justify-start w-[360px]">
            <img src="/img/logo.png" alt="" className="w-20 h-20" />
            <div className="font-semibold text-[30px] text-center mb-6">
              Your trial has finished, please add a payment method to continue
            </div>
            <div className="mb-4"></div>
            <Button
              type="primary"
              onClick={async () => {
                const d = await fetch(
                  import.meta.env.VITE_API_URL + "stripeRedirect",
                ).then((a) => a.json());
                window.open(d.url, "_blank");
              }}
            >
              Billing settings
            </Button>
            <div className="mb-5"></div>
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

export default Paused;
