import { watch } from "node:fs";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve } from "node:path";
import { spawn } from "node:child_process";

const root = resolve(import.meta.dirname, "..");
const port = Number(process.env.PORT || 3000);
let building = false;
let pending = false;

function build() {
  if (building) { pending = true; return; }
  building = true;
  const child = spawn(process.execPath, [resolve(root, "scripts/build.mjs")], { stdio: "inherit" });
  child.on("exit", () => {
    building = false;
    if (pending) { pending = false; build(); }
  });
}

const contentTypes = { ".html": "text/html; charset=utf-8", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };
const server = createServer(async (request, response) => {
  const pathname = new URL(request.url ?? "/", `http://${request.headers.host}`).pathname;
  const relative = pathname === "/" ? "index.html" : pathname.replace(/^\//, "");
  try {
    const file = await readFile(resolve(root, "dist", relative));
    response.writeHead(200, { "content-type": contentTypes[extname(relative).toLowerCase()] ?? "application/octet-stream" });
    response.end(file);
  } catch {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
});

build();
for (const path of ["content", "posters", "src"]) watch(resolve(root, path), { recursive: true }, build);
server.listen(port, "127.0.0.1", () => console.log(`Preview: http://localhost:${port}`));
