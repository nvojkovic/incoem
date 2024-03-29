import { MouseEventHandler } from "react";

type Props = React.HTMLProps<HTMLElement> & {
  type: "primary" | "secondary";
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: MouseEventHandler;
};
const Button = ({ type, children, onClick, disabled }: Props) => {
  const style = {
    primary:
      "rounded-md font-semibold text-[16px] cursor-pointer bg-gradient-to-b from-[#FF6C47] to-[#FF6C47] text-white ",
    secondary:
      "rounded-md font-semibold text-[16px] cursor-pointer text-black bg-white border-[#D0D5DD] border text-black",
  };
  return (
    <button
      className={`w-full filter- p-2 ${disabled && "opacity-50"} ${style[type]}`}
      onClick={disabled ? () => { } : onClick}
    >
      {children}
    </button>
  );
};

export default Button;
