import { JSX } from "preact";

interface CardProps {
  children: JSX.Element | JSX.Element[];
  className?: string;
  hover?: boolean;
}

export default function Card(
  { children, className = "", hover = true }: CardProps,
): JSX.Element {
  const hoverClasses = hover
    ? "hover:shadow-2xl hover:shadow-purple-500/25 transition duration-300 transform hover:-translate-y-3 hover:scale-105"
    : "";

  return (
    <div
      class={`bg-gradient-to-br from-white via-purple-50 to-pink-50 border border-purple-200 rounded-xl shadow-lg p-6 ${hoverClasses} ${className}`}
    >
      {children}
    </div>
  );
}
