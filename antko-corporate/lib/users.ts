import { SalesUser } from "./types.ts";
import kv from "./kv-simple.ts";

export interface User extends SalesUser {
  firstName: string;
  lastName: string;
  passwordHash: string;
}

export class UserService {
  static async authenticate(email: string, password: string): Promise<User | null> {
    try {
      const userResult = await kv.get<User>(["users", "by_email", email]);
      const user = userResult.value;
      
      if (!user) {
        return null;
      }
      
      // Check password (in production, use proper hashing like bcrypt)
      const isValidPassword = await this.verifyPassword(password, user.passwordHash);
      
      if (!isValidPassword) {
        return null;
      }
      
      return user;
    } catch (error) {
      console.error("Authentication error:", error);
      return null;
    }
  }
  
  static async create(userData: Omit<User, "id" | "createdAt">): Promise<User> {
    const user: User = {
      ...userData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    
    // Store user with multiple indexes for efficient lookups
    await kv.atomic()
      .set(["users", user.id], user)
      .set(["users", "by_email", user.email], user)
      .commit();
    
    return user;
  }
  
  static async findById(id: string): Promise<User | null> {
    const result = await kv.get<User>(["users", id]);
    return result.value;
  }
  
  static async findByEmail(email: string): Promise<User | null> {
    const result = await kv.get<User>(["users", "by_email", email]);
    return result.value;
  }
  
  static async update(id: string, updates: Partial<Omit<User, "id" | "createdAt">>): Promise<User | null> {
    const existing = await kv.get<User>(["users", id]);
    if (!existing.value) return null;
    
    const updated: User = {
      ...existing.value,
      ...updates,
    };
    
    // Update both indexes
    await kv.atomic()
      .check(existing)
      .set(["users", id], updated)
      .set(["users", "by_email", updated.email], updated)
      .commit();
    
    return updated;
  }
  
  static async delete(id: string): Promise<boolean> {
    const existing = await kv.get<User>(["users", id]);
    if (!existing.value) return false;
    
    const result = await kv.atomic()
      .check(existing)
      .delete(["users", id])
      .delete(["users", "by_email", existing.value.email])
      .commit();
    
    return result.ok;
  }
  
  static async list(): Promise<User[]> {
    const users: User[] = [];
    for await (const entry of kv.list<User>({ prefix: ["users"] })) {
      // Only include direct user entries, not the email index
      if (entry.key.length === 2) {
        users.push(entry.value);
      }
    }
    return users;
  }
  
  private static async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  }
  
  private static async verifyPassword(password: string, hash: string): Promise<boolean> {
    const passwordHash = await this.hashPassword(password);
    return passwordHash === hash;
  }
  
  // Initialize default admin user
  static async initializeDefaultUser(): Promise<void> {
    const adminExists = await this.findByEmail("admin@antko.com");
    if (!adminExists) {
      await this.create({
        firstName: "Admin",
        lastName: "User",
        name: "Admin User",
        email: "admin@antko.com",
        passwordHash: await this.hashPassword("admin123"),
        role: "admin",
        active: true,
      });
      console.log("Default admin user created: admin@antko.com / admin123");
    }
  }
}