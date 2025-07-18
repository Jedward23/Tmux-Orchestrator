import { crypto } from "https://deno.land/std@0.216.0/crypto/mod.ts";

interface KVConfig {
  encryptionKey: string;
  backupEnabled: boolean;
  auditLog: boolean;
}

class SecureKV {
  private kv: Deno.Kv;
  private encryptionKey: string;
  private initialized = false;

  constructor(private config: KVConfig) {
    this.encryptionKey = config.encryptionKey;
  }

  async init(): Promise<void> {
    if (this.initialized) return;
    
    // Use environment-specific KV store
    const kvPath = Deno.env.get("DENO_KV_PATH") || undefined;
    this.kv = await Deno.openKv(kvPath);
    this.initialized = true;
    
    await this.auditLog("SYSTEM", "KV_INITIALIZED", { 
      path: kvPath || "default",
      timestamp: new Date().toISOString()
    });
  }

  private async encrypt(data: any): Promise<string> {
    const plaintext = JSON.stringify(data);
    const encoder = new TextEncoder();
    const keyData = encoder.encode(this.encryptionKey.padEnd(32, '0').slice(0, 32));
    
    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "AES-GCM" },
      false,
      ["encrypt"]
    );
    
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedPlaintext = encoder.encode(plaintext);
    
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      encodedPlaintext
    );
    
    return JSON.stringify({
      encrypted: Array.from(new Uint8Array(encrypted)),
      iv: Array.from(iv)
    });
  }

  private async decrypt(encryptedData: string): Promise<any> {
    const { encrypted, iv } = JSON.parse(encryptedData);
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    
    const keyData = encoder.encode(this.encryptionKey.padEnd(32, '0').slice(0, 32));
    
    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    );
    
    const encryptedBuffer = new Uint8Array(encrypted);
    const ivBuffer = new Uint8Array(iv);
    
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: ivBuffer },
      key,
      encryptedBuffer
    );
    
    return JSON.parse(decoder.decode(decrypted));
  }

  async set(key: Deno.KvKey, value: any, metadata?: { userId?: string }): Promise<Deno.KvCommitResult> {
    if (!this.initialized) await this.init();
    
    const encryptedValue = await this.encrypt(value);
    const result = await this.kv.set(key, encryptedValue);
    
    // Audit log for data writes
    await this.auditLog(
      metadata?.userId || "SYSTEM",
      "DATA_WRITE",
      {
        key: key.join(":"),
        success: result.ok,
        timestamp: new Date().toISOString()
      }
    );
    
    return result;
  }

  async get<T>(key: Deno.KvKey, metadata?: { userId?: string }): Promise<Deno.KvEntryMaybe<T>> {
    if (!this.initialized) await this.init();
    
    const result = await this.kv.get(key);
    
    // Audit log for data reads
    await this.auditLog(
      metadata?.userId || "SYSTEM",
      "DATA_READ",
      {
        key: key.join(":"),
        found: result.value !== null,
        timestamp: new Date().toISOString()
      }
    );
    
    if (result.value === null) {
      return { key, value: null, versionstamp: null };
    }
    
    const decryptedValue = await this.decrypt(result.value as string);
    return {
      key: result.key,
      value: decryptedValue,
      versionstamp: result.versionstamp
    };
  }

  async delete(key: Deno.KvKey, metadata?: { userId?: string }): Promise<void> {
    if (!this.initialized) await this.init();
    
    await this.kv.delete(key);
    
    // Audit log for data deletion
    await this.auditLog(
      metadata?.userId || "SYSTEM",
      "DATA_DELETE",
      {
        key: key.join(":"),
        timestamp: new Date().toISOString()
      }
    );
  }

  async list<T>(selector: Deno.KvListSelector, metadata?: { userId?: string }): Promise<T[]> {
    if (!this.initialized) await this.init();
    
    const results: T[] = [];
    const entries = this.kv.list(selector);
    
    for await (const entry of entries) {
      if (entry.value !== null) {
        const decryptedValue = await this.decrypt(entry.value as string);
        results.push(decryptedValue);
      }
    }
    
    // Audit log for data listing
    await this.auditLog(
      metadata?.userId || "SYSTEM",
      "DATA_LIST",
      {
        selector: JSON.stringify(selector),
        count: results.length,
        timestamp: new Date().toISOString()
      }
    );
    
    return results;
  }

  async atomic(): Promise<SecureKvAtomicOperation> {
    if (!this.initialized) await this.init();
    return new SecureKvAtomicOperation(this.kv.atomic(), this);
  }

  private async auditLog(userId: string, action: string, details: any): Promise<void> {
    if (!this.config.auditLog) return;
    
    const logEntry = {
      id: crypto.randomUUID(),
      userId,
      action,
      details,
      timestamp: new Date().toISOString(),
      ip: "internal" // In production, capture real IP
    };
    
    // Store audit logs in separate encrypted key space
    await this.kv.set(["audit", logEntry.id], await this.encrypt(logEntry));
  }

  async getAuditLogs(limit = 100): Promise<any[]> {
    if (!this.initialized) await this.init();
    
    const logs: any[] = [];
    const entries = this.kv.list({ prefix: ["audit"] }, { limit });
    
    for await (const entry of entries) {
      if (entry.value !== null) {
        const decryptedLog = await this.decrypt(entry.value as string);
        logs.push(decryptedLog);
      }
    }
    
    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
}

class SecureKvAtomicOperation {
  constructor(
    private atomic: Deno.KvAtomicOperation,
    private secureKv: SecureKV
  ) {}

  async set(key: Deno.KvKey, value: any): Promise<SecureKvAtomicOperation> {
    const encryptedValue = await (this.secureKv as any).encrypt(value);
    this.atomic.set(key, encryptedValue);
    return this;
  }

  delete(key: Deno.KvKey): SecureKvAtomicOperation {
    this.atomic.delete(key);
    return this;
  }

  check(entry: Deno.KvEntryMaybe<any>): SecureKvAtomicOperation {
    this.atomic.check(entry);
    return this;
  }

  async commit(): Promise<Deno.KvCommitResult> {
    return await this.atomic.commit();
  }
}

// Initialize secure KV instance
const encryptionKey = Deno.env.get("ENCRYPTION_KEY") || "default-key-change-in-production";
const kvConfig: KVConfig = {
  encryptionKey,
  backupEnabled: true,
  auditLog: true
};

const secureKv = new SecureKV(kvConfig);

export default secureKv;
export { SecureKV, type KVConfig };