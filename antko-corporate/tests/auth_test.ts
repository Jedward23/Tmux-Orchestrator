import { assertEquals } from "$std/assert/mod.ts";
import { createHandler } from "$fresh/server.ts";
import manifest from "../fresh.gen.ts";
import config from "../fresh.config.ts";

const CONN_INFO = {
  remoteAddr: { hostname: "127.0.0.1", port: 53496, transport: "tcp" }
};

Deno.test("Admin login page loads", async () => {
  const handler = await createHandler(manifest, config);
  const resp = await handler(new Request("http://127.0.0.1:8000/admin"), CONN_INFO);
  
  assertEquals(resp.status, 200);
  
  const html = await resp.text();
  assertEquals(html.includes("Admin Login"), true);
});

Deno.test("Admin login with valid credentials", async () => {
  const handler = await createHandler(manifest, config);
  
  const formData = new FormData();
  formData.append("username", "admin");
  formData.append("password", "admin123");
  
  const request = new Request("http://127.0.0.1:8000/admin", {
    method: "POST",
    body: formData
  });
  
  const resp = await handler(request, CONN_INFO);
  
  assertEquals(resp.status, 302);
  assertEquals(resp.headers.get("Location"), "/admin/dashboard");
  
  const cookies = resp.headers.get("Set-Cookie");
  assertEquals(cookies?.includes("auth=authenticated"), true);
});

Deno.test("Admin login with invalid credentials", async () => {
  const handler = await createHandler(manifest, config);
  
  const formData = new FormData();
  formData.append("username", "admin");
  formData.append("password", "wrong");
  
  const request = new Request("http://127.0.0.1:8000/admin", {
    method: "POST",
    body: formData
  });
  
  const resp = await handler(request, CONN_INFO);
  
  assertEquals(resp.status, 200);
  
  const html = await resp.text();
  assertEquals(html.includes("Credenciales inválidas"), true);
});

Deno.test("Protected route without authentication", async () => {
  const handler = await createHandler(manifest, config);
  const resp = await handler(new Request("http://127.0.0.1:8000/admin/dashboard"), CONN_INFO);
  
  assertEquals(resp.status, 302);
  assertEquals(resp.headers.get("Location"), "/admin");
});

Deno.test("Protected route with authentication", async () => {
  const handler = await createHandler(manifest, config);
  
  const request = new Request("http://127.0.0.1:8000/admin/dashboard", {
    headers: { "Cookie": "auth=authenticated" }
  });
  
  const resp = await handler(request, CONN_INFO);
  
  assertEquals(resp.status, 200);
  
  const html = await resp.text();
  assertEquals(html.includes("Panel de Administración"), true);
});