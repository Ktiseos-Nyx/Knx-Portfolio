import fs from "fs";
import path from "path";
import type { Model } from "./types";
import { fetchAllCivitaiModels } from "./civitai";

/** Load all models: Civitai API + manual JSON fallback entries */
export async function getAllModels(): Promise<Model[]> {
  // Fetch from Civitai (server-side, cached)
  const civitaiModels = await fetchAllCivitaiModels();

  // Load manual/JSON models via filesystem (server-only)
  let manual: Model[] = [];
  const jsonPath = path.join(process.cwd(), "data", "models.json");
  if (fs.existsSync(jsonPath)) {
    const raw = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    manual = (raw as Model[]).map((m) => ({
      ...m,
      source: "manual" as const,
    }));
  }

  // Civitai models first, then manual entries
  return [...civitaiModels, ...manual];
}
