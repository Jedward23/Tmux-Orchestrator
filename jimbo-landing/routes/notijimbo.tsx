import { PageProps } from "$fresh/server.ts";
import PageHeader from "../components/PageHeader.tsx";
import ArticleCard from "../components/ArticleCard.tsx";
import Card from "../components/Card.tsx";

export default function Notijimbo(props: PageProps) {
  const articles = [
    {
      title: "El Futuro del Desarrollo Web en 2024",
      excerpt:
        "Explorando las tendencias emergentes en tecnología web, desde frameworks modernos hasta nuevas metodologías de desarrollo que están cambiando la industria.",
      date: "15 de Enero, 2024",
      category: "Tecnología",
      gradient: "from-blue-500 to-purple-600",
      readTime: "5 min",
    },
    {
      title: "Lanzamiento de Mi Nueva Plataforma",
      excerpt:
        "Después de meses de desarrollo, estoy emocionado de anunciar el lanzamiento de mi nueva plataforma que revolucionará la forma en que trabajamos.",
      date: "10 de Enero, 2024",
      category: "Anuncios",
      gradient: "from-green-500 to-teal-600",
      readTime: "3 min",
    },
    {
      title: "Reflexiones sobre el Emprendimiento Digital",
      excerpt:
        "Compartiendo lecciones aprendidas durante mi viaje como emprendedor digital y los desafíos que he enfrentado en el camino.",
      date: "5 de Enero, 2024",
      category: "Personal",
      gradient: "from-orange-500 to-red-600",
      readTime: "7 min",
    },
    {
      title: "Próximo Evento: Conferencia Tech 2024",
      excerpt:
        "Únete a mí en la próxima conferencia donde compartiré insights sobre innovación tecnológica y el futuro del desarrollo de software.",
      date: "1 de Enero, 2024",
      category: "Eventos",
      gradient: "from-purple-500 to-pink-600",
      readTime: "2 min",
    },
    {
      title: "Colaboración con Startups Emergentes",
      excerpt:
        "Anunciando mi nueva iniciativa para apoyar startups emergentes con mentoría tecnológica y recursos de desarrollo.",
      date: "28 de Diciembre, 2023",
      category: "Colaboraciones",
      gradient: "from-indigo-500 to-blue-600",
      readTime: "4 min",
    },
    {
      title: "Tutorial: Optimización de Rendimiento Web",
      excerpt:
        "Una guía completa sobre técnicas avanzadas de optimización que pueden mejorar significativamente el rendimiento de tus aplicaciones web.",
      date: "25 de Diciembre, 2023",
      category: "Tutoriales",
      gradient: "from-teal-500 to-green-600",
      readTime: "10 min",
    },
  ];

  const featuredArticle = articles[0];
  const recentArticles = articles.slice(1);

  return (
    <div class="min-h-screen bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100 py-12">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16 pt-8">
          <div class="text-6xl mb-4">📰</div>
          <h1 class="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
            Notijimbo
          </h1>
          <p class="text-xl max-w-3xl mx-auto bg-gradient-to-r from-emerald-700 to-cyan-700 bg-clip-text text-transparent font-medium">
            Noticias, reflexiones y actualizaciones de mi mundo digital
          </p>
        </div>

        {/* Featured Article */}
        <div class="max-w-4xl mx-auto mb-16">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">
            Artículo Destacado
          </h2>
          <Card hover={false} className="lg:flex lg:items-center lg:space-x-8">
            <div class="lg:w-1/2">
              <div
                class={`w-full h-64 bg-gradient-to-r ${featuredArticle.gradient} rounded-lg mb-6 lg:mb-0 flex items-center justify-center`}
              >
                <span class="text-6xl text-white opacity-80">📱</span>
              </div>
            </div>
            <div class="lg:w-1/2">
              <div class="flex items-center space-x-4 mb-4">
                <span class="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                  {featuredArticle.category}
                </span>
                <span class="text-sm text-gray-500">
                  {featuredArticle.readTime}
                </span>
              </div>
              <div class="text-sm text-gray-500 mb-3">
                {featuredArticle.date}
              </div>
              <h3 class="text-2xl font-bold text-gray-800 mb-4">
                {featuredArticle.title}
              </h3>
              <p class="text-gray-600 mb-6">{featuredArticle.excerpt}</p>
              <a
                href="#"
                class="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Leer artículo completo
                <span class="ml-2">→</span>
              </a>
            </div>
          </Card>
        </div>

        {/* Recent Articles Grid */}
        <div class="mb-16">
          <h2 class="text-2xl font-bold text-gray-800 mb-8 text-center">
            Artículos Recientes
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentArticles.map((article, index) => (
              <ArticleCard key={index} {...article} />
            ))}
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div class="max-w-2xl mx-auto">
          <Card
            hover={false}
            className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white"
          >
            <h3 class="text-2xl font-bold mb-4">Suscríbete a Notijimbo</h3>
            <p class="mb-6 opacity-90">
              Recibe las últimas noticias y actualizaciones directamente en tu
              email
            </p>
            <div class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="tu@email.com"
                class="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button class="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200">
                Suscribirse
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
