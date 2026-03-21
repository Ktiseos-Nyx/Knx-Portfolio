import type { Model } from "./types";
import { CREATORS } from "./constants";

const CIVITAI_API = "https://civitai.com/api/v1";

interface CivitaiModel {
  id: number;
  name: string;
  description?: string;
  type: string;
  nsfw: boolean;
  tags: string[];
  creator?: {
    username: string;
  };
  modelVersions?: {
    baseModel?: string;
    images?: { url: string; nsfw: string }[];
  }[];
}

interface CivitaiResponse {
  items: CivitaiModel[];
  metadata?: {
    nextPage?: string;
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

/** Map a Civitai API model to our internal Model type */
function mapCivitaiModel(item: CivitaiModel): Model {
  const firstVersion = item.modelVersions?.[0];
  // Only use SFW images for thumbnails (NSFW images require auth anyway)
  const sfwImage = firstVersion?.images?.find((img) => img.nsfw === "None");

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
    type: item.type,
    nsfw: item.nsfw,
    thumbnailUrl: sfwImage?.url,
    createdAt: undefined,
  };
}

/** Strip HTML tags from Civitai descriptions */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

/** Fetch models from Civitai for a given username */
export async function fetchCivitaiModels(
  username: string
): Promise<Model[]> {
  try {
    const url = `${CIVITAI_API}/models?username=${encodeURIComponent(username)}&limit=100&sort=Newest`;
    const res = await fetch(url, { next: { revalidate: 3600 } }); // cache 1 hour

    if (!res.ok) {
      console.error(`Civitai API error for ${username}: ${res.status}`);
      return [];
    }

    const data: CivitaiResponse = await res.json();
    return data.items.map(mapCivitaiModel);
  } catch (err) {
    console.error(`Failed to fetch Civitai models for ${username}:`, err);
    return [];
  }
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
