import { useSignal, useComputed } from "@preact/signals";
import { Button } from "../components/Button.tsx";
import { FormField } from "../components/FormField.tsx";
import { Product } from "../lib/types.ts";

interface ProductFormProps {
  product?: Product;
  isEditing?: boolean;
}

export default function ProductForm({ product, isEditing = false }: ProductFormProps) {
  const name = useSignal(product?.name || "");
  const description = useSignal(product?.description || "");
  const price = useSignal(product?.price?.toString() || "");
  const category = useSignal(product?.category || "");
  const imageUrl = useSignal(product?.imageUrl || "");
  
  const solucionesEnAgua = useSignal(product?.visibility.solucionesEnAgua || false);
  const wattersolutions = useSignal(product?.visibility.wattersolutions || false);
  const acuafitting = useSignal(product?.visibility.acuafitting || false);
  
  const isSubmitting = useSignal(false);
  const errors = useSignal<Record<string, string>>({});

  const isValid = useComputed(() => {
    return name.value.trim() !== "" &&
           description.value.trim() !== "" &&
           price.value !== "" &&
           category.value.trim() !== "" &&
           !isNaN(parseFloat(price.value)) &&
           parseFloat(price.value) > 0;
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.value.trim()) {
      newErrors.name = "El nombre es obligatorio";
    }
    
    if (!description.value.trim()) {
      newErrors.description = "La descripción es obligatoria";
    }
    
    if (!price.value) {
      newErrors.price = "El precio es obligatorio";
    } else if (isNaN(parseFloat(price.value)) || parseFloat(price.value) <= 0) {
      newErrors.price = "El precio debe ser un número mayor a 0";
    }
    
    if (!category.value.trim()) {
      newErrors.category = "La categoría es obligatoria";
    }

    if (!solucionesEnAgua.value && !wattersolutions.value && !acuafitting.value) {
      newErrors.visibility = "El producto debe ser visible en al menos una subbrand";
    }
    
    errors.value = newErrors;
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    isSubmitting.value = true;
    
    try {
      const formData = new FormData();
      formData.append("name", name.value);
      formData.append("description", description.value);
      formData.append("price", price.value);
      formData.append("category", category.value);
      formData.append("imageUrl", imageUrl.value);
      
      if (solucionesEnAgua.value) formData.append("solucionesEnAgua", "on");
      if (wattersolutions.value) formData.append("wattersolutions", "on");
      if (acuafitting.value) formData.append("acuafitting", "on");
      
      const url = isEditing ? `/admin/products/edit/${product!.id}` : "/admin/products/new";
      const response = await fetch(url, {
        method: "POST",
        body: formData
      });
      
      if (response.ok) {
        window.location.href = "/admin/products";
      } else {
        throw new Error("Error al guardar el producto");
      }
    } catch (error) {
      alert("Error al guardar el producto. Por favor intenta nuevamente.");
    } finally {
      isSubmitting.value = false;
    }
  };

  return (
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold text-slate-900 mb-6">
        {isEditing ? "Editar Producto" : "Crear Nuevo Producto"}
      </h2>
      
      <form onSubmit={handleSubmit} class="space-y-6">
        <FormField
          label="Nombre del Producto"
          name="name"
          type="text"
          value={name.value}
          required
          error={errors.value.name}
          placeholder="Ingrese el nombre del producto"
        />
        
        <FormField
          label="Descripción"
          name="description"
          type="textarea"
          value={description.value}
          required
          error={errors.value.description}
          placeholder="Describa el producto detalladamente"
          rows={4}
        />
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Precio"
            name="price"
            type="number"
            value={price.value}
            required
            error={errors.value.price}
            placeholder="0.00"
            step="0.01"
            min="0"
          />
          
          <FormField
            label="Categoría"
            name="category"
            type="text"
            value={category.value}
            required
            error={errors.value.category}
            placeholder="Ej: Filtración, Conectores, etc."
          />
        </div>
        
        <FormField
          label="URL de Imagen"
          name="imageUrl"
          type="url"
          value={imageUrl.value}
          placeholder="https://ejemplo.com/imagen.jpg"
          help="Opcional: URL de la imagen del producto"
        />
        
        <div class="border-t pt-6">
          <h3 class="text-lg font-semibold text-slate-900 mb-4">
            Visibilidad en Subbrands
          </h3>
          
          {errors.value.visibility && (
            <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p class="text-sm text-red-600">{errors.value.visibility}</p>
            </div>
          )}
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="flex items-center p-4 border border-antko-blue-200 rounded-lg">
              <input
                id="solucionesEnAgua"
                name="solucionesEnAgua"
                type="checkbox"
                checked={solucionesEnAgua.value}
                onChange={(e) => solucionesEnAgua.value = e.currentTarget.checked}
                class="h-4 w-4 text-antko-blue-600 focus:ring-antko-blue-500 border-slate-300 rounded"
              />
              <label htmlFor="solucionesEnAgua" class="ml-2 block text-sm font-medium text-slate-900">
                Soluciones en Agua
              </label>
            </div>
            
            <div class="flex items-center p-4 border border-antko-green-200 rounded-lg">
              <input
                id="wattersolutions"
                name="wattersolutions"
                type="checkbox"
                checked={wattersolutions.value}
                onChange={(e) => wattersolutions.value = e.currentTarget.checked}
                class="h-4 w-4 text-antko-green-600 focus:ring-antko-green-500 border-slate-300 rounded"
              />
              <label htmlFor="wattersolutions" class="ml-2 block text-sm font-medium text-slate-900">
                Wattersolutions
              </label>
            </div>
            
            <div class="flex items-center p-4 border border-antko-purple-200 rounded-lg">
              <input
                id="acuafitting"
                name="acuafitting"
                type="checkbox"
                checked={acuafitting.value}
                onChange={(e) => acuafitting.value = e.currentTarget.checked}
                class="h-4 w-4 text-antko-purple-600 focus:ring-antko-purple-500 border-slate-300 rounded"
              />
              <label htmlFor="acuafitting" class="ml-2 block text-sm font-medium text-slate-900">
                Acuafitting
              </label>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 pt-6 border-t">
          <Button 
            variant="secondary" 
            href="/admin/products"
            disabled={isSubmitting.value}
          >
            Cancelar
          </Button>
          
          <Button 
            type="submit" 
            disabled={isSubmitting.value || !isValid.value}
          >
            {isSubmitting.value ? (
              <>
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                {isEditing ? "Actualizando..." : "Creando..."}
              </>
            ) : (
              isEditing ? "Actualizar Producto" : "Crear Producto"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}