import { useState } from "react";
import bg from "../assets/login-bg.png";
import logo from "../assets/logo.png";
import Input from "../components/Inputs/Input";
import Button from "../components/Inputs/Button";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { emailPasswordSignUp } from "supertokens-web-js/recipe/thirdpartyemailpassword";
import { CheckIcon } from "@heroicons/react/20/solid";
const special = [
  "~",
  "`",
  "!",
  "@",
  "#",
  "$",
  "%",
  "^",
  "&",
  "*",
  "(",
  ")",
  "-",
  "_",
  "+",
  "=",
  "{",
  "}",
  "[",
  "]",
  "|",
  "\\",
  "/",
  ":",
  ";",
  '"',
  "'",
  "<",
  ">",
  ",",
  ".",
  "?",
];

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    setError("");
    try {
      setSubmitting(true);
      let response = await emailPasswordSignUp({
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
        // one of the input formFields failed validaiton
        response.formFields.forEach((formField) => {
          if (formField.id === "email") {
            // Email validation failed (for example incorrect email syntax),
            // or the email is not unique.
            setError(formField.error);
          } else if (formField.id === "password") {
            // Password validation failed.
            // Maybe it didn't match the password strength
            setError(formField.error);
          }
        });
      } else if (response.status === "SIGN_UP_NOT_ALLOWED") {
        // this can happen during automatic account linking. Tell the user to use another
        // login method, or go through the password reset flow.
      } else {
        // sign up successful. The session tokens are automatically handled by
        // the frontend SDK.
        navigate("/login/verify-email");
      }
    } catch (err: any) {
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
            style={{ background: "radial-gradient(#aaa0,#fff)" }}
            className="w-full h-[768px] absolute top-0 left-0"
          ></div>
        </div>
        <div className="absolute text-black top-[200px] m-auto flex w-full z-50 flex-col items-center ">
          <div className="flex flex-col items-center justify-start w-[360px]">
            <img src={logo} alt="" className="w-20 h-20" />
            <div className="font-semibold text-[30px] ">Create an account</div>
            <div className="text-[#475467] mb-10">
              Start your 7-day free trial
            </div>
            {error && (
              <div className="bg-[#ffd6cc] border border-red-500 px-10 py-3 rounded-md mb-10">
                {error}
              </div>
            )}
            <Input
              subtype="text"
              placeholder="Enter your name"
              label="Name*"
              size="full"
              vertical
              value={name}
              setValue={setName}
            />
            <div className="mb-5"></div>
            <Input
              subtype="text"
              placeholder="Enter your email"
              label="Email*"
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
            <div className="mb-5"></div>
            <div className="flex gap-2 items-center w-full">
              <div
                className={`${password.length >= 8 ? "bg-main-orange" : "bg-[#D0D5DD]"} rounded-full p-1 h-5 w-5`}
              >
                <CheckIcon className="h-3 w-3 text-white" />
              </div>
              <div className="text-sm text-[#475467]">
                Must be at least 8 characters
              </div>
            </div>
            <div className="mb-3"></div>
            <div className="flex gap-2 items-center w-full">
              <div
                className={`${special.some((e) => password.includes(e)) ? "bg-main-orange" : "bg-[#D0D5DD]"} rounded-full p-1 h-5 w-5`}
              >
                <CheckIcon className="h-3 w-3 text-white" />
              </div>
              <div className="text-sm text-[#475467]">
                Must contain one special character
              </div>
            </div>
            <div className="mb-10"></div>
            <Button type="primary" onClick={submit}>
              {submitting ? "Signing up..." : "Sign up"}
            </Button>
            <div className="mb-6"></div>
            <div className="text-[14px] text-[#475467]">
              Already have an account?{" "}
              <Link to="/login" className="text-[#FF6C47] font-semibold">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
