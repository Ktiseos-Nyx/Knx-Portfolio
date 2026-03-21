import { getAllModels } from "@/lib/models";
import { ModelsClient } from "./models-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Models",
  description: "Browse our collection of open-source AI art models.",
};

export default async function ModelsPage() {
  const models = await getAllModels();

  return <ModelsClient models={models} />;
}
