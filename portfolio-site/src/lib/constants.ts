import type { Creator, Model } from "./types";

export const SITE_NAME = "Ktiseos Nyx";
export const SITE_TAGLINE = "Open Source AI Art Models";
export const SITE_DESCRIPTION =
  "Portfolio of open-source Stable Diffusion models by Ktiseos Nyx — a creative collective of Duskfallcrew, Earthnicity, and OtnAngel.";

export const ORG_INFO = {
  name: "Ktiseos Nyx",
  parent: "Earth&Dusk Media",
  lead: "0FTh3N1GHT",
  description:
    "Ktiseos Nyx is a creative collective focused on building and sharing open-source AI art models. Spearheaded by 0FTh3N1GHT and overseen by Earth&Dusk Media, we create checkpoints, LoRAs, and other resources for the Stable Diffusion ecosystem.",
};

export const CREATORS: Creator[] = [
  {
    name: "duskfallcrew",
    displayName: "Duskfallcrew",
    civitaiUsername: "ktiseos_nyx",
    role: "Core Member",
  },
  {
    name: "earthnicity",
    displayName: "Earthnicity",
    civitaiUsername: "ktiseos_t3rra",
    role: "Core Member",
  },
  {
    name: "otnangel",
    displayName: "OtnAngel",
    civitaiUsername: "OtnAngel",
    role: "Core Member",
  },
];

/** Sample/placeholder models for skeleton UI */
export const SAMPLE_MODELS: Model[] = [
  {
    id: "sample-1",
    name: "Example SDXL Checkpoint",
    description: "A sample checkpoint model for demonstration purposes.",
    source: "civitai",
    creator: "duskfallcrew",
    tags: ["SDXL", "Anime", "Checkpoint"],
    baseModel: "SDXL",
    type: "Checkpoint",
    nsfw: false,
  },
  {
    id: "sample-2",
    name: "Example Pony LoRA",
    description: "A sample LoRA model for demonstration purposes.",
    source: "civitai",
    creator: "earthnicity",
    tags: ["Pony", "Style", "LoRA"],
    baseModel: "Pony",
    type: "LoRA",
    nsfw: false,
  },
  {
    id: "sample-3",
    name: "Example NSFW Model",
    description: "A sample NSFW model — requires age verification.",
    source: "civitai",
    creator: "otnangel",
    tags: ["SDXL", "NSFW"],
    baseModel: "SDXL",
    type: "Checkpoint",
    nsfw: true,
  },
  {
    id: "sample-4",
    name: "Example Flux LoRA",
    description: "A sample Flux-based LoRA for demonstration.",
    source: "manual",
    creator: "duskfallcrew",
    tags: ["Flux", "LoRA", "Style"],
    baseModel: "Flux",
    type: "LoRA",
    nsfw: false,
  },
];

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Models", href: "/models" },
  { label: "Articles", href: "/articles" },
  { label: "About", href: "/about" },
] as const;
