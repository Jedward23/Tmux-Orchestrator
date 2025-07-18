import { Layout } from "../components/Layout.tsx";
import { Hero } from "../components/Hero.tsx";
import { Card } from "../components/Card.tsx";

export default function SolucionesEnAgua() {
  return (
    <Layout title="Soluciones en Agua - ANTKO" brand="blue" currentPath="/soluciones-en-agua">
      <Hero
        title="Soluciones en Agua"
        subtitle="Sistemas Integrales de Tratamiento"
        description="Especialistas en sistemas completos de tratamiento y purificación de agua para uso industrial y doméstico. Soluciones personalizadas respaldadas por más de 20 años de experiencia."
        brand="blue"
        primaryAction={{
          text: "Ver Productos",
          href: "/admin/products?brand=soluciones"
        }}
        secondaryAction={{
          text: "Contactar Especialista",
          href: "#contacto"
        }}
      />

      <section class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold font-display text-slate-900 mb-4">
              Nuestros Productos
            </h2>
            <p class="text-xl text-slate-600 max-w-3xl mx-auto">
              Soluciones completas para cada necesidad de tratamiento de agua
            </p>
          </div>
          
          <div class="feature-grid">
            <Card
              title="Sistemas de Filtración Industrial"
              description="Equipos de alta eficiencia para la filtración de agua en aplicaciones industriales. Tecnología avanzada para máximo rendimiento."
              brand="blue"
              status="Líder en el mercado"
            />
            
            <Card
              title="Purificadores Domésticos"
              description="Sistemas de purificación para el hogar con tecnología avanzada. Agua pura y segura para toda la familia."
              brand="blue"
              status="Tecnología probada"
            />
            
            <Card
              title="Tratamiento Industrial"
              description="Soluciones completas para el tratamiento de agua en la industria. Sistemas diseñados para grandes volúmenes."
              brand="blue"
              status="Solución integral"
            />
          </div>
        </div>
      </section>

      <section class="py-20 bg-antko-blue-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 class="text-4xl font-bold font-display text-slate-900 mb-6">
                Especialistas en Tratamiento de Agua
              </h2>
              <p class="text-lg text-slate-600 mb-8 leading-relaxed">
                Soluciones en Agua es la división especializada de ANTKO enfocada en brindar 
                sistemas integrales de tratamiento y purificación de agua. Con más de 20 años 
                de experiencia, ofrecemos soluciones personalizadas para cada necesidad.
              </p>
              
              <div class="grid grid-cols-2 gap-6">
                <div class="text-center">
                  <div class="text-3xl font-bold text-antko-blue-600 mb-2">500+</div>
                  <div class="text-slate-600">Proyectos Completados</div>
                </div>
                <div class="text-center">
                  <div class="text-3xl font-bold text-antko-blue-600 mb-2">99%</div>
                  <div class="text-slate-600">Satisfacción del Cliente</div>
                </div>
                <div class="text-center">
                  <div class="text-3xl font-bold text-antko-blue-600 mb-2">24/7</div>
                  <div class="text-slate-600">Soporte Técnico</div>
                </div>
                <div class="text-center">
                  <div class="text-3xl font-bold text-antko-blue-600 mb-2">ISO</div>
                  <div class="text-slate-600">Certificación 9001</div>
                </div>
              </div>
            </div>
            
            <div class="relative">
              <div class="aspect-w-16 aspect-h-9 bg-slate-200 rounded-xl overflow-hidden">
                <div class="w-full h-full bg-gradient-to-br from-antko-blue-400 to-antko-blue-600 flex items-center justify-center">
                  <svg class="w-32 h-32 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z"/>
                  </svg>
                </div>
              </div>
              
              <div class="absolute -top-4 -right-4 w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center">
                <svg class="w-12 h-12 text-antko-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold font-display text-slate-900 mb-4">
              Proceso de Implementación
            </h2>
            <p class="text-xl text-slate-600 max-w-3xl mx-auto">
              Metodología probada para garantizar el éxito de su proyecto
            </p>
          </div>
          
          <div class="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Análisis", description: "Evaluación completa de necesidades y condiciones del agua" },
              { step: "02", title: "Diseño", description: "Desarrollo de solución personalizada y especificaciones técnicas" },
              { step: "03", title: "Instalación", description: "Implementación profesional con equipo especializado" },
              { step: "04", title: "Soporte", description: "Mantenimiento continuo y soporte técnico 24/7" }
            ].map((item, index) => (
              <div key={index} class="text-center">
                <div class="w-16 h-16 bg-gradient-to-r from-antko-blue-500 to-antko-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span class="text-white font-bold text-lg">{item.step}</span>
                </div>
                <h3 class="text-xl font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p class="text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}