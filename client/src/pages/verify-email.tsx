import { useState } from "react";
import bg from "../assets/login-bg.png";
import logo from "../assets/logo.png";
import Button from "../components/Inputs/Button";
import { useNavigate } from "react-router-dom";
import { sendVerificationEmail } from "supertokens-auth-react/recipe/emailverification";

const VerifyEmail = () => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    setError("");
    try {
      setSubmitting(true);
      let response = await sendVerificationEmail();
      if (response.status === "EMAIL_ALREADY_VERIFIED_ERROR") {
        // This can happen if the info about email verification in the session was outdated.
        // Redirect the user to the home page
        navigate("/clients");
      } else {
        // email was sent successfully.
        setError("Please check your email and click the link in it");
      }
    } catch (err: any) {
      if (err.isSuperTokensGeneralError === true) {
        // this may be a custom error message sent from the API by you.
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
            style={{ background: "radial-gradient(#aaa0,#fff)" }}
            className="w-full h-[768px] absolute top-0 left-0"
          ></div>
        </div>
        <div className="absolute text-black top-[200px] m-auto flex w-full z-50 flex-col items-center ">
          <div className="flex flex-col items-center justify-start w-[360px]">
            <img src={logo} alt="" className="w-20 h-20" />
            <div className="font-semibold text-[30px] text-center">
              We need to verify your email address
            </div>
            <div className="text-[#475467] mb-10">
              Click the button to start verification process.
            </div>
            {error && (
              <div className="bg-[#ffd6cc] border border-red-500 px-10 py-3 rounded-md mb-10">
                {error}
              </div>
            )}
            <Button type="primary" onClick={submit}>
              {submitting ? "Sending..." : "Send email"}
            </Button>
            <div className="mb-6"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
