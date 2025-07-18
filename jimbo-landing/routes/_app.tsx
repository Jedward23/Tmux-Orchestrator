import { type PageProps } from "$fresh/server.ts";
import Navigation from "../components/Navigation.tsx";

export default function App({ Component, route }: PageProps) {
  const showNavigation = route !== "/"; // Hide navigation on home page for full-screen hero

  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Jimbo - Mi Universo Digital</title>
        <meta
          name="description"
          content="Bienvenido al mundo digital de Jimbo - creatividad, tecnología y experiencias únicas"
        />
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body class="bg-gray-50">
        {showNavigation && <Navigation currentPath={route} />}
        <Component />

        {/* Footer */}
        <footer class="bg-gray-800 text-white py-8">
          <div class="container mx-auto px-4 text-center">
            <div class="flex justify-center items-center space-x-2 mb-4">
              <span class="text-2xl">🌟</span>
              <span class="text-xl font-bold">Jimbo</span>
            </div>
            <p class="text-gray-300 mb-4">
              Conectando creatividad, tecnología y experiencias únicas
            </p>
            <div class="flex justify-center space-x-6">
              <a
                href="/testimonios"
                class="text-gray-300 hover:text-white transition duration-200"
              >
                Testimonios
              </a>
              <a
                href="/galeria"
                class="text-gray-300 hover:text-white transition duration-200"
              >
                Galería
              </a>
              <a
                href="/tv-jimbo"
                class="text-gray-300 hover:text-white transition duration-200"
              >
                TV Jimbo
              </a>
              <a
                href="/contacto"
                class="text-gray-300 hover:text-white transition duration-200"
              >
                Contacto
              </a>
            </div>
            <div class="mt-6 pt-4 border-t border-gray-700">
              <p class="text-sm text-gray-400">
                © 2024 Jimbo. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
