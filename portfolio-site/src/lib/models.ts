import type { Model } from "./types";
import { fetchAllCivitaiModels } from "./civitai";
import manualModels from "../../data/models.json";

/** Load all models: Civitai API + manual JSON fallback entries */
export async function getAllModels(): Promise<Model[]> {
  // Fetch from Civitai (server-side, cached)
  const civitaiModels = await fetchAllCivitaiModels();

  // Load manual/JSON models as typed entries
  const manual: Model[] = (manualModels as Model[]).map((m) => ({
    ...m,
    source: "manual" as const,
  }));

  // Civitai models first, then manual entries
  return [...civitaiModels, ...manual];
}
