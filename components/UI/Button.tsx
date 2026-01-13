import React from "react";
import { Link } from "react-router-dom";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "outline" | "text";
  to?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  ariaLabel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  to,
  onClick,
  className = "",
  type = "button",
  ariaLabel,
}) => {
  const baseStyles =
    "inline-flex items-center justify-center px-8 py-3 text-sm font-medium tracking-wide rounded-md transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-white";

  const variants = {
    primary:
      "bg-brand-accent text-white hover:opacity-90 border border-transparent",
    outline:
      "bg-transparent text-brand-text-primary border border-brand-border hover:border-brand-text-primary",
    text: "bg-transparent text-brand-accent hover:text-brand-text-primary underline-offset-4 hover:underline padding-0",
  };

  const combinedClasses = `${baseStyles} ${variants[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={combinedClasses} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={combinedClasses}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};
