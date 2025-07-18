import { Handlers, PageProps } from "$fresh/server.ts";
import { AdminLayout } from "../../../../components/AdminLayout.tsx";
import ProductForm from "../../../../islands/ProductForm.tsx";
import { ProductService } from "../../../../lib/products.ts";
import { Product } from "../../../../lib/types.ts";

interface Data {
  product?: Product;
  message?: string;
  error?: string;
}

export const handler: Handlers<Data> = {
  GET(_req, ctx) {
    const id = ctx.params.id;
    const product = ProductService.getById(id);
    
    if (!product) {
      return ctx.renderNotFound();
    }
    
    return ctx.render({ product });
  },
  
  async POST(req, ctx) {
    const id = ctx.params.id;
    const formData = await req.formData();
    
    try {
      const productData: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">> = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        price: parseFloat(formData.get("price") as string),
        category: formData.get("category") as string,
        imageUrl: formData.get("imageUrl") as string || "",
        visibility: {
          solucionesEnAgua: formData.get("solucionesEnAgua") === "on",
          wattersolutions: formData.get("wattersolutions") === "on",
          acuafitting: formData.get("acuafitting") === "on"
        }
      };
      
      // Basic validation
      if (!productData.name || !productData.description || !productData.price || !productData.category) {
        const product = ProductService.getById(id);
        return ctx.render({ product, error: "Todos los campos son obligatorios" });
      }
      
      const updatedProduct = ProductService.update(id, productData);
      
      if (!updatedProduct) {
        return ctx.renderNotFound();
      }
      
      // Redirect to products page
      return new Response(null, {
        status: 302,
        headers: { Location: "/admin/products" }
      });
      
    } catch (error) {
      const product = ProductService.getById(id);
      return ctx.render({ product, error: "Error al actualizar el producto" });
    }
  }
};

export default function EditProduct({ data }: PageProps<Data>) {
  const { product, error } = data;
  
  if (!product) {
    return (
      <AdminLayout title="Producto no encontrado - Panel de Administración">
        <div class="py-8">
          <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center">
              <svg class="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <h2 class="mt-4 text-xl font-semibold text-slate-900">Producto no encontrado</h2>
              <p class="mt-2 text-slate-600">El producto que buscas no existe o ha sido eliminado.</p>
              <div class="mt-6">
                <a href="/admin/products" class="btn-primary">
                  Volver a Productos
                </a>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout title="Editar Producto - Panel de Administración" currentPath="/admin/products">
      <div class="py-8">
        <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="mb-8">
            <h1 class="text-3xl font-bold font-display text-slate-900 mb-2">
              Editar Producto
            </h1>
            <p class="text-lg text-slate-600">
              Modifica la información del producto: <span class="font-semibold">{product.name}</span>
            </p>
          </div>
          
          <ProductForm product={product} isEditing={true} />
        </div>
      </div>
    </AdminLayout>
  );
}