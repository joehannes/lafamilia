/**
 * populate-local-data.mjs
 *
 * Build-time script that copies data from public/data/ (static assets)
 * into functions/data/ so Cloudflare Pages Functions can read them
 * during initialization.
 *
 * All data now lives in local JSON files under public/data/ and
 * functions/data/. No more JSONBin dependency.
 *
 * Usage:
 *   node scripts/populate-local-data.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DATA_DIR = path.resolve(__dirname, "..", "public", "data");
const FUNCTIONS_DATA_DIR = path.resolve(__dirname, "..", "functions", "data");

const log = (msg) => console.log(`[populate-local-data] ${msg}`);

const run = async () => {
  log("Copying data from public/data/ to functions/data/…");

  // Ensure target directory exists
  fs.mkdirSync(FUNCTIONS_DATA_DIR, { recursive: true });

  if (!fs.existsSync(PUBLIC_DATA_DIR)) {
    log(
      `WARNING: Source directory ${PUBLIC_DATA_DIR} does not exist. Nothing to copy.`,
    );
    return;
  }

  const files = fs
    .readdirSync(PUBLIC_DATA_DIR)
    .filter((f) => f.endsWith(".json"));
  let copied = 0;

  for (const file of files) {
    const src = path.join(PUBLIC_DATA_DIR, file);
    const dest = path.join(FUNCTIONS_DATA_DIR, file);
    fs.copyFileSync(src, dest);
    log(`OK    ${file}`);
    copied++;
  }

  log(`Done. Copied ${copied} file(s).`);
};

run().catch((err) => {
  console.error("[populate-local-data] Fatal error:", err);
  process.exit(1);
});
