import { PageProps } from "$fresh/server.ts";
import PageHeader from "../components/PageHeader.tsx";
import Card from "../components/Card.tsx";

export default function Galeria(props: PageProps) {
  const mediaItems = [
    {
      title: "Video Promocional 2024",
      description:
        "Mi último trabajo creativo que muestra la evolución de mis proyectos",
      type: "video",
      gradient: "from-blue-400 to-purple-500",
    },
    {
      title: "Sesión Fotográfica Corporativa",
      description: "Momentos capturados durante colaboraciones empresariales",
      type: "photo",
      gradient: "from-green-400 to-blue-500",
    },
    {
      title: "Behind the Scenes",
      description:
        "El proceso creativo detrás de mis proyectos más importantes",
      type: "video",
      gradient: "from-purple-400 to-pink-500",
    },
    {
      title: "Galería de Proyectos",
      description: "Una colección de mis trabajos más representativos",
      type: "photo",
      gradient: "from-orange-400 to-red-500",
    },
    {
      title: "Testimoniales en Video",
      description: "Clientes compartiendo sus experiencias trabajando conmigo",
      type: "video",
      gradient: "from-teal-400 to-green-500",
    },
    {
      title: "Eventos y Presentaciones",
      description: "Momentos destacados de conferencias y eventos especiales",
      type: "photo",
      gradient: "from-indigo-400 to-blue-500",
    },
  ];

  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-orange-100 py-12">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16 pt-8">
          <div class="text-6xl mb-4">🎬</div>
          <h1 class="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
            Videos y Fotos
          </h1>
          <p class="text-xl max-w-3xl mx-auto bg-gradient-to-r from-purple-700 to-orange-700 bg-clip-text text-transparent font-medium">
            Una ventana visual a mi trabajo, procesos creativos y momentos
            especiales
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mediaItems.map((item, index) => (
            <Card key={index}>
              <div
                class={`w-full h-48 bg-gradient-to-r ${item.gradient} rounded-lg mb-4 flex items-center justify-center`}
              >
                <span class="text-6xl text-white opacity-80">
                  {item.type === "video" ? "▶️" : "📸"}
                </span>
              </div>
              <div class="flex items-center mb-2">
                <span class="text-sm bg-gray-100 px-2 py-1 rounded-full mr-2">
                  {item.type === "video" ? "Video" : "Foto"}
                </span>
              </div>
              <h3 class="font-semibold text-lg mb-2 text-gray-800">
                {item.title}
              </h3>
              <p class="text-gray-600 text-sm">{item.description}</p>
            </Card>
          ))}
        </div>

        {/* Video Player Section */}
        <div class="mt-16">
          <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">
            Video Destacado
          </h2>
          <div class="max-w-4xl mx-auto">
            <Card hover={false}>
              <div class="aspect-video bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <div class="text-center text-white">
                  <div class="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span class="text-3xl">▶️</span>
                  </div>
                  <p class="text-xl">Video Principal</p>
                  <p class="text-sm opacity-80">Haz clic para reproducir</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
