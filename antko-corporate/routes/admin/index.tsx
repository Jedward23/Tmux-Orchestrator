import { Handlers, PageProps } from "$fresh/server.ts";
import { Button } from "../../components/Button.tsx";
import { FormField } from "../../components/FormField.tsx";

interface Data {
  isAuthenticated: boolean;
  error?: string;
}

export const handler: Handlers<Data> = {
  GET(_req, ctx) {
    return ctx.render({ isAuthenticated: false });
  },
  
  async POST(req, ctx) {
    const formData = await req.formData();
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    
    // Simple authentication (should be replaced with proper auth)
    if (username === "admin" && password === "admin123") {
      const headers = new Headers();
      headers.set("Set-Cookie", "auth=authenticated; HttpOnly; Path=/; Max-Age=86400");
      headers.set("Location", "/admin/dashboard");
      return new Response(null, { status: 302, headers });
    }
    
    return ctx.render({ isAuthenticated: false, error: "Credenciales inválidas" });
  }
};

export default function AdminLogin({ data }: PageProps<Data>) {
  return (
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div class="max-w-md w-full">
        <div class="text-center mb-8">
          <h1 class="navbar-brand text-4xl mb-2">ANTKO</h1>
          <p class="text-slate-600">Panel de Administración</p>
        </div>
        
        <div class="bg-white rounded-xl shadow-antko p-8">
          <div class="text-center mb-8">
            <h2 class="text-2xl font-bold text-slate-900 mb-2">Iniciar Sesión</h2>
            <p class="text-slate-600">Acceso al panel de administración</p>
          </div>
          
          {data.error && (
            <div class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                </svg>
                <p class="text-red-800 text-sm font-medium">{data.error}</p>
              </div>
            </div>
          )}
          
          <form method="POST" class="space-y-6">
            <FormField
              label="Usuario"
              name="username"
              type="text"
              required
              placeholder="Ingresa tu usuario"
            />
            
            <FormField
              label="Contraseña"
              name="password"
              type="password"
              required
              placeholder="Ingresa tu contraseña"
            />
            
            <Button type="submit" className="w-full" size="lg">
              Iniciar Sesión
            </Button>
          </form>
          
          <div class="mt-8 text-center">
            <a href="/" class="text-antko-blue-600 hover:text-antko-blue-800 font-medium">
              ← Volver al inicio
            </a>
          </div>
          
          <div class="mt-6 p-4 bg-slate-50 rounded-lg">
            <p class="text-xs text-slate-600 text-center">
              <strong>Credenciales de prueba:</strong><br/>
              Usuario: admin | Contraseña: admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}