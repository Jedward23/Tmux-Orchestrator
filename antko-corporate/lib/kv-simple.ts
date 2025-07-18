// Simple KV wrapper for immediate authentication functionality
// This provides a basic working version while security infrastructure is being integrated

const kv = await Deno.openKv();

export default kv;
export { kv };