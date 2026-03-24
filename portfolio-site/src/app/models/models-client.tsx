"use client";

import { useState, useMemo } from "react";
import { ModelCard } from "@/components/model-card";
import { AgeGate, useAgeVerification } from "@/components/age-gate";
import { Filter } from "lucide-react";
import { clsx } from "clsx";
import type { Model } from "@/lib/types";

const MODEL_TYPES = ["All", "Checkpoint", "LoRA", "Embedding", "ControlNet"] as const;
const BASE_MODELS = ["All", "SDXL", "SD 1.5", "Pony", "Flux"] as const;

interface ModelsClientProps {
  models: Model[];
}

export function ModelsClient({ models }: ModelsClientProps) {
  const { status: ageStatus } = useAgeVerification();
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [baseFilter, setBaseFilter] = useState<string>("All");
  const [showNsfw, setShowNsfw] = useState(false);

  const filteredModels = useMemo(
    () =>
      models.filter((m) => {
        if (typeFilter !== "All" && m.type !== typeFilter) return false;
        if (baseFilter !== "All" && m.baseModel !== baseFilter) return false;
        if (!showNsfw && m.nsfw) return false;
        return true;
      }),
    [models, typeFilter, baseFilter, showNsfw]
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-foreground">Models</h1>
        <p className="text-muted-foreground">
          Browse our collection of open-source AI art models — pulled live from
          Civitai and our curated catalog.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap items-center gap-4 rounded-lg border border-border bg-card p-4">
        <Filter size={16} className="text-muted-foreground" />

        {/* Type filter */}
        <div className="flex gap-1">
          {MODEL_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={clsx(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                typeFilter === type
                  ? "bg-accent text-white"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Base model filter */}
        <div className="flex gap-1">
          {BASE_MODELS.map((base) => (
            <button
              key={base}
              onClick={() => setBaseFilter(base)}
              className={clsx(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                baseFilter === base
                  ? "bg-accent text-white"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {base}
            </button>
          ))}
        </div>

        {/* NSFW toggle */}
        <label className="ml-auto flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            checked={showNsfw}
            onChange={(e) => setShowNsfw(e.target.checked)}
            className="rounded accent-accent"
          />
          Show NSFW
        </label>
      </div>

      {/* Model count */}
      <p className="mb-4 text-xs text-muted-foreground">
        Showing {filteredModels.length} model{filteredModels.length !== 1 && "s"}
      </p>

      {/* Age gate wraps NSFW content visibility */}
      {showNsfw && ageStatus !== "verified" ? (
        <AgeGate>
          <ModelGrid models={filteredModels} isVerified={false} />
        </AgeGate>
      ) : (
        <ModelGrid
          models={filteredModels}
          isVerified={ageStatus === "verified"}
        />
      )}

      {filteredModels.length === 0 && (
        <div className="flex min-h-[30vh] items-center justify-center">
          <p className="text-muted-foreground">
            No models match your filters. Try adjusting them.
          </p>
        </div>
      )}
    </div>
  );
}

function ModelGrid({
  models,
  isVerified,
}: {
  models: Model[];
  isVerified: boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {models.map((model) => (
        <ModelCard key={model.id} model={model} isVerified={isVerified} />
      ))}
    </div>
  );
}
