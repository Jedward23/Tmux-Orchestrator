import { JSX } from "preact";

interface HeroProps {
  title: string;
  subtitle?: string;
  background?: string;
  children?: JSX.Element;
}

export default function Hero(
  {
    title,
    subtitle,
    background = "bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600",
    children,
  }: HeroProps,
): JSX.Element {
  return (
    <div
      class={`relative min-h-screen flex items-center justify-center text-white ${background}`}
    >
      <div class="absolute inset-0 bg-black bg-opacity-30"></div>
      <div class="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 class="text-5xl md:text-7xl font-bold mb-6">
          {title}
        </h1>
        {subtitle && (
          <p class="text-xl md:text-2xl mb-8 text-gray-100">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
