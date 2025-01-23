import { useState } from "react";
import bg from "../assets/login-bg.png";
import Input from "../components/Inputs/Input";
import Button from "../components/Inputs/Button";
import { sendPasswordResetEmail } from "supertokens-web-js/recipe/emailpassword";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = async () => {
    setError("");
    try {
      setSubmitting(true);
      let response = await sendPasswordResetEmail({
        formFields: [
          {
            id: "email",
            value: email,
          },
        ],
      });
      setSubmitting(false);

      if (response.status === "FIELD_ERROR") {
        response.formFields.forEach((formField) => {
          if (formField.id === "email") {
            // Email validation failed (for example incorrect email syntax).
            setError(formField.error);
          }
        });
      } else {
        // sign in successful. The session tokens are automatically handled by
        // the frontend SDK.
        setDone(true);
      }
    } catch (err: any) {
      console.log(err);
      setSubmitting(false);
      if (err.isSuperTokensGeneralError === true) {
        // this may be a custom error message sent from the API by you.
        setError(err.message);
      } else {
        setError("Oops! Something went wrong.");
      }
    }
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
          <div className="flex flex-col items-center justify-start">
            <img src="/img/logo.png" alt="" className="w-20 h-20" />
            {done ? (
              <div className="max-w-xs  text-center mt-10 text-lg">
                Check your email for a link to reset your password. If it
                doesn’t appear within a few minutes, check your spam folder.
              </div>
            ) : (
              <>
                <div className="font-semibold text-[30px] ">Reset Password</div>
                <div className="text-[#475467] mb-10"></div>
                {error && (
                  <div className="bg-[#ffd6cc] border border-red-500 px-10 py-3 rounded-md mb-10">
                    {error}
                  </div>
                )}
                <Input
                  subtype="text"
                  placeholder="Enter your email"
                  label="Email"
                  size="full"
                  type="email"
                  vertical
                  value={email}
                  setValue={setEmail}
                />
                <div className="mb-10"></div>
                <Button type="primary" onClick={submit}>
                  {submitting ? "Sending email..." : "Send email"}
                </Button>
                <div className="mb-6"></div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
