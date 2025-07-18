import { PageProps } from "$fresh/server.ts";
import Hero from "../components/Hero.tsx";
import ScrollNavbar from "../components/ScrollNavbar.tsx";

export default function Home(props: PageProps) {
  return (
    <div>
      <ScrollNavbar currentPath="/" />
      <Hero
        title={
          <>
            ¡Hola! Soy <span class="text-yellow-400">Jimbo</span>
          </>
        }
        subtitle="Bienvenido a mi mundo digital donde convergen la creatividad, la tecnología y las experiencias únicas"
      >
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/testimonios"
            class="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 rounded-full font-semibold transition duration-200 transform hover:scale-105"
          >
            Ver Testimonios
          </a>
          <a
            href="/contacto"
            class="border-2 border-white hover:bg-white hover:text-black px-8 py-3 rounded-full font-semibold transition duration-200 transform hover:scale-105"
          >
            Contáctame
          </a>
        </div>
      </Hero>

      {/* Quick Navigation */}
      <div class="bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-20">
        <div class="container mx-auto px-4">
          <h2 class="text-4xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-16">
            ✨ Explora Mi Universo Digital ✨
          </h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
            <a href="/galeria" class="group text-center">
              <div class="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition duration-300 shadow-2xl">
                <span class="text-4xl">🎬</span>
              </div>
              <h3 class="font-bold text-purple-800 text-lg">Galería</h3>
              <p class="text-purple-600 text-sm mt-1">Videos & Fotos</p>
            </a>

            <a href="/tv-jimbo" class="group text-center">
              <div class="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-full flex items-center justify-center group-hover:scale-110 transition duration-300 shadow-2xl">
                <span class="text-4xl">📺</span>
              </div>
              <h3 class="font-bold text-blue-800 text-lg">TV Jimbo</h3>
              <p class="text-blue-600 text-sm mt-1">Streaming Live</p>
            </a>

            <a href="/notijimbo" class="group text-center">
              <div class="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-green-500 via-teal-500 to-cyan-500 rounded-full flex items-center justify-center group-hover:scale-110 transition duration-300 shadow-2xl">
                <span class="text-4xl">📰</span>
              </div>
              <h3 class="font-bold text-green-800 text-lg">Notijimbo</h3>
              <p class="text-green-600 text-sm mt-1">Blog & News</p>
            </a>

            <a href="/corporaciones" class="group text-center">
              <div class="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition duration-300 shadow-2xl">
                <span class="text-4xl">🏢</span>
              </div>
              <h3 class="font-bold text-orange-800 text-lg">Empresas</h3>
              <p class="text-orange-600 text-sm mt-1">Corporaciones</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
