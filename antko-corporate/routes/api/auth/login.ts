import { Handlers } from "$fresh/server.ts";
import { create } from "https://deno.land/x/djwt@v3.0.2/mod.ts";
import { UserService } from "../../../lib/users.ts";
import { generateKey } from "../../../lib/auth.ts";

export const handler: Handlers = {
  async POST(req) {
    try {
      const { email, password } = await req.json();
      
      if (!email || !password) {
        return new Response(
          JSON.stringify({ error: "Email and password are required" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
      
      // Authenticate user
      const user = await UserService.authenticate(email, password);
      
      if (!user) {
        return new Response(
          JSON.stringify({ error: "Invalid credentials" }),
          {
            status: 401,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
      
      // Generate JWT token
      const key = await generateKey();
      const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 24 hours
        iat: Math.floor(Date.now() / 1000)
      };
      
      const jwt = await create({ alg: "HS256", typ: "JWT" }, payload, key);
      
      return new Response(
        JSON.stringify({
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
          },
          token: jwt
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      );
    } catch (error) {
      console.error("Login error:", error);
      return new Response(
        JSON.stringify({ error: "Internal server error" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
  }
};