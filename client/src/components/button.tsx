import type { ReactElement } from "react";

interface ButtonProps {
  variant: "primary" | "secondary";
  text: string;
  startIcon?: ReactElement;
  onClick?: () => void;
  fullWidth?: boolean;
  loading?: boolean;
  onHover?: boolean;
}

const variantClasses = {
  primary: "bg-purple-600 text-white",
  secondary: "bg-black-400 text-white",
};

const defaultStyles =
  "px-4 py-2 rounded-md flex items-center justify-center cursor-pointer";

export function Button({
  variant,
  text,
  startIcon,
  onClick,
  fullWidth,
  loading,
  onHover,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${variantClasses[variant]} ${defaultStyles} 
    ${onHover ? "transition-all duration-150 hover:bg-black-400" : ""} 
    ${fullWidth ? "w-full" : ""} 
    ${loading ? "opacity-55 cursor-not-allowed" : ""}
  `}
    >
      <div className="pr-2">{startIcon}</div>

      {text}
    </button>
  );
}
