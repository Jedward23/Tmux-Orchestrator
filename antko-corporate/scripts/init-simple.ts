#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write --unstable-kv

import { UserService } from "../lib/users.ts";

console.log("🔧 Initializing Antko Corporate CRM...");

try {
  // Initialize default admin user
  await UserService.initializeDefaultUser();
  
  console.log("✅ Default admin user initialized");
  console.log("📧 Email: admin@antko.com");
  console.log("🔐 Password: admin123");
  console.log("⚠️  IMPORTANT: Change the default password in production!");
  
  console.log("🎉 CRM initialization completed successfully!");
  console.log("\n🚀 Start the server with: deno task start");
  console.log("🔐 Test login at: http://localhost:8000/api/auth/login");
  
} catch (error) {
  console.error("❌ Initialization failed:", error);
  Deno.exit(1);
}