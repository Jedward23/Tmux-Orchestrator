import { PageProps } from "$fresh/server.ts";
import PageHeader from "../components/PageHeader.tsx";
import Card from "../components/Card.tsx";

export default function Corporaciones(props: PageProps) {
  return (
    <div class="min-h-screen bg-gradient-to-br from-amber-100 via-orange-50 to-red-100 py-12">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16 pt-8">
          <div class="text-6xl mb-4">🏢</div>
          <h1 class="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
            Corporaciones
          </h1>
          <p class="text-xl max-w-3xl mx-auto bg-gradient-to-r from-orange-700 to-red-700 bg-clip-text text-transparent font-medium">
            Soluciones empresariales personalizadas para llevar tu corporación
            al siguiente nivel
          </p>
        </div>

        {/* Services Grid */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Card className="text-center">
            <div class="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span class="text-2xl text-white">🏢</span>
            </div>
            <h3 class="text-xl font-semibold mb-3 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Consultoría Empresarial
            </h3>
            <p class="text-gray-700">
              Estrategias personalizadas para optimizar procesos y aumentar la
              productividad
            </p>
          </Card>

          <Card className="text-center">
            <div class="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span class="text-2xl text-white">📊</span>
            </div>
            <h3 class="text-xl font-semibold mb-3 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
              Análisis de Datos
            </h3>
            <p class="text-gray-700">
              Insights profundos basados en datos para tomar decisiones
              informadas
            </p>
          </Card>

          <Card className="text-center">
            <div class="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span class="text-2xl text-white">🚀</span>
            </div>
            <h3 class="text-xl font-semibold mb-3 bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              Transformación Digital
            </h3>
            <p class="text-gray-700">
              Modernización tecnológica para empresas del futuro
            </p>
          </Card>
        </div>

        {/* Companies Showcase */}
        <Card
          hover={false}
          className="p-8 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white"
        >
          <h2 class="text-3xl font-bold text-center mb-8">
            🤝 Empresas que Confían en Nosotros
          </h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            <div class="h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white border-opacity-30 shadow-lg">
              <span class="text-white font-semibold">TechCorp</span>
            </div>
            <div class="h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white border-opacity-30 shadow-lg">
              <span class="text-white font-semibold">InnovateLab</span>
            </div>
            <div class="h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white border-opacity-30 shadow-lg">
              <span class="text-white font-semibold">StartupHub</span>
            </div>
            <div class="h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white border-opacity-30 shadow-lg">
              <span class="text-white font-semibold">FutureDigital</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
