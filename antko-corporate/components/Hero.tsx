import { JSX } from "preact";
import { Button } from "./Button.tsx";

interface HeroProps {
  title: string;
  subtitle: string;
  description: string;
  brand?: "blue" | "green" | "purple";
  primaryAction?: {
    text: string;
    href: string;
  };
  secondaryAction?: {
    text: string;
    href: string;
  };
  children?: JSX.Element;
}

export function Hero({ 
  title, 
  subtitle, 
  description, 
  brand = "blue",
  primaryAction,
  secondaryAction,
  children 
}: HeroProps) {
  const brandGradients = {
    blue: "from-antko-blue-600 to-antko-blue-800",
    green: "from-antko-green-600 to-antko-green-800",
    purple: "from-antko-purple-600 to-antko-purple-800"
  };

  const brandAccents = {
    blue: "text-antko-blue-600",
    green: "text-antko-green-600", 
    purple: "text-antko-purple-600"
  };

  return (
    <section class="hero-section py-20 lg:py-32">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-5xl lg:text-7xl font-bold font-display mb-6 animate-in">
            <span class={`bg-gradient-to-r ${brandGradients[brand]} bg-clip-text text-transparent`}>
              {title}
            </span>
          </h1>
          
          <p class={`text-xl lg:text-2xl ${brandAccents[brand]} font-medium mb-8 animate-in stagger-1`}>
            {subtitle}
          </p>
          
          <p class="text-lg lg:text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed animate-in stagger-2">
            {description}
          </p>
          
          {(primaryAction || secondaryAction) && (
            <div class="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-in stagger-3">
              {primaryAction && (
                <Button 
                  variant={brand === "blue" ? "primary" : brand === "green" ? "success" : "purple"}
                  size="lg"
                  href={primaryAction.href}
                >
                  {primaryAction.text}
                </Button>
              )}
              {secondaryAction && (
                <Button 
                  variant="secondary"
                  size="lg"
                  href={secondaryAction.href}
                >
                  {secondaryAction.text}
                </Button>
              )}
            </div>
          )}
          
          {children && (
            <div class="animate-in stagger-3">
              {children}
            </div>
          )}
        </div>
      </div>
      
      {/* Decorative elements */}
      <div class="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div class="absolute top-10 left-10 w-20 h-20 bg-antko-blue-200 rounded-full opacity-20 animate-bounce-subtle"></div>
        <div class="absolute top-20 right-20 w-16 h-16 bg-antko-green-200 rounded-full opacity-20 animate-bounce-subtle" style="animation-delay: 1s;"></div>
        <div class="absolute bottom-20 left-20 w-12 h-12 bg-antko-purple-200 rounded-full opacity-20 animate-bounce-subtle" style="animation-delay: 2s;"></div>
        <div class="absolute bottom-10 right-10 w-24 h-24 bg-antko-blue-200 rounded-full opacity-20 animate-bounce-subtle" style="animation-delay: 0.5s;"></div>
      </div>
    </section>
  );
}