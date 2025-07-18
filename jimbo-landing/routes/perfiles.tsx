import { PageProps } from "$fresh/server.ts";
import PageHeader from "../components/PageHeader.tsx";
import Card from "../components/Card.tsx";

export default function Perfiles(props: PageProps) {
  const socialData = {
    platforms: [
      { name: "LinkedIn", followers: "15K+", engagement: "Alto", icon: "💼" },
      { name: "Twitter", followers: "8K+", engagement: "Muy Alto", icon: "🐦" },
      { name: "Instagram", followers: "12K+", engagement: "Medio", icon: "📸" },
      { name: "GitHub", followers: "5K+", engagement: "Alto", icon: "👨‍💻" },
    ],
    communities: [
      "Tech Leaders Community",
      "Digital Entrepreneurs Network",
      "Web Developers Guild",
      "Innovation Hub",
    ],
  };

  const laboralData = {
    experience: [
      {
        position: "Senior Full Stack Developer",
        company: "TechCorp",
        years: "2022-Present",
        type: "Tiempo Completo",
      },
      {
        position: "Lead Frontend Developer",
        company: "InnovateStudio",
        years: "2020-2022",
        type: "Tiempo Completo",
      },
      {
        position: "Freelance Developer",
        company: "Independiente",
        years: "2018-2020",
        type: "Freelance",
      },
    ],
    skills: ["React", "Node.js", "TypeScript", "Python", "AWS", "Docker"],
    projects: [
      {
        name: "E-commerce Platform",
        tech: "React + Node.js",
        impact: "500K+ usuarios",
      },
      {
        name: "Analytics Dashboard",
        tech: "Vue.js + Python",
        impact: "40% mejora en rendimiento",
      },
      {
        name: "Mobile App",
        tech: "React Native",
        impact: "4.8★ rating en stores",
      },
    ],
  };

  const educationData = {
    formal: [
      {
        degree: "Ingeniería en Sistemas",
        institution: "Universidad Tecnológica",
        year: "2018",
        status: "Graduado",
      },
      {
        degree: "Master en IA",
        institution: "Instituto de Tecnología",
        year: "2020",
        status: "En progreso",
      },
    ],
    certifications: [
      { name: "AWS Solutions Architect", issuer: "Amazon", year: "2023" },
      { name: "Google Cloud Professional", issuer: "Google", year: "2022" },
      {
        name: "Certified Scrum Master",
        issuer: "Scrum Alliance",
        year: "2021",
      },
    ],
    courses: [
      "Machine Learning Specialization - Stanford",
      "Advanced React Patterns - Frontend Masters",
      "System Design Interview - ByteByteGo",
    ],
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-50 to-indigo-100 py-12">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16 pt-8">
          <div class="text-6xl mb-4">👤</div>
          <h1 class="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Mis Perfiles
          </h1>
          <p class="text-xl max-w-3xl mx-auto bg-gradient-to-r from-cyan-700 to-indigo-700 bg-clip-text text-transparent font-medium">
            Una vista completa de mi presencia social, trayectoria laboral y
            formación académica
          </p>
        </div>

        {/* Profile Navigation */}
        <div class="flex justify-center mb-12">
          <div class="flex space-x-4 bg-gradient-to-r from-white via-cyan-50 to-blue-50 rounded-full p-2 shadow-xl border border-cyan-200">
            <button class="px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300">
              🌟 Social
            </button>
            <button class="px-6 py-2 text-blue-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 hover:text-white rounded-full text-sm font-medium transition-all duration-300">
              💼 Laboral
            </button>
            <button class="px-6 py-2 text-green-700 hover:bg-gradient-to-r hover:from-green-500 hover:to-teal-500 hover:text-white rounded-full text-sm font-medium transition-all duration-300">
              🎓 Educación
            </button>
          </div>
        </div>

        <div class="max-w-6xl mx-auto space-y-16">
          {/* Social Profile */}
          <section id="social">
            <div class="text-center mb-8">
              <div class="w-24 h-24 bg-gradient-to-r from-pink-400 via-rose-500 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl shadow-2xl">
                🌟
              </div>
              <h2 class="text-3xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
                Presencia Social
              </h2>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card>
                <h3 class="text-xl font-bold mb-4">Plataformas Principales</h3>
                <div class="space-y-4">
                  {socialData.platforms.map((platform, index) => (
                    <div
                      key={index}
                      class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div class="flex items-center">
                        <span class="text-2xl mr-3">{platform.icon}</span>
                        <span class="font-medium">{platform.name}</span>
                      </div>
                      <div class="text-right text-sm">
                        <div class="font-bold text-gray-800">
                          {platform.followers}
                        </div>
                        <div class="text-gray-500">{platform.engagement}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h3 class="text-xl font-bold mb-4">Comunidades Activas</h3>
                <div class="space-y-3">
                  {socialData.communities.map((community, index) => (
                    <div
                      key={index}
                      class="flex items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <span class="w-2 h-2 bg-pink-500 rounded-full mr-3">
                      </span>
                      <span>{community}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </section>

          {/* Laboral Profile */}
          <section id="laboral">
            <div class="text-center mb-8">
              <div class="w-24 h-24 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl shadow-2xl">
                💼
              </div>
              <h2 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Trayectoria Profesional
              </h2>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card>
                <h3 class="text-xl font-bold mb-4">Experiencia</h3>
                <div class="space-y-4">
                  {laboralData.experience.map((job, index) => (
                    <div key={index} class="border-l-4 border-blue-500 pl-4">
                      <h4 class="font-semibold">{job.position}</h4>
                      <p class="text-gray-600">{job.company}</p>
                      <p class="text-sm text-gray-500">
                        {job.years} • {job.type}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h3 class="text-xl font-bold mb-4">Habilidades Técnicas</h3>
                <div class="flex flex-wrap gap-2">
                  {laboralData.skills.map((skill, index) => (
                    <span
                      key={index}
                      class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Card>

              <Card>
                <h3 class="text-xl font-bold mb-4">Proyectos Destacados</h3>
                <div class="space-y-4">
                  {laboralData.projects.map((project, index) => (
                    <div key={index} class="p-3 bg-gray-50 rounded-lg">
                      <h4 class="font-semibold">{project.name}</h4>
                      <p class="text-sm text-gray-600">{project.tech}</p>
                      <p class="text-sm text-blue-600">{project.impact}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </section>

          {/* Education Profile */}
          <section id="education">
            <div class="text-center mb-8">
              <div class="w-24 h-24 bg-gradient-to-r from-green-400 via-teal-500 to-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl shadow-2xl">
                🎓
              </div>
              <h2 class="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                Formación Académica
              </h2>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card>
                <h3 class="text-xl font-bold mb-4">Educación Formal</h3>
                <div class="space-y-4">
                  {educationData.formal.map((edu, index) => (
                    <div key={index} class="border-l-4 border-green-500 pl-4">
                      <h4 class="font-semibold">{edu.degree}</h4>
                      <p class="text-gray-600">{edu.institution}</p>
                      <p class="text-sm text-gray-500">
                        {edu.year} • {edu.status}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h3 class="text-xl font-bold mb-4">Certificaciones</h3>
                <div class="space-y-3">
                  {educationData.certifications.map((cert, index) => (
                    <div
                      key={index}
                      class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <h4 class="font-medium">{cert.name}</h4>
                        <p class="text-sm text-gray-600">{cert.issuer}</p>
                      </div>
                      <span class="text-sm text-green-600 font-medium">
                        {cert.year}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h3 class="text-xl font-bold mb-4">Cursos Especializados</h3>
                <div class="space-y-3">
                  {educationData.courses.map((course, index) => (
                    <div
                      key={index}
                      class="flex items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <span class="w-2 h-2 bg-green-500 rounded-full mr-3">
                      </span>
                      <span class="text-sm">{course}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
