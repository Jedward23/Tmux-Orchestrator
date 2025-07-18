#!/usr/bin/env deno run -A

const watcher = Deno.watchFs([
  "./routes",
  "./islands", 
  "./components",
  "./static/styles.css"
]);

console.log("🎨 Watching for changes to rebuild CSS...");

// Build CSS initially
const buildCss = async () => {
  try {
    const cmd = new Deno.Command("deno", {
      args: ["run", "-A", "build_css.ts"],
      stdout: "piped",
      stderr: "piped"
    });
    
    const { code, stdout, stderr } = await cmd.output();
    
    if (code === 0) {
      console.log("✅ CSS rebuilt successfully!");
    } else {
      console.error("❌ CSS build failed:", new TextDecoder().decode(stderr));
    }
  } catch (error) {
    console.error("❌ Error building CSS:", error);
  }
};

// Initial build
await buildCss();

// Watch for changes
for await (const event of watcher) {
  if (event.kind === "modify") {
    console.log("📁 Files changed, rebuilding CSS...");
    await buildCss();
  }
}