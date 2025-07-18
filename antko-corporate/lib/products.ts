import { Product, ProductFilters } from "./types.ts";

// In-memory store (in production, this would be a database)
const products: Product[] = [
  {
    id: "1",
    name: "Sistema de Filtración Industrial",
    description: "Sistema completo de filtración para uso industrial con alta capacidad de procesamiento",
    price: 15000,
    category: "Filtración",
    imageUrl: "",
    visibility: {
      solucionesEnAgua: true,
      wattersolutions: false,
      acuafitting: false
    },
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "2",
    name: "Filtro Avanzado de Carbón Activado",
    description: "Filtro de alta tecnología con carbón activado para máxima purificación",
    price: 850,
    category: "Filtros",
    imageUrl: "",
    visibility: {
      solucionesEnAgua: false,
      wattersolutions: true,
      acuafitting: false
    },
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02")
  },
  {
    id: "3",
    name: "Conector Universal para Tuberías",
    description: "Conector especializado compatible con diferentes tipos de tuberías",
    price: 45,
    category: "Conectores",
    imageUrl: "",
    visibility: {
      solucionesEnAgua: false,
      wattersolutions: false,
      acuafitting: true
    },
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-03")
  }
];

export class ProductService {
  static getAll(filters?: ProductFilters): Product[] {
    let filteredProducts = [...products];
    
    if (filters?.brand) {
      filteredProducts = filteredProducts.filter(product => {
        switch (filters.brand) {
          case "soluciones":
            return product.visibility.solucionesEnAgua;
          case "wattersolutions":
            return product.visibility.wattersolutions;
          case "acuafitting":
            return product.visibility.acuafitting;
          default:
            return true;
        }
      });
    }
    
    if (filters?.category) {
      filteredProducts = filteredProducts.filter(product => 
        product.category.toLowerCase().includes(filters.category!.toLowerCase())
      );
    }
    
    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      );
    }
    
    return filteredProducts;
  }
  
  static getById(id: string): Product | undefined {
    return products.find(product => product.id === id);
  }
  
  static create(productData: Omit<Product, "id" | "createdAt" | "updatedAt">): Product {
    const newProduct: Product = {
      ...productData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    products.push(newProduct);
    return newProduct;
  }
  
  static update(id: string, productData: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>): Product | undefined {
    const index = products.findIndex(product => product.id === id);
    if (index === -1) return undefined;
    
    products[index] = {
      ...products[index],
      ...productData,
      updatedAt: new Date()
    };
    
    return products[index];
  }
  
  static delete(id: string): boolean {
    const index = products.findIndex(product => product.id === id);
    if (index === -1) return false;
    
    products.splice(index, 1);
    return true;
  }
}