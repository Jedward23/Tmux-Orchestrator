import { Product, ProductFilters } from "../types.ts";
import secureKv from "../kv.ts";

export class SecureProductService {
  private static readonly PREFIX = ["products"];
  private static readonly INDEX_PREFIX = ["products_index"];

  static async create(productData: Omit<Product, "id" | "createdAt" | "updatedAt">, userId: string): Promise<Product> {
    const newProduct: Product = {
      ...productData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const atomic = await secureKv.atomic();
    
    // Store product
    await atomic.set([...this.PREFIX, newProduct.id], newProduct);
    
    // Create search indices
    await atomic.set([...this.INDEX_PREFIX, "by_category", productData.category.toLowerCase(), newProduct.id], newProduct.id);
    await atomic.set([...this.INDEX_PREFIX, "by_name", productData.name.toLowerCase(), newProduct.id], newProduct.id);
    
    const result = await atomic.commit();
    
    if (!result.ok) {
      throw new Error("Failed to create product");
    }

    return newProduct;
  }

  static async getById(id: string, userId: string): Promise<Product | null> {
    const result = await secureKv.get<Product>([...this.PREFIX, id], { userId });
    return result.value;
  }

  static async getAll(filters?: ProductFilters, userId?: string): Promise<Product[]> {
    const products = await secureKv.list<Product>({ prefix: this.PREFIX }, { userId });
    
    let filteredProducts = products;
    
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

  static async update(id: string, productData: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>, userId: string): Promise<Product | null> {
    const existing = await secureKv.get<Product>([...this.PREFIX, id], { userId });
    if (!existing.value) return null;

    const updatedProduct: Product = {
      ...existing.value,
      ...productData,
      updatedAt: new Date()
    };

    const result = await secureKv.set([...this.PREFIX, id], updatedProduct, { userId });
    
    if (!result.ok) {
      throw new Error("Failed to update product");
    }

    return updatedProduct;
  }

  static async delete(id: string, userId: string): Promise<boolean> {
    const existing = await secureKv.get<Product>([...this.PREFIX, id], { userId });
    if (!existing.value) return false;

    const atomic = await secureKv.atomic();
    
    // Delete product
    await atomic.delete([...this.PREFIX, id]);
    
    // Delete indices
    await atomic.delete([...this.INDEX_PREFIX, "by_category", existing.value.category.toLowerCase(), id]);
    await atomic.delete([...this.INDEX_PREFIX, "by_name", existing.value.name.toLowerCase(), id]);
    
    const result = await atomic.commit();
    return result.ok;
  }

  static async getAuditTrail(productId: string, userId: string): Promise<any[]> {
    // Get audit logs related to this product
    const allLogs = await secureKv.getAuditLogs(1000);
    return allLogs.filter(log => 
      log.details.key && log.details.key.includes(productId)
    );
  }
}