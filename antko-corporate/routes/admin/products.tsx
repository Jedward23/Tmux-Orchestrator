import { Handlers, PageProps } from "$fresh/server.ts";
import { AdminLayout } from "../../components/AdminLayout.tsx";
import { Button } from "../../components/Button.tsx";
import SearchForm from "../../islands/SearchForm.tsx";
import { ProductService } from "../../lib/products.ts";
import { Product, ProductFilters } from "../../lib/types.ts";

interface Data {
  products: Product[];
  filters: ProductFilters;
  message?: string;
}

export const handler: Handlers<Data> = {
  GET(req, ctx) {
    const url = new URL(req.url);
    const filters: ProductFilters = {
      brand: url.searchParams.get("brand") as any,
      category: url.searchParams.get("category") || undefined,
      search: url.searchParams.get("search") || undefined
    };
    
    const products = ProductService.getAll(filters);
    
    return ctx.render({ products, filters });
  },
  
  async POST(req, ctx) {
    const formData = await req.formData();
    const action = formData.get("action") as string;
    
    if (action === "delete") {
      const id = formData.get("id") as string;
      const success = ProductService.delete(id);
      
      const message = success ? "Producto eliminado exitosamente" : "Error al eliminar el producto";
      const products = ProductService.getAll();
      
      return ctx.render({ products, filters: {}, message });
    }
    
    return ctx.render({ products: ProductService.getAll(), filters: {} });
  }
};

export default function ProductsAdmin({ data }: PageProps<Data>) {
  const { products, filters, message } = data;
  
  return (
    <AdminLayout title="Productos - Panel de Administración" currentPath="/admin/products">
      <div class="py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center mb-8">
            <div>
              <h1 class="text-3xl font-bold font-display text-slate-900 mb-2">
                Gestión de Productos
              </h1>
              <p class="text-lg text-slate-600">
                Administra el catálogo de productos y su visibilidad por subbrand
              </p>
            </div>
            <Button href="/admin/products/new" size="lg">
              Nuevo Producto
            </Button>
          </div>

          {message && (
            <div class="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <p class="text-green-800 text-sm font-medium">{message}</p>
              </div>
            </div>
          )}
          
          <SearchForm 
            initialBrand={filters.brand}
            initialCategory={filters.category}
            initialSearch={filters.search}
          />
          
          <div class="bg-white rounded-xl shadow-antko">
            <div class="p-6 border-b border-slate-200">
              <h2 class="text-xl font-semibold text-slate-900">
                Productos ({products.length})
              </h2>
            </div>
            
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-slate-200">
                <thead class="bg-slate-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Precio
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Visibilidad
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-slate-200">
                  {products.map((product) => (
                    <tr key={product.id} class="hover:bg-slate-50">
                      <td class="px-6 py-4">
                        <div class="text-sm font-medium text-slate-900">{product.name}</div>
                        <div class="text-sm text-slate-500 max-w-xs truncate">{product.description}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-800">
                          {product.category}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        ${product.price.toLocaleString()}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex flex-wrap gap-1">
                          {product.visibility.solucionesEnAgua && (
                            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-antko-blue-100 text-antko-blue-800">
                              Soluciones
                            </span>
                          )}
                          {product.visibility.wattersolutions && (
                            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-antko-green-100 text-antko-green-800">
                              Wattersolutions
                            </span>
                          )}
                          {product.visibility.acuafitting && (
                            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-antko-purple-100 text-antko-purple-800">
                              Acuafitting
                            </span>
                          )}
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div class="flex items-center space-x-2">
                          <Button 
                            variant="secondary" 
                            size="sm"
                            href={`/admin/products/edit/${product.id}`}
                          >
                            Editar
                          </Button>
                          <form method="POST" class="inline">
                            <input type="hidden" name="action" value="delete" />
                            <input type="hidden" name="id" value={product.id} />
                            <Button 
                              variant="danger"
                              size="sm"
                              type="submit"
                            >
                              Eliminar
                            </Button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {products.length === 0 && (
                <div class="text-center py-12">
                  <svg class="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  <h3 class="mt-2 text-sm font-medium text-slate-900">No hay productos</h3>
                  <p class="mt-1 text-sm text-slate-500">
                    Comienza creando tu primer producto.
                  </p>
                  <div class="mt-6">
                    <Button href="/admin/products/new">
                      Crear Producto
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}