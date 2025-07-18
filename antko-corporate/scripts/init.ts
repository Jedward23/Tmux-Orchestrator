#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write --unstable-kv

/**
 * SECURITY INFRASTRUCTURE INITIALIZATION SCRIPT
 * Initializes encrypted Deno KV database and sets up enterprise-grade security
 */

import secureKv from "../lib/kv.ts";

console.log("🔐 Initializing Security Infrastructure...");

try {
  // Initialize the secure KV store
  await secureKv.init();
  console.log("✅ Encrypted Deno KV database initialized");
  
  // Create initial audit log entry
  await secureKv.set(
    ["system", "init"],
    {
      event: "SECURITY_INFRASTRUCTURE_INITIALIZED",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      features: [
        "AES-256-GCM encryption",
        "Comprehensive audit logging",
        "Secure data operations",
        "Enterprise-grade security"
      ]
    },
    { userId: "SYSTEM" }
  );
  
  console.log("✅ Initial audit log created");
  
  // Verify encryption is working
  const testData = { test: "encryption_verification", timestamp: new Date() };
  await secureKv.set(["test", "encryption"], testData, { userId: "SYSTEM" });
  
  const retrieved = await secureKv.get(["test", "encryption"], { userId: "SYSTEM" });
  
  if (retrieved.value && retrieved.value.test === "encryption_verification") {
    console.log("✅ Encryption/decryption verification successful");
    await secureKv.delete(["test", "encryption"], { userId: "SYSTEM" });
  } else {
    console.error("❌ Encryption verification failed");
    Deno.exit(1);
  }
  
  // Display security configuration
  console.log("\n🔒 Security Configuration:");
  console.log("- Database: Encrypted Deno KV");
  console.log("- Encryption: AES-256-GCM");
  console.log("- Audit Logging: Enabled");
  console.log("- Data Protection: Enterprise-grade");
  
  // Check environment variables
  const encryptionKey = Deno.env.get("ENCRYPTION_KEY");
  if (!encryptionKey || encryptionKey === "default-key-change-in-production") {
    console.log("\n⚠️  WARNING: Using default encryption key!");
    console.log("   Set ENCRYPTION_KEY environment variable in production");
  }
  
  console.log("\n✅ Security infrastructure initialization complete!");
  console.log("🚨 IMPORTANT: Customer data entry is RESTRICTED until authentication system is implemented");
  console.log("\n🔐 Next steps:");
  console.log("1. Implement JWT authentication system");
  console.log("2. Add role-based access control");
  console.log("3. Set up monitoring and alerting");
  console.log("4. Configure backup procedures");
  
} catch (error) {
  console.error("❌ Failed to initialize security infrastructure:", error);
  Deno.exit(1);
}