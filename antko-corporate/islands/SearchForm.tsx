import { useSignal } from "@preact/signals";
import { Button } from "../components/Button.tsx";

interface SearchFormProps {
  initialBrand?: string;
  initialCategory?: string;
  initialSearch?: string;
}

export default function SearchForm({ 
  initialBrand = "", 
  initialCategory = "", 
  initialSearch = "" 
}: SearchFormProps) {
  const brand = useSignal(initialBrand);
  const category = useSignal(initialCategory);
  const search = useSignal(initialSearch);
  const isLoading = useSignal(false);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    isLoading.value = true;
    
    // Build query string
    const params = new URLSearchParams();
    if (brand.value) params.set("brand", brand.value);
    if (category.value) params.set("category", category.value);
    if (search.value) params.set("search", search.value);
    
    // Navigate to filtered results
    window.location.href = `/admin/products?${params.toString()}`;
  };

  const clearFilters = () => {
    brand.value = "";
    category.value = "";
    search.value = "";
    window.location.href = "/admin/products";
  };

  return (
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold text-slate-900 mb-4">
        Filtros de Búsqueda
      </h2>
      
      <form onSubmit={handleSubmit} class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              Subbrand
            </label>
            <select 
              value={brand.value}
              onChange={(e) => brand.value = e.currentTarget.value}
              class="form-input"
            >
              <option value="">Todos</option>
              <option value="soluciones">Soluciones en Agua</option>
              <option value="wattersolutions">Wattersolutions</option>
              <option value="acuafitting">Acuafitting</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              Categoría
            </label>
            <input 
              type="text" 
              value={category.value}
              onInput={(e) => category.value = e.currentTarget.value}
              placeholder="Buscar categoría..."
              class="form-input"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              Buscar
            </label>
            <input 
              type="text" 
              value={search.value}
              onInput={(e) => search.value = e.currentTarget.value}
              placeholder="Buscar productos..."
              class="form-input"
            />
          </div>
        </div>
        
        <div class="flex flex-col sm:flex-row gap-3">
          <Button 
            type="submit" 
            disabled={isLoading.value}
            className="flex-1 sm:flex-none"
          >
            {isLoading.value ? (
              <>
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Filtrando...
              </>
            ) : (
              "Filtrar"
            )}
          </Button>
          
          <Button 
            variant="secondary" 
            onClick={clearFilters}
            type="button"
            className="flex-1 sm:flex-none"
          >
            Limpiar Filtros
          </Button>
        </div>
      </form>
    </div>
  );
}