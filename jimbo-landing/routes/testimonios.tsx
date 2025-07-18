import { PageProps } from "$fresh/server.ts";
import PageHeader from "../components/PageHeader.tsx";
import TestimonialCard from "../components/TestimonialCard.tsx";

export default function Testimonios(props: PageProps) {
  const testimonials = [
    {
      text:
        "Jimbo ha revolucionado la forma en que gestionamos nuestros proyectos. Su enfoque creativo y profesional nos ha llevado a nuevos niveles de éxito.",
      author: "María González",
      company: "TechCorp Solutions",
      avatar: "bg-gradient-to-r from-blue-400 to-blue-600",
      rating: 5,
    },
    {
      text:
        "Trabajar con Jimbo fue una experiencia increíble. Su dedicación y atención al detalle superaron todas nuestras expectativas.",
      author: "Carlos Rodríguez",
      company: "InnovateLab",
      avatar: "bg-gradient-to-r from-green-400 to-green-600",
      rating: 5,
    },
    {
      text:
        "La creatividad y visión de Jimbo transformaron completamente nuestra presencia digital. Los resultados hablan por sí mismos.",
      author: "Ana Martínez",
      company: "Creative Studio",
      avatar: "bg-gradient-to-r from-purple-400 to-purple-600",
      rating: 5,
    },
    {
      text:
        "Profesionalismo, innovación y excelencia. Jimbo superó todos nuestros objetivos y entregó un trabajo excepcional.",
      author: "Roberto Silva",
      company: "Digital Dynamics",
      avatar: "bg-gradient-to-r from-orange-400 to-red-600",
      rating: 5,
    },
    {
      text:
        "La colaboración con Jimbo fue fluida y productiva. Su capacidad para entender nuestras necesidades es impresionante.",
      author: "Lucía Fernández",
      company: "StartupHub",
      avatar: "bg-gradient-to-r from-pink-400 to-pink-600",
      rating: 5,
    },
    {
      text:
        "Jimbo no solo cumplió con nuestras expectativas, las superó. Su trabajo ha sido fundamental para nuestro crecimiento.",
      author: "David López",
      company: "Growth Partners",
      avatar: "bg-gradient-to-r from-teal-400 to-teal-600",
      rating: 5,
    },
  ];

  return (
    <div class="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 py-12">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16 pt-8">
          <div class="text-6xl mb-4">💬</div>
          <h1 class="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
            Lo que Dicen de Mí
          </h1>
          <p class="text-xl max-w-3xl mx-auto bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent font-medium">
            Las experiencias y testimonios de clientes que han confiado en mi
            trabajo
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>

        {/* Call to Action */}
        <div class="text-center bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white rounded-3xl p-12 shadow-2xl">
          <h2 class="text-4xl font-bold mb-6">
            🚀 ¿Listo para Trabajar Juntos?
          </h2>
          <p class="text-xl mb-8 opacity-95 max-w-2xl mx-auto">
            Únete a la lista de clientes satisfechos y llevemos tu proyecto al
            siguiente nivel con creatividad y excelencia
          </p>
          <a
            href="/contacto"
            class="inline-block bg-white text-purple-600 px-10 py-4 rounded-full font-bold hover:bg-yellow-300 hover:text-purple-800 transition duration-300 transform hover:scale-105 shadow-lg text-lg"
          >
            ✨ Iniciemos un Proyecto ✨
          </a>
        </div>
      </div>
    </div>
  );
}
