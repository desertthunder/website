import { initWasm } from "@resvg/resvg-wasm";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

let wasmInitialized = false;

/**
 * Initialize WASM module for resvg.
 */
export async function ensureWasmInitialized() {
  if (!wasmInitialized) {
    const wasmPath = resolve("./node_modules/@resvg/resvg-wasm/index_bg.wasm");
    const wasmBinary = await readFile(wasmPath);
    await initWasm(wasmBinary);
    wasmInitialized = true;
  }
}
