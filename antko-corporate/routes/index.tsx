import { Layout } from "../components/Layout.tsx";
import { Hero } from "../components/Hero.tsx";
import { Card } from "../components/Card.tsx";

export default function Home() {
  return (
    <Layout title="ANTKO - Soluciones Integrales para el Tratamiento de Agua" currentPath="/">
      <Hero
        title="ANTKO"
        subtitle="Soluciones Integrales para el Tratamiento de Agua"
        description="Con más de 20 años de experiencia, somos líderes en tecnología avanzada para el tratamiento y purificación de agua. Ofrecemos soluciones completas para uso industrial, comercial y doméstico."
        primaryAction={{
          text: "Explorar Productos",
          href: "/soluciones-en-agua"
        }}
        secondaryAction={{
          text: "Contactar Ahora",
          href: "#contacto"
        }}
      />
      
      <section class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold font-display text-slate-900 mb-4">
              Nuestras Marcas
            </h2>
            <p class="text-xl text-slate-600 max-w-3xl mx-auto">
              Tres marcas especializadas que cubren todas las necesidades del tratamiento de agua
            </p>
          </div>
          
          <div class="feature-grid stagger-1">
            <Card
              title="Soluciones en Agua"
              description="Sistemas completos de tratamiento y purificación de agua para uso industrial y doméstico. Soluciones personalizadas para cada necesidad específica."
              brand="blue"
              href="/soluciones-en-agua"
              status="Líder en el mercado"
            />
            
            <Card
              title="Wattersolutions"
              description="Tecnología avanzada en filtración y equipos especializados. Innovación constante para el tratamiento de agua más eficiente."
              brand="green"
              href="/wattersolutions"
              status="Tecnología avanzada"
            />
            
            <Card
              title="Acuafitting"
              description="Accesorios y conectores especializados para sistemas de agua y filtración. Componentes de alta calidad para instalaciones profesionales."
              brand="purple"
              href="/acuafitting"
              status="Componentes premium"
            />
          </div>
        </div>
      </section>
      
      <section class="py-20 bg-slate-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold font-display text-slate-900 mb-4">
              ¿Por qué elegir ANTKO?
            </h2>
            <p class="text-xl text-slate-600 max-w-3xl mx-auto">
              Nuestra experiencia y compromiso con la calidad nos posicionan como la mejor opción
            </p>
          </div>
          
          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div class="text-center">
              <div class="w-16 h-16 bg-gradient-to-r from-antko-blue-500 to-antko-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-slate-900 mb-2">20+ Años</h3>
              <p class="text-slate-600">de experiencia en el mercado</p>
            </div>
            
            <div class="text-center">
              <div class="w-16 h-16 bg-gradient-to-r from-antko-green-500 to-antko-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-slate-900 mb-2">Tecnología</h3>
              <p class="text-slate-600">de vanguardia en filtración</p>
            </div>
            
            <div class="text-center">
              <div class="w-16 h-16 bg-gradient-to-r from-antko-purple-500 to-antko-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-slate-900 mb-2">Soporte</h3>
              <p class="text-slate-600">técnico especializado 24/7</p>
            </div>
            
            <div class="text-center">
              <div class="w-16 h-16 bg-gradient-to-r from-slate-500 to-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-slate-900 mb-2">Calidad</h3>
              <p class="text-slate-600">certificada internacionalmente</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
