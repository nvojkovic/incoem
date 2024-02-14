import { MouseEventHandler } from "react";

interface Props {
  type: "primary" | "secondary";
  children: React.ReactNode;
  onClick?: MouseEventHandler;
}
const Button = ({ type, children, onClick }: Props) => {
  const style = {
    primary:
      "rounded-md font-semibold text-[16px] cursor-pointer bg-gradient-to-b from-[#FF6C47] to-[#FF6C47]",
    secondary: "bg-red-500",
  };
  return (
    <div className={`p-2 text-white ${style[type]}`} onClick={onClick}>
      {children}
    </div>
  );
};

export default Button;
