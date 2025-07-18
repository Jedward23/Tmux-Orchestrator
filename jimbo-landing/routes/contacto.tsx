import { PageProps } from "$fresh/server.ts";
import PageHeader from "../components/PageHeader.tsx";
import Card from "../components/Card.tsx";

export default function Contacto(props: PageProps) {
  return (
    <div class="min-h-screen bg-gray-50 py-12">
      <div class="container mx-auto px-4">
        <PageHeader
          title="Contacto"
          subtitle="¡Conectemos! Estoy aquí para hacer realidad tus ideas"
          icon="📧"
        />

        <div class="max-w-4xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card hover={false} className="p-8">
              <h2 class="text-2xl font-bold mb-6">Envíanos un Mensaje</h2>
              <form class="space-y-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje
                  </label>
                  <textarea
                    rows={4}
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Escribe tu mensaje aquí..."
                  >
                  </textarea>
                </div>

                <button
                  type="submit"
                  class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Enviar Mensaje
                </button>
              </form>
            </Card>

            {/* Contact Info & Social */}
            <div class="space-y-8">
              {/* Contact Information */}
              <Card hover={false} className="p-8">
                <h2 class="text-2xl font-bold mb-6">Información de Contacto</h2>
                <div class="space-y-4">
                  <div class="flex items-center">
                    <span class="text-blue-600 mr-3">📧</span>
                    <span>contacto@jimbo.com</span>
                  </div>
                  <div class="flex items-center">
                    <span class="text-blue-600 mr-3">📞</span>
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div class="flex items-center">
                    <span class="text-blue-600 mr-3">📍</span>
                    <span>Ciudad, País</span>
                  </div>
                </div>
              </Card>

              {/* Social Media */}
              <Card hover={false} className="p-8">
                <h2 class="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  🌍 Redes Sociales
                </h2>
                <div class="grid grid-cols-2 gap-4">
                  <a
                    href="#"
                    class="flex items-center justify-center p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-xl hover:scale-105 transition duration-300"
                  >
                    <span class="mr-2">📘</span>
                    Facebook
                  </a>
                  <a
                    href="#"
                    class="flex items-center justify-center p-3 bg-gradient-to-r from-sky-400 to-blue-500 text-white rounded-lg hover:shadow-xl hover:scale-105 transition duration-300"
                  >
                    <span class="mr-2">🐦</span>
                    Twitter
                  </a>
                  <a
                    href="#"
                    class="flex items-center justify-center p-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:shadow-xl hover:scale-105 transition duration-300"
                  >
                    <span class="mr-2">💼</span>
                    LinkedIn
                  </a>
                  <a
                    href="#"
                    class="flex items-center justify-center p-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg hover:shadow-xl hover:scale-105 transition duration-300"
                  >
                    <span class="mr-2">📷</span>
                    Instagram
                  </a>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
