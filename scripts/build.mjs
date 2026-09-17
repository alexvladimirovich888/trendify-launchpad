import { copyFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(root, "src/scripts/site.js");
const output = resolve(root, "public/site.js");

await mkdir(dirname(output), { recursive: true });
await copyFile(source, output);

console.log("Copied src/scripts/site.js to public/site.js");