interface NavigationProps {
  currentPath?: string;
  brand?: "blue" | "green" | "purple";
}

export function Navigation({ currentPath, brand = "blue" }: NavigationProps) {
  const isActive = (path: string) => currentPath === path;
  
  const brandColors = {
    blue: "from-antko-blue-600 to-antko-blue-700",
    green: "from-antko-green-600 to-antko-green-700", 
    purple: "from-antko-purple-600 to-antko-purple-700"
  };

  return (
    <nav class="navbar">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <a href="/" class="navbar-brand">
              ANTKO
            </a>
          </div>
          
          <div class="hidden md:flex items-center space-x-8">
            <a 
              href="/soluciones-en-agua" 
              class={`nav-link ${isActive('/soluciones-en-agua') ? 'text-antko-blue-600 font-semibold' : ''}`}
            >
              Soluciones en Agua
            </a>
            <a 
              href="/wattersolutions" 
              class={`nav-link ${isActive('/wattersolutions') ? 'text-antko-green-600 font-semibold' : ''}`}
            >
              Wattersolutions
            </a>
            <a 
              href="/acuafitting" 
              class={`nav-link ${isActive('/acuafitting') ? 'text-antko-purple-600 font-semibold' : ''}`}
            >
              Acuafitting
            </a>
          </div>
          
          <div class="flex items-center space-x-4">
            <a 
              href="/admin" 
              class={`bg-gradient-to-r ${brandColors[brand]} text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200`}
            >
              Admin
            </a>
            
            {/* Mobile menu button */}
            <button class="md:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div class="md:hidden">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="/soluciones-en-agua" class="nav-link block px-3 py-2 rounded-md">
              Soluciones en Agua
            </a>
            <a href="/wattersolutions" class="nav-link block px-3 py-2 rounded-md">
              Wattersolutions
            </a>
            <a href="/acuafitting" class="nav-link block px-3 py-2 rounded-md">
              Acuafitting
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}