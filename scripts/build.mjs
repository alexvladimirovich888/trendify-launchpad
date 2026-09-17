import { copyFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(root, "src/scripts/site.js");
const output = resolve(root, "public/site.js");
const baseCssSource = resolve(root, "src/styles/base.css");
const baseCssOutput = resolve(root, "public/base.css");

await mkdir(dirname(output), { recursive: true });
await Promise.all([
	copyFile(source, output),
	copyFile(baseCssSource, baseCssOutput),
]);

console.log("Copied JavaScript and base CSS to public output");