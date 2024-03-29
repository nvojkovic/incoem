import bg from "../assets/login-bg.png";
import logo from "../assets/logo.png";
import Button from "../components/Inputs/Button";
import { Link } from "react-router-dom";

const Home = () => {
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
          <div className="flex flex-col items-center  justify-start">
            <img src={logo} alt="" className="w-20 h-20" />
            <div className="font-semibold text-[30px] ">Income Mapper</div>
            <div className="text-[#475467] mb-10">
              The best financial planning tool
            </div>

            <Link to="/login" className="w-full">
              <Button type="primary">Log in</Button>
            </Link>
            <div className="mb-6"></div>
            <div className="text-[14px] text-[#475467]">
              Don't have an account?{" "}
              <Link to="/signup" className="text-[#FF6C47] font-semibold">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
