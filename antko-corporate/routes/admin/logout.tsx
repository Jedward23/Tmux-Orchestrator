import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(_req, _ctx) {
    const headers = new Headers();
    headers.set("Set-Cookie", "auth=; HttpOnly; Path=/; Max-Age=0");
    headers.set("Location", "/admin");
    return new Response(null, { status: 302, headers });
  }
};