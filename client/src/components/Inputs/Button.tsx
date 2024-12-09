import { MouseEventHandler } from "react";

type Props = React.HTMLProps<HTMLElement> & {
  type: "primary" | "secondary";
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: MouseEventHandler;
  className?: string;
};
const Button = ({
  type,
  children,
  onClick,
  disabled,
  className,
  ...props
}: Props) => {
  const style = {
    primary:
      "rounded-md font-semibold text-[16px] cursor-pointer bg-main-orange text-white ",
    secondary:
      "rounded-md font-semibold text-[16px] cursor-pointer text-black bg-white border-[#D0D5DD] border text-black",
  };
  return (
    <button
      {...(props as any)}
      className={`w-full filter- p-2 ${disabled && "opacity-50"} ${style[type]} ${className}`}
      onClick={disabled ? () => {} : onClick}
    >
      {children}
    </button>
  );
};

export default Button;
