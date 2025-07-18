import { useSignal } from "@preact/signals";
import { Button } from "../components/Button.tsx";

interface DeleteConfirmationProps {
  productId: string;
  productName: string;
  onCancel: () => void;
}

export default function DeleteConfirmation({ 
  productId, 
  productName, 
  onCancel 
}: DeleteConfirmationProps) {
  const isDeleting = useSignal(false);

  const handleDelete = async () => {
    isDeleting.value = true;
    
    try {
      const formData = new FormData();
      formData.append("action", "delete");
      formData.append("id", productId);
      
      const response = await fetch("/admin/products", {
        method: "POST",
        body: formData
      });
      
      if (response.ok) {
        window.location.reload();
      } else {
        throw new Error("Error al eliminar el producto");
      }
    } catch (error) {
      alert("Error al eliminar el producto. Por favor intenta nuevamente.");
      isDeleting.value = false;
    }
  };

  return (
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-md w-full p-6 animate-in">
        <div class="flex items-center mb-4">
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-slate-900">
              Confirmar Eliminación
            </h3>
            <p class="text-sm text-slate-500">
              Esta acción no se puede deshacer
            </p>
          </div>
        </div>
        
        <p class="text-slate-600 mb-6">
          ¿Está seguro de que desea eliminar el producto 
          <span class="font-semibold text-slate-900">"{productName}"</span>?
        </p>
        
        <div class="flex justify-end space-x-3">
          <Button 
            variant="secondary" 
            onClick={onCancel}
            disabled={isDeleting.value}
          >
            Cancelar
          </Button>
          
          <Button 
            variant="danger" 
            onClick={handleDelete}
            disabled={isDeleting.value}
          >
            {isDeleting.value ? (
              <>
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Eliminando...
              </>
            ) : (
              "Eliminar"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}