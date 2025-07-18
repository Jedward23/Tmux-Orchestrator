import { JSX } from "preact";

interface ButtonProps {
  children: JSX.Element | string;
  variant?: "primary" | "secondary" | "success" | "purple" | "danger";
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  href?: string;
}

export function Button({ 
  children, 
  variant = "primary", 
  size = "md",
  type = "button",
  disabled = false,
  onClick,
  className = "",
  href
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary", 
    success: "btn-success",
    purple: "btn-purple",
    danger: "btn-danger"
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  const disabledClasses = disabled 
    ? "opacity-50 cursor-not-allowed transform-none hover:scale-100" 
    : "";

  const allClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`;

  if (href) {
    return (
      <a href={href} class={allClasses}>
        {children}
      </a>
    );
  }

  return (
    <button 
      type={type}
      disabled={disabled}
      onClick={onClick}
      class={allClasses}
    >
      {children}
    </button>
  );
}