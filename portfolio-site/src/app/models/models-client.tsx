"use client";

import { useState, useMemo } from "react";
import { ModelCard } from "@/components/model-card";
import { AgeGate, useAgeVerification } from "@/components/age-gate";
import { Filter, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { clsx } from "clsx";
import type { Model } from "@/lib/types";

const MODELS_PER_PAGE = 24;

const MODEL_TYPES = ["All", "Checkpoint", "LoRA", "Embedding", "ControlNet"] as const;
const BASE_MODELS = ["All", "SDXL", "SD 1.5", "Pony", "Flux"] as const;

interface ModelsClientProps {
  models: Model[];
}

export function ModelsClient({ models }: ModelsClientProps) {
  const { status: ageStatus } = useAgeVerification();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [baseFilter, setBaseFilter] = useState<string>("All");
  const [showNsfw, setShowNsfw] = useState(false);
  const [page, setPage] = useState(1);

  const filteredModels = useMemo(() => {
    const q = search.toLowerCase().trim();
    return models.filter((m) => {
      if (typeFilter !== "All" && m.type !== typeFilter) return false;
      if (baseFilter !== "All" && m.baseModel !== baseFilter) return false;
      if (!showNsfw && m.nsfw) return false;
      if (q && !m.name.toLowerCase().includes(q) && !m.tags.some((t) => t.toLowerCase().includes(q)) && !m.creator.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [models, search, typeFilter, baseFilter, showNsfw]);

  // Reset to page 1 when filters change
  const totalPages = Math.max(1, Math.ceil(filteredModels.length / MODELS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginatedModels = filteredModels.slice(
    (currentPage - 1) * MODELS_PER_PAGE,
    currentPage * MODELS_PER_PAGE
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

      {/* Search + Filters */}
      <div className="mb-8 flex flex-wrap items-center gap-4 rounded-lg border border-border bg-card p-4">
        {/* Search */}
        <div className="relative w-full sm:w-auto">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search models..."
            className="w-full rounded-md border border-border bg-background py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none sm:w-56"
          />
        </div>

        <Filter size={16} className="text-muted-foreground" />

        {/* Type filter */}
        <div className="flex gap-1">
          {MODEL_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => { setTypeFilter(type); setPage(1); }}
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
              onClick={() => { setBaseFilter(base); setPage(1); }}
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
            onChange={(e) => { setShowNsfw(e.target.checked); setPage(1); }}
            className="rounded accent-accent"
          />
          Show NSFW
        </label>
      </div>

      {/* Model count */}
      <p className="mb-4 text-xs text-muted-foreground">
        Showing {(currentPage - 1) * MODELS_PER_PAGE + 1}–
        {Math.min(currentPage * MODELS_PER_PAGE, filteredModels.length)} of{" "}
        {filteredModels.length} model{filteredModels.length !== 1 && "s"}
      </p>

      {/* Age gate wraps NSFW content visibility */}
      {showNsfw && ageStatus !== "verified" ? (
        <AgeGate>
          <ModelGrid models={paginatedModels} isVerified={false} />
        </AgeGate>
      ) : (
        <ModelGrid
          models={paginatedModels}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-card-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeft size={14} /> Prev
          </button>

          {getPageNumbers(currentPage, totalPages).map((p, i) =>
            p === "..." ? (
              <span key={`dots-${i}`} className="px-1 text-xs text-muted-foreground">
                ...
              </span>
            ) : (
              <button
                key={p}
                onClick={() => setPage(p as number)}
                className={clsx(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  currentPage === p
                    ? "bg-accent text-white"
                    : "border border-border bg-card text-card-foreground hover:bg-muted"
                )}
              >
                {p}
              </button>
            )
          )}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-card-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
          >
            Next <ChevronRight size={14} />
          </button>
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

/** Build a compact page-number list like [1, 2, "...", 8, 9, 10] */
function getPageNumbers(
  current: number,
  total: number
): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [];
  const near = new Set([1, 2, current - 1, current, current + 1, total - 1, total]);

  for (let i = 1; i <= total; i++) {
    if (near.has(i)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return pages;
}
