import { useState } from "react";
import bg from "../assets/login-bg.png";
import Input from "../components/Inputs/Input";
import Button from "../components/Inputs/Button";
import { submitNewPassword } from "supertokens-web-js/recipe/emailpassword";
import { Link } from "react-router-dom";

const ResetPasswordConfirm = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = async () => {
    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      let response = await submitNewPassword({
        formFields: [
          {
            id: "password",
            value: newPassword,
          },
        ],
      });

      setSubmitting(false);

      if (response.status === "FIELD_ERROR") {
        response.formFields.forEach((formField) => {
          if (formField.id === "password") {
            // New password did not meet password criteria on the backend.
            setError(formField.error);
          }
        });
      } else if (response.status === "RESET_PASSWORD_INVALID_TOKEN_ERROR") {
        // the password reset token in the URL is invalid, expired, or already consumed
        setError("Password reset failed. Please try again");
      } else {
        setDone(true);
      }
    } catch (err: any) {
      if (err.isSuperTokensGeneralError === true) {
        // this may be a custom error message sent from the API by you.
        window.alert(err.message);
      } else {
        window.alert("Oops! Something went wrong.");
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
                Password changed successfully. Please login to continue.
                <div className="h-5"></div>
                <Link to="/login">
                  <Button type="primary" onClick={submit}>
                    Login
                  </Button>
                </Link>
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
                  subtype="password"
                  label="Password"
                  size="full"
                  placeholder="•••••••••"
                  vertical
                  value={newPassword}
                  setValue={setNewPassword}
                />
                <div className="h-5"></div>
                <Input
                  subtype="password"
                  label="Confirm Password"
                  size="full"
                  placeholder="•••••••••"
                  vertical
                  value={confirmNewPassword}
                  setValue={setConfirmNewPassword}
                />
                <div className="mb-10"></div>
                <Button type="primary" onClick={submit}>
                  {submitting ? "Changing password..." : "Change password"}
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

export default ResetPasswordConfirm;
