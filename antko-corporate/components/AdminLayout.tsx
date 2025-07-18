import { JSX } from "preact";
import { Button } from "./Button.tsx";

interface AdminLayoutProps {
  children: JSX.Element;
  title?: string;
  currentPath?: string;
}

export function AdminLayout({ children, title = "Panel de Administración", currentPath }: AdminLayoutProps) {
  return (
    <div class="min-h-screen bg-slate-50">
      <nav class="navbar bg-white shadow-sm border-b border-slate-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center space-x-4">
              <a href="/" class="navbar-brand">
                ANTKO
              </a>
              <span class="text-slate-400">|</span>
              <span class="text-lg font-semibold text-slate-700">Admin</span>
            </div>
            
            <div class="flex items-center space-x-4">
              <a 
                href="/admin/dashboard" 
                class={`nav-link ${currentPath === '/admin/dashboard' ? 'text-antko-blue-600 font-semibold' : ''}`}
              >
                Dashboard
              </a>
              <a 
                href="/admin/products" 
                class={`nav-link ${currentPath === '/admin/products' ? 'text-antko-blue-600 font-semibold' : ''}`}
              >
                Productos
              </a>
              <Button variant="danger" size="sm" href="/admin/logout">
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main class="animate-in">
        {children}
      </main>
    </div>
  );
}