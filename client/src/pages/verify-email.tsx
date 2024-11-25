import { useState, useEffect } from "react";
import bg from "../assets/login-bg.png";
import Button from "../components/Inputs/Button";
import { useNavigate } from "react-router-dom";
import { sendVerificationEmail } from "supertokens-auth-react/recipe/emailverification";

const VerifyEmail = () => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setError(
      "We've sent a verification email to your address. Please check your inbox and click the link to verify your email.",
    );
  }, []);

  const resendEmail = async () => {
    setError("");
    try {
      setSubmitting(true);
      let response = await sendVerificationEmail();
      if (response.status === "EMAIL_ALREADY_VERIFIED_ERROR") {
        navigate("/clients");
      } else {
        setError(
          "A new verification email has been sent. Please check your inbox.",
        );
      }
    } catch (err: any) {
      if (err.isSuperTokensGeneralError === true) {
        setError(err.message);
      } else {
        setError("Oops! Something went wrong.");
      }
    }
    setSubmitting(false);
  };

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
            style={{ background: "radial-gradient(#aaa0,#f3f4f6)" }}
            className="w-full h-[768px] absolute top-0 left-0"
          ></div>
        </div>
        <div className="absolute text-black top-[200px] m-auto flex w-full z-50 flex-col items-center ">
          <div className="flex flex-col items-center justify-start w-[360px]">
            <img src="/img/logo.png" alt="" className="w-20 h-20" />
            <div className="font-semibold text-[30px] text-center">
              Verify your email address
            </div>
            <div className="text-[#475467] mb-10 text-center">{error}</div>
            <Button type="primary" onClick={resendEmail}>
              {submitting ? "Sending..." : "Resend verification email"}
            </Button>
            <div className="mb-6"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
