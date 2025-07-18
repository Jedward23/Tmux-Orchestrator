import { assertEquals } from "$std/assert/mod.ts";
import { createHandler } from "$fresh/server.ts";
import manifest from "../fresh.gen.ts";
import config from "../fresh.config.ts";

const CONN_INFO = {
  remoteAddr: { hostname: "127.0.0.1", port: 53496, transport: "tcp" }
};

Deno.test("Soluciones en Agua page loads with correct branding", async () => {
  const handler = await createHandler(manifest, config);
  const resp = await handler(new Request("http://127.0.0.1:8000/soluciones-en-agua"), CONN_INFO);
  
  assertEquals(resp.status, 200);
  
  const html = await resp.text();
  assertEquals(html.includes("Soluciones en Agua"), true);
  assertEquals(html.includes("bg-blue-50"), true);
  assertEquals(html.includes("border-blue-600"), true);
});

Deno.test("Wattersolutions page loads with correct branding", async () => {
  const handler = await createHandler(manifest, config);
  const resp = await handler(new Request("http://127.0.0.1:8000/wattersolutions"), CONN_INFO);
  
  assertEquals(resp.status, 200);
  
  const html = await resp.text();
  assertEquals(html.includes("Wattersolutions"), true);
  assertEquals(html.includes("bg-green-50"), true);
  assertEquals(html.includes("border-green-600"), true);
});

Deno.test("Acuafitting page loads with correct branding", async () => {
  const handler = await createHandler(manifest, config);
  const resp = await handler(new Request("http://127.0.0.1:8000/acuafitting"), CONN_INFO);
  
  assertEquals(resp.status, 200);
  
  const html = await resp.text();
  assertEquals(html.includes("Acuafitting"), true);
  assertEquals(html.includes("bg-purple-50"), true);
  assertEquals(html.includes("border-purple-600"), true);
});

Deno.test("Home page contains links to all subbrands", async () => {
  const handler = await createHandler(manifest, config);
  const resp = await handler(new Request("http://127.0.0.1:8000/"), CONN_INFO);
  
  assertEquals(resp.status, 200);
  
  const html = await resp.text();
  assertEquals(html.includes('href="/soluciones-en-agua"'), true);
  assertEquals(html.includes('href="/wattersolutions"'), true);
  assertEquals(html.includes('href="/acuafitting"'), true);
  assertEquals(html.includes('href="/admin"'), true);
});

Deno.test("Admin products page with brand filter", async () => {
  const handler = await createHandler(manifest, config);
  
  const request = new Request("http://127.0.0.1:8000/admin/products?brand=soluciones", {
    headers: { "Cookie": "auth=authenticated" }
  });
  
  const resp = await handler(request, CONN_INFO);
  
  assertEquals(resp.status, 200);
  
  const html = await resp.text();
  assertEquals(html.includes("Productos"), true);
});

Deno.test("Navigation between subbrands works correctly", async () => {
  const handler = await createHandler(manifest, config);
  
  // Test navigation from Soluciones en Agua to other brands
  const solucionesResp = await handler(new Request("http://127.0.0.1:8000/soluciones-en-agua"), CONN_INFO);
  const solucionesHtml = await solucionesResp.text();
  
  assertEquals(solucionesHtml.includes('href="/wattersolutions"'), true);
  assertEquals(solucionesHtml.includes('href="/acuafitting"'), true);
  assertEquals(solucionesHtml.includes('href="/admin"'), true);
  
  // Test navigation from Wattersolutions to other brands
  const wattersolutionsResp = await handler(new Request("http://127.0.0.1:8000/wattersolutions"), CONN_INFO);
  const wattersolutionsHtml = await wattersolutionsResp.text();
  
  assertEquals(wattersolutionsHtml.includes('href="/soluciones-en-agua"'), true);
  assertEquals(wattersolutionsHtml.includes('href="/acuafitting"'), true);
  assertEquals(wattersolutionsHtml.includes('href="/admin"'), true);
  
  // Test navigation from Acuafitting to other brands
  const acuafittingResp = await handler(new Request("http://127.0.0.1:8000/acuafitting"), CONN_INFO);
  const acuafittingHtml = await acuafittingResp.text();
  
  assertEquals(acuafittingHtml.includes('href="/soluciones-en-agua"'), true);
  assertEquals(acuafittingHtml.includes('href="/wattersolutions"'), true);
  assertEquals(acuafittingHtml.includes('href="/admin"'), true);
});