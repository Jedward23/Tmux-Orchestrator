export default function Wattersolutions() {
  return (
    <div class="min-h-screen bg-green-50">
      <nav class="bg-white shadow-sm border-b-4 border-green-600">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <a href="/" class="text-2xl font-bold text-green-600">ANTKO</a>
              <span class="mx-2 text-gray-400">|</span>
              <span class="text-lg font-medium text-green-800">Wattersolutions</span>
            </div>
            <div class="flex items-center space-x-4">
              <a href="/soluciones-en-agua" class="text-gray-700 hover:text-green-600">Soluciones en Agua</a>
              <a href="/acuafitting" class="text-gray-700 hover:text-green-600">Acuafitting</a>
              <a href="/admin" class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Admin</a>
            </div>
          </div>
        </div>
      </nav>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-green-900 mb-6">
            Wattersolutions
          </h1>
          <p class="text-xl text-green-700 mb-8">
            Tecnología avanzada en filtración y equipos especializados para el tratamiento de agua
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
            <h3 class="text-xl font-semibold text-green-800 mb-3">Filtros Avanzados</h3>
            <p class="text-gray-600 mb-4">
              Tecnología de filtración de última generación para máxima eficiencia.
            </p>
            <div class="text-green-600 font-semibold">Disponible</div>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
            <h3 class="text-xl font-semibold text-green-800 mb-3">Equipos Especializados</h3>
            <p class="text-gray-600 mb-4">
              Maquinaria especializada para tratamiento de agua en diferentes sectores.
            </p>
            <div class="text-green-600 font-semibold">Disponible</div>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
            <h3 class="text-xl font-semibold text-green-800 mb-3">Sistemas de Monitoreo</h3>
            <p class="text-gray-600 mb-4">
              Tecnología inteligente para el monitoreo continuo de calidad del agua.
            </p>
            <div class="text-green-600 font-semibold">Disponible</div>
          </div>
        </div>

        <div class="mt-12 bg-white p-8 rounded-lg shadow-md">
          <h2 class="text-2xl font-bold text-green-900 mb-4">Innovación Tecnológica</h2>
          <p class="text-gray-600 leading-relaxed">
            Wattersolutions representa la vanguardia tecnológica en el tratamiento de agua. 
            Desarrollamos e implementamos soluciones innovadoras que combinan eficiencia, 
            sostenibilidad y resultados superiores para nuestros clientes.
          </p>
        </div>
      </main>
    </div>
  );
}