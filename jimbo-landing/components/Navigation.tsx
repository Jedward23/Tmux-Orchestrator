import { JSX } from "preact";

interface NavigationProps {
  currentPath?: string;
}

export default function Navigation(
  { currentPath }: NavigationProps,
): JSX.Element {
  const navItems = [
    { href: "/", label: "Inicio", icon: "🏠" },
    { href: "/testimonios", label: "Testimonios", icon: "💬" },
    { href: "/galeria", label: "Galería", icon: "🎬" },
    { href: "/notijimbo", label: "Notijimbo", icon: "📰" },
    { href: "/perfiles", label: "Perfiles", icon: "👤" },
    { href: "/tv-jimbo", label: "TV Jimbo", icon: "📺" },
    { href: "/corporaciones", label: "Empresas", icon: "🏢" },
    { href: "/contacto", label: "Contacto", icon: "📧" },
  ];

  return (
    <nav class="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 shadow-2xl sticky top-0 z-50 backdrop-blur-sm">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center py-4">
          {/* Logo */}
          <a href="/" class="flex items-center space-x-2 group">
            <span class="text-2xl group-hover:scale-110 transition-transform duration-300">✨</span>
            <span class="text-xl font-bold text-white group-hover:text-yellow-300 transition-colors duration-300">Jimbo</span>
          </a>

          {/* Desktop Navigation */}
          <div class="hidden lg:flex space-x-6">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                class={`flex items-center space-x-1 px-4 py-2 rounded-full transition-all duration-300 font-medium ${
                  currentPath === item.href
                    ? "bg-white bg-opacity-20 text-yellow-300 shadow-lg border border-white border-opacity-30"
                    : "text-white hover:text-yellow-300 hover:bg-white hover:bg-opacity-10 hover:scale-105"
                }`}
              >
                <span class="text-sm">{item.icon}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            class="lg:hidden p-2 rounded-lg text-white hover:bg-white hover:bg-opacity-20 transition-all duration-300"
            onclick="toggleMobileMenu()"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              >
              </path>
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div id="mobile-menu" class="lg:hidden hidden pb-4">
          <div class="flex flex-col space-y-2 bg-white bg-opacity-10 rounded-xl p-4 mt-4 backdrop-blur-sm border border-white border-opacity-20">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                class={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
                  currentPath === item.href
                    ? "bg-white bg-opacity-20 text-yellow-300 shadow-lg"
                    : "text-white hover:text-yellow-300 hover:bg-white hover:bg-opacity-10"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <script>
        {`
          function toggleMobileMenu() {
            const menu = document.getElementById('mobile-menu');
            menu.classList.toggle('hidden');
          }
        `}
      </script>
    </nav>
  );
}
