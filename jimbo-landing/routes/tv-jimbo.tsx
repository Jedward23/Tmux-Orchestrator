import { PageProps } from "$fresh/server.ts";
import PageHeader from "../components/PageHeader.tsx";
import Card from "../components/Card.tsx";

export default function TvJimbo(props: PageProps) {
  return (
    <div class="min-h-screen bg-gray-900 text-white py-12">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16 pt-8">
          <div class="text-6xl mb-4">📺</div>
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
            TV Jimbo
          </h1>
          <p class="text-xl text-gray-300 max-w-3xl mx-auto">
            Tu canal de contenido digital exclusivo - streaming, videos y
            experiencias interactivas
          </p>
        </div>

        {/* Featured Video Player */}
        <div class="max-w-5xl mx-auto mb-16">
          <div class="bg-black rounded-xl overflow-hidden shadow-2xl">
            <div class="aspect-video bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center relative">
              <div class="absolute top-4 left-4 z-10">
                <span class="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                  <span class="w-2 h-2 bg-white rounded-full animate-pulse">
                  </span>
                  EN VIVO
                </span>
              </div>
              <div class="text-center z-10">
                <div class="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6 cursor-pointer hover:bg-opacity-30 transition duration-200 hover:scale-105">
                  <span class="text-5xl">▶️</span>
                </div>
                <p class="text-2xl font-bold mb-2">Transmisión Principal</p>
                <p class="text-lg opacity-90">Contenido exclusivo en vivo</p>
              </div>
              <div class="absolute top-4 right-4 z-10">
                <span class="bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg">
                  👥 1,245 espectadores
                </span>
              </div>
            </div>
            <div class="p-6">
              <h2 class="text-2xl font-bold mb-2">
                Sesión de Desarrollo en Vivo
              </h2>
              <p class="text-gray-300 mb-4">
                Únete a mi sesión de desarrollo en vivo donde construyo
                aplicaciones reales y comparto técnicas avanzadas
              </p>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <button class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition duration-200">
                    💬 Chat
                  </button>
                  <button class="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition duration-200">
                    👍 Me gusta
                  </button>
                  <button class="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition duration-200">
                    📤 Compartir
                  </button>
                </div>
                <span class="text-gray-400 text-sm">Iniciado hace 2h 15m</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Categories */}
        <div class="mb-16">
          <div class="flex justify-center mb-8">
            <div class="flex flex-wrap gap-4 bg-gray-800 rounded-full p-2">
              <button class="px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-medium">
                Todos
              </button>
              <button class="px-6 py-2 text-gray-300 hover:bg-gray-700 rounded-full text-sm font-medium">
                Desarrollo
              </button>
              <button class="px-6 py-2 text-gray-300 hover:bg-gray-700 rounded-full text-sm font-medium">
                Tutoriales
              </button>
              <button class="px-6 py-2 text-gray-300 hover:bg-gray-700 rounded-full text-sm font-medium">
                Entrevistas
              </button>
              <button class="px-6 py-2 text-gray-300 hover:bg-gray-700 rounded-full text-sm font-medium">
                Behind the Scenes
              </button>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div class="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition duration-200 cursor-pointer">
            <div class="aspect-video bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center relative">
              <span class="text-4xl">🎬</span>
              <div class="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                15:30
              </div>
            </div>
            <div class="p-6">
              <h3 class="font-semibold mb-2 text-lg">
                Construyendo una App Full Stack
              </h3>
              <p class="text-gray-400 text-sm mb-3">
                Tutorial completo de desarrollo desde cero usando tecnologías
                modernas
              </p>
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500">Hace 2 días</span>
                <span class="text-xs text-gray-500">2.5K views</span>
              </div>
            </div>
          </div>

          <div class="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition duration-200 cursor-pointer">
            <div class="aspect-video bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center relative">
              <span class="text-4xl">🎥</span>
              <div class="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                22:45
              </div>
            </div>
            <div class="p-6">
              <h3 class="font-semibold mb-2 text-lg">
                Entrevista: CEO de StartupTech
              </h3>
              <p class="text-gray-400 text-sm mb-3">
                Conversación exclusiva sobre innovación y emprendimiento
                tecnológico
              </p>
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500">Hace 1 semana</span>
                <span class="text-xs text-gray-500">4.1K views</span>
              </div>
            </div>
          </div>

          <div class="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition duration-200 cursor-pointer">
            <div class="aspect-video bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center relative">
              <span class="text-4xl">📹</span>
              <div class="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                08:12
              </div>
            </div>
            <div class="p-6">
              <h3 class="font-semibold mb-2 text-lg">
                Tips de Productividad para Developers
              </h3>
              <p class="text-gray-400 text-sm mb-3">
                Técnicas y herramientas para maximizar tu eficiencia como
                desarrollador
              </p>
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500">Hace 3 días</span>
                <span class="text-xs text-gray-500">1.8K views</span>
              </div>
            </div>
          </div>

          <div class="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition duration-200 cursor-pointer">
            <div class="aspect-video bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center relative">
              <span class="text-4xl">🚀</span>
              <div class="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                12:30
              </div>
            </div>
            <div class="p-6">
              <h3 class="font-semibold mb-2 text-lg">
                Deploy to Production: Best Practices
              </h3>
              <p class="text-gray-400 text-sm mb-3">
                Guía completa para deployments seguros y eficientes
              </p>
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500">Hace 5 días</span>
                <span class="text-xs text-gray-500">3.2K views</span>
              </div>
            </div>
          </div>

          <div class="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition duration-200 cursor-pointer">
            <div class="aspect-video bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center relative">
              <span class="text-4xl">💡</span>
              <div class="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                18:45
              </div>
            </div>
            <div class="p-6">
              <h3 class="font-semibold mb-2 text-lg">
                Behind the Scenes: Mi Setup de Trabajo
              </h3>
              <p class="text-gray-400 text-sm mb-3">
                Un recorrido por mi espacio de trabajo y herramientas favoritas
              </p>
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500">Hace 1 semana</span>
                <span class="text-xs text-gray-500">5.7K views</span>
              </div>
            </div>
          </div>

          <div class="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition duration-200 cursor-pointer">
            <div class="aspect-video bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center relative">
              <span class="text-4xl">🔧</span>
              <div class="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                25:15
              </div>
            </div>
            <div class="p-6">
              <h3 class="font-semibold mb-2 text-lg">
                Code Review: Analizando Proyectos
              </h3>
              <p class="text-gray-400 text-sm mb-3">
                Revisión en vivo de código enviado por la comunidad
              </p>
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500">Hace 2 semanas</span>
                <span class="text-xs text-gray-500">6.3K views</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subscribe Section */}
        <div class="max-w-2xl mx-auto text-center">
          <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8">
            <h3 class="text-2xl font-bold mb-4">¡Suscríbete a TV Jimbo!</h3>
            <p class="mb-6 opacity-90">
              No te pierdas ningún episodio y accede a contenido exclusivo para
              suscriptores
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <button class="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-200 flex items-center justify-center">
                🔔 Suscribirse
              </button>
              <button class="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition duration-200 flex items-center justify-center">
                📱 App Móvil
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
