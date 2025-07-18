import { assertEquals, assertExists } from "$std/assert/mod.ts";
import { ProductService } from "../lib/products.ts";
import { Product } from "../lib/types.ts";

Deno.test("ProductService - getAll returns products", () => {
  const products = ProductService.getAll();
  assertEquals(products.length >= 0, true);
});

Deno.test("ProductService - getAll with brand filter", () => {
  const solucionesProducts = ProductService.getAll({ brand: "soluciones" });
  const wattersolutionsProducts = ProductService.getAll({ brand: "wattersolutions" });
  const acuafittingProducts = ProductService.getAll({ brand: "acuafitting" });
  
  // Check that filtered products have the correct visibility
  solucionesProducts.forEach(product => {
    assertEquals(product.visibility.solucionesEnAgua, true);
  });
  
  wattersolutionsProducts.forEach(product => {
    assertEquals(product.visibility.wattersolutions, true);
  });
  
  acuafittingProducts.forEach(product => {
    assertEquals(product.visibility.acuafitting, true);
  });
});

Deno.test("ProductService - create product", () => {
  const initialCount = ProductService.getAll().length;
  
  const newProductData: Omit<Product, "id" | "createdAt" | "updatedAt"> = {
    name: "Test Product",
    description: "A test product",
    price: 100,
    category: "Test",
    imageUrl: "",
    visibility: {
      solucionesEnAgua: true,
      wattersolutions: false,
      acuafitting: false
    }
  };
  
  const newProduct = ProductService.create(newProductData);
  
  assertExists(newProduct.id);
  assertEquals(newProduct.name, "Test Product");
  assertEquals(newProduct.price, 100);
  assertEquals(newProduct.visibility.solucionesEnAgua, true);
  assertEquals(newProduct.visibility.wattersolutions, false);
  assertEquals(newProduct.visibility.acuafitting, false);
  
  const afterCount = ProductService.getAll().length;
  assertEquals(afterCount, initialCount + 1);
  
  // Clean up
  ProductService.delete(newProduct.id);
});

Deno.test("ProductService - update product", () => {
  // Create a test product first
  const testProduct = ProductService.create({
    name: "Test Product",
    description: "A test product",
    price: 100,
    category: "Test",
    imageUrl: "",
    visibility: {
      solucionesEnAgua: true,
      wattersolutions: false,
      acuafitting: false
    }
  });
  
  // Update the product
  const updatedProduct = ProductService.update(testProduct.id, {
    name: "Updated Product",
    price: 200,
    visibility: {
      solucionesEnAgua: false,
      wattersolutions: true,
      acuafitting: true
    }
  });
  
  assertExists(updatedProduct);
  assertEquals(updatedProduct!.name, "Updated Product");
  assertEquals(updatedProduct!.price, 200);
  assertEquals(updatedProduct!.visibility.solucionesEnAgua, false);
  assertEquals(updatedProduct!.visibility.wattersolutions, true);
  assertEquals(updatedProduct!.visibility.acuafitting, true);
  
  // Clean up
  ProductService.delete(testProduct.id);
});

Deno.test("ProductService - delete product", () => {
  // Create a test product first
  const testProduct = ProductService.create({
    name: "Test Product",
    description: "A test product",
    price: 100,
    category: "Test",
    imageUrl: "",
    visibility: {
      solucionesEnAgua: true,
      wattersolutions: false,
      acuafitting: false
    }
  });
  
  const deleteResult = ProductService.delete(testProduct.id);
  assertEquals(deleteResult, true);
  
  const deletedProduct = ProductService.getById(testProduct.id);
  assertEquals(deletedProduct, undefined);
});

Deno.test("ProductService - getById with valid id", () => {
  const products = ProductService.getAll();
  if (products.length > 0) {
    const product = ProductService.getById(products[0].id);
    assertExists(product);
    assertEquals(product.id, products[0].id);
  }
});

Deno.test("ProductService - getById with invalid id", () => {
  const product = ProductService.getById("invalid-id");
  assertEquals(product, undefined);
});

Deno.test("ProductService - search functionality", () => {
  const searchResults = ProductService.getAll({ search: "filtro" });
  searchResults.forEach(product => {
    const containsSearchTerm = 
      product.name.toLowerCase().includes("filtro") ||
      product.description.toLowerCase().includes("filtro");
    assertEquals(containsSearchTerm, true);
  });
});

Deno.test("ProductService - category filter", () => {
  const categoryResults = ProductService.getAll({ category: "Filtración" });
  categoryResults.forEach(product => {
    assertEquals(product.category.toLowerCase().includes("filtración"), true);
  });
});