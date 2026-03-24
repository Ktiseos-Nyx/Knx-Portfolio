import type { Model } from "./types";
import { CREATORS } from "./constants";

const CIVITAI_API = "https://civitai.com/api/v1";

/**
 * Civitai NSFW levels for images.
 * The API docs say None/Soft/Mature/X but the site uses PG/PG-13/R/X/XXX.
 * We accept both and rely primarily on the boolean `nsfw` field.
 */
type NsfwLevel = string;

/** Safe nsfwLevel values — covers both API-documented and site-facing names */
const SAFE_NSFW_LEVELS = new Set(["None", "Soft", "PG", "PG-13"]);

interface CivitaiImage {
  id: string;
  url: string;
  nsfw: boolean;
  nsfwLevel: NsfwLevel;
  width: number;
  height: number;
  hash?: string;
}

interface CivitaiModelVersion {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  baseModel?: string;
  downloadUrl: string;
  trainedWords?: string[];
  images: CivitaiImage[];
  files?: {
    sizeKb: number;
    primary?: boolean;
  }[];
  stats?: {
    downloadCount: number;
    ratingCount: number;
    rating: number;
  };
}

interface CivitaiModel {
  id: number;
  name: string;
  description?: string;
  type: string; // "Checkpoint" | "TextualInversion" | "Hypernetwork" | "AestheticGradient" | "LORA" | "Controlnet" | "Poses"
  nsfw: boolean;
  tags: string[];
  mode?: "Archived" | "TakenDown" | null;
  creator?: {
    username: string;
    image?: string | null;
  };
  modelVersions?: CivitaiModelVersion[];
  stats?: {
    downloadCount: number;
    favoriteCount: number;
    commentCount: number;
    ratingCount: number;
    rating: number;
  };
}

interface CivitaiResponse {
  items: CivitaiModel[];
  metadata?: {
    nextPage?: string;
    prevPage?: string;
    currentPage: string;
    pageSize: string;
    totalItems: string;
    totalPages: string;
  };
}

/** Friendly display names for Civitai model types */
const TYPE_DISPLAY: Record<string, string> = {
  Checkpoint: "Checkpoint",
  TextualInversion: "Embedding",
  Hypernetwork: "Hypernetwork",
  AestheticGradient: "Aesthetic Gradient",
  LORA: "LoRA",
  Controlnet: "ControlNet",
  Poses: "Poses",
};

/** Map a Civitai API model to our internal Model type */
function mapCivitaiModel(item: CivitaiModel): Model | null {
  // Skip archived or taken-down models
  if (item.mode === "Archived" || item.mode === "TakenDown") return null;

  const firstVersion = item.modelVersions?.[0];

  // Pick the safest available thumbnail:
  // 1. Prefer images where nsfw === false (most reliable field)
  // 2. Fall back to images with a safe nsfwLevel (covers both API naming schemes)
  // 3. Last resort: grab the first image available so we don't show "No preview"
  const images = firstVersion?.images ?? [];
  const safeImage =
    images.find((img) => img.nsfw === false) ??
    images.find((img) => SAFE_NSFW_LEVELS.has(img.nsfwLevel)) ??
    (item.nsfw ? undefined : images[0]);

  // Match creator to our known members
  const matchedCreator = CREATORS.find(
    (c) =>
      c.civitaiUsername?.toLowerCase() ===
      item.creator?.username?.toLowerCase()
  );

  return {
    id: `civitai-${item.id}`,
    name: item.name,
    description: item.description
      ? stripHtml(item.description).slice(0, 200)
      : "No description available.",
    source: "civitai",
    sourceUrl: `https://civitai.com/models/${item.id}`,
    creator: matchedCreator?.name ?? item.creator?.username ?? "unknown",
    tags: item.tags.slice(0, 8),
    baseModel: firstVersion?.baseModel ?? "Unknown",
    type: TYPE_DISPLAY[item.type] ?? item.type,
    nsfw: item.nsfw,
    thumbnailUrl: safeImage?.url,
    createdAt: firstVersion?.createdAt,
    stats: item.stats
      ? {
          downloadCount: item.stats.downloadCount,
          favoriteCount: item.stats.favoriteCount,
          rating: item.stats.rating,
          ratingCount: item.stats.ratingCount,
        }
      : undefined,
  };
}

/** Strip HTML tags from Civitai descriptions */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

/** Fetch models from Civitai for a given username (follows pagination) */
export async function fetchCivitaiModels(
  username: string
): Promise<Model[]> {
  const allModels: Model[] = [];
  let nextUrl: string | null =
    `${CIVITAI_API}/models?username=${encodeURIComponent(username)}&limit=100&sort=Newest`;

  try {
    while (nextUrl) {
      const res = await fetch(nextUrl, { next: { revalidate: 3600 } });

      if (!res.ok) {
        console.error(`Civitai API error for ${username}: ${res.status}`);
        break;
      }

      const data: CivitaiResponse = await res.json();
      const mapped = data.items
        .map(mapCivitaiModel)
        .filter((m): m is Model => m !== null);
      allModels.push(...mapped);

      // Follow pagination if there are more pages
      nextUrl = data.metadata?.nextPage ?? null;
    }
  } catch (err) {
    console.error(`Failed to fetch Civitai models for ${username}:`, err);
  }

  return allModels;
}

/** Fetch models for all known creators */
export async function fetchAllCivitaiModels(): Promise<Model[]> {
  const usernames = CREATORS.map((c) => c.civitaiUsername).filter(Boolean) as string[];

  const results = await Promise.allSettled(
    usernames.map((u) => fetchCivitaiModels(u))
  );

  const models: Model[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      models.push(...result.value);
    }
  }

  // Deduplicate by civitai ID
  const seen = new Set<string>();
  return models.filter((m) => {
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return true;
  });
}
