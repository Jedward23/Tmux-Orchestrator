import { JSX } from "preact";

interface CardProps {
  title: string;
  description: string;
  brand?: "blue" | "green" | "purple";
  href?: string;
  status?: string;
  children?: JSX.Element;
  className?: string;
}

export function Card({ 
  title, 
  description, 
  brand = "blue", 
  href, 
  status, 
  children, 
  className = "" 
}: CardProps) {
  const brandClasses = {
    blue: "card-brand-blue",
    green: "card-brand-green",
    purple: "card-brand-purple"
  };

  const brandColors = {
    blue: "text-antko-blue-600 hover:text-antko-blue-800",
    green: "text-antko-green-600 hover:text-antko-green-800",
    purple: "text-antko-purple-600 hover:text-antko-purple-800"
  };

  const statusColors = {
    blue: "bg-antko-blue-100 text-antko-blue-800",
    green: "bg-antko-green-100 text-antko-green-800",
    purple: "bg-antko-purple-100 text-antko-purple-800"
  };

  const CardContent = () => (
    <>
      <div class="flex justify-between items-start mb-3">
        <h3 class={`text-xl font-semibold ${brandColors[brand]}`}>
          {title}
        </h3>
        {status && (
          <span class={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[brand]}`}>
            {status}
          </span>
        )}
      </div>
      <p class="text-slate-600 mb-4 leading-relaxed">
        {description}
      </p>
      {children}
      {href && (
        <a 
          href={href} 
          class={`inline-flex items-center font-medium ${brandColors[brand]} transition-colors group`}
        >
          Ver más
          <svg class="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </a>
      )}
    </>
  );

  return (
    <div class={`card ${brandClasses[brand]} ${className}`}>
      <CardContent />
    </div>
  );
}