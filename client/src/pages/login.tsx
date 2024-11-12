import { useState } from "react";
import bg from "../assets/login-bg.png";
import logo from "../assets/logo.png";
import Input from "../components/Inputs/Input";
import Button from "../components/Inputs/Button";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { signIn } from "supertokens-web-js/recipe/emailpassword";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    setError("");
    try {
      setSubmitting(true);
      let response = await signIn({
        formFields: [
          {
            id: "email",
            value: email,
          },
          {
            id: "password",
            value: password,
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
      } else if (response.status === "WRONG_CREDENTIALS_ERROR") {
        setError("Email password combination is incorrect.");
      } else if (response.status === "SIGN_IN_NOT_ALLOWED") {
        // this can happen due to automatic account linking. Tell the user that their
        // input credentials is wrong (so that they do through the password reset flow)
      } else {
        // sign in successful. The session tokens are automatically handled by
        // the frontend SDK.
        navigate("/clients");
      }
    } catch (err: any) {
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
    <div className="w-full flex justify-center bg- h-full">
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
          <div className="flex flex-col items-center  justify-start">
            <img src={logo} alt="" className="w-20 h-20" />
            <div className="font-semibold text-[30px] ">
              Log in to your account
            </div>
            <div className="text-[#475467] mb-10">
              Welcome back! Please enter your details.
            </div>
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
              vertical
              value={email}
              setValue={setEmail}
            />
            <div className="mb-5"></div>
            <Input
              subtype="password"
              label="Password"
              size="full"
              //dots placeholdder
              placeholder="•••••••••"
              vertical
              value={password}
              setValue={setPassword}
            />
            <div className="mb-10"></div>
            <Button type="primary" onClick={submit}>
              {submitting ? "Signing in..." : "Sign in"}
            </Button>
            <div className="mb-6"></div>
            <div className="text-[14px] text-[#475467]">
              Don't have an account?{" "}
              <Link to="/signup" className="text-[#FF6C47] font-semibold">
                Sign up
              </Link>
            </div>
            <div className="text-[14px] text-[#475467] mt-3">
              <Link
                to="/reset-password"
                className="text-[#FF6C47] font-semibold"
              >
                Reset Password
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
