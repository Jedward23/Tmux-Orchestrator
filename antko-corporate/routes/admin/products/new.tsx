import { Handlers, PageProps } from "$fresh/server.ts";
import { AdminLayout } from "../../../components/AdminLayout.tsx";
import ProductForm from "../../../islands/ProductForm.tsx";
import { ProductService } from "../../../lib/products.ts";
import { Product } from "../../../lib/types.ts";

interface Data {
  message?: string;
  error?: string;
}

export const handler: Handlers<Data> = {
  GET(_req, ctx) {
    return ctx.render({});
  },
  
  async POST(req, ctx) {
    const formData = await req.formData();
    
    try {
      const productData: Omit<Product, "id" | "createdAt" | "updatedAt"> = {
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
        return ctx.render({ error: "Todos los campos son obligatorios" });
      }
      
      const newProduct = ProductService.create(productData);
      
      // Redirect to products page
      return new Response(null, {
        status: 302,
        headers: { Location: "/admin/products" }
      });
      
    } catch (error) {
      return ctx.render({ error: "Error al crear el producto" });
    }
  }
};

export default function NewProduct({ data }: PageProps<Data>) {
  return (
    <AdminLayout title="Nuevo Producto - Panel de Administración" currentPath="/admin/products/new">
      <div class="py-8">
        <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="mb-8">
            <h1 class="text-3xl font-bold font-display text-slate-900 mb-2">
              Crear Nuevo Producto
            </h1>
            <p class="text-lg text-slate-600">
              Agrega un nuevo producto al catálogo de ANTKO
            </p>
          </div>
          
          <ProductForm />
        </div>
      </div>
    </AdminLayout>
  );
}