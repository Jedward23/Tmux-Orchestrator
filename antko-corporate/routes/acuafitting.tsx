export default function Acuafitting() {
  return (
    <div class="min-h-screen bg-purple-50">
      <nav class="bg-white shadow-sm border-b-4 border-purple-600">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <a href="/" class="text-2xl font-bold text-purple-600">ANTKO</a>
              <span class="mx-2 text-gray-400">|</span>
              <span class="text-lg font-medium text-purple-800">Acuafitting</span>
            </div>
            <div class="flex items-center space-x-4">
              <a href="/soluciones-en-agua" class="text-gray-700 hover:text-purple-600">Soluciones en Agua</a>
              <a href="/wattersolutions" class="text-gray-700 hover:text-purple-600">Wattersolutions</a>
              <a href="/admin" class="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">Admin</a>
            </div>
          </div>
        </div>
      </nav>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-purple-900 mb-6">
            Acuafitting
          </h1>
          <p class="text-xl text-purple-700 mb-8">
            Accesorios y conectores especializados para sistemas de agua y filtración
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-600">
            <h3 class="text-xl font-semibold text-purple-800 mb-3">Conectores Especializados</h3>
            <p class="text-gray-600 mb-4">
              Amplia gama de conectores para sistemas de agua y filtración.
            </p>
            <div class="text-purple-600 font-semibold">Disponible</div>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-600">
            <h3 class="text-xl font-semibold text-purple-800 mb-3">Accesorios de Instalación</h3>
            <p class="text-gray-600 mb-4">
              Todo lo necesario para una instalación profesional y duradera.
            </p>
            <div class="text-purple-600 font-semibold">Disponible</div>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-600">
            <h3 class="text-xl font-semibold text-purple-800 mb-3">Repuestos y Mantenimiento</h3>
            <p class="text-gray-600 mb-4">
              Piezas de repuesto y componentes para el mantenimiento de sistemas.
            </p>
            <div class="text-purple-600 font-semibold">Disponible</div>
          </div>
        </div>

        <div class="mt-12 bg-white p-8 rounded-lg shadow-md">
          <h2 class="text-2xl font-bold text-purple-900 mb-4">Calidad y Precisión</h2>
          <p class="text-gray-600 leading-relaxed">
            Acuafitting se especializa en proporcionar los componentes más precisos y confiables 
            para sistemas de agua. Nuestros productos están diseñados para garantizar conexiones 
            seguras y duraderas en cualquier aplicación.
          </p>
        </div>
      </main>
    </div>
  );
}