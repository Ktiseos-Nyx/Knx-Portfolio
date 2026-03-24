/** Represents a creator/member of Ktiseos Nyx */
export interface Creator {
  name: string;
  displayName: string;
  civitaiUsername?: string;
  role?: string;
}

/** Source where a model is hosted */
export type ModelSource = "civitai" | "huggingface" | "manual";

/** A single model/resource entry */
export interface Model {
  id: string;
  name: string;
  description: string;
  source: ModelSource;
  sourceUrl?: string;
  creator: string; // references Creator.name
  tags: string[];
  baseModel?: string; // e.g. "SDXL", "SD 1.5", "Pony", "Flux"
  type?: string; // Civitai types: "Checkpoint", "TextualInversion", "LORA", "Controlnet", etc.
  nsfw: boolean;
  thumbnailUrl?: string;
  createdAt?: string;
  stats?: {
    downloadCount: number;
    favoriteCount: number;
    rating: number;
    ratingCount: number;
  };
}

/** Age verification state */
export type AgeVerificationStatus = "unverified" | "verified" | "denied";
