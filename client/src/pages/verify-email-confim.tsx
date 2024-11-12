import { useEffect, useState } from "react";
import bg from "../assets/login-bg.png";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { verifyEmail } from "supertokens-auth-react/recipe/emailverification";
import Spinner from "../components/Spinner";

const VerifyEmailConfirm = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    verifyEmail().then((resp) => {
      setLoading(false);
      if (resp.status === "OK") {
        navigate("/clients");
        return;
      } else if (resp.status === "EMAIL_VERIFICATION_INVALID_TOKEN_ERROR") {
        setError("Invalid token");
        return;
      }
    });
  }, []);

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
            <img src={logo} alt="" className="w-20 h-20" />
            <div className="font-semibold text-[30px] ">Verifying email...</div>
            <div className="text-[#475467] mb-10 mt-10">
              {error && (
                <div className="bg-[#ffd6cc] border border-red-500 px-10 py-3 rounded-md mb-10 mt-15">
                  {error}
                </div>
              )}
              <div className="mt-[-30vh]">{loading && <Spinner />}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailConfirm;
