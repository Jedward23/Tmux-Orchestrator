import { JSX } from "preact";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
}

export default function PageHeader(
  { title, subtitle, icon }: PageHeaderProps,
): JSX.Element {
  return (
    <div class="text-center mb-16 pt-8">
      {icon && <div class="text-6xl mb-4">{icon}</div>}
      <h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
        {title}
      </h1>
      {subtitle && (
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
