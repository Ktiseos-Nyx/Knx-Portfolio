import type { Model } from "@/lib/types";
import { clsx } from "clsx";
import { ExternalLink, Lock } from "lucide-react";

interface ModelCardProps {
  model: Model;
  isVerified?: boolean;
}

export function ModelCard({ model, isVerified = false }: ModelCardProps) {
  const isBlurred = model.nsfw && !isVerified;

  return (
    <div className="group overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-accent/50">
      {/* Thumbnail area */}
      <div
        className={clsx(
          "relative flex h-48 items-center justify-center bg-muted",
          isBlurred && "select-none"
        )}
      >
        {isBlurred ? (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Lock size={24} />
            <span className="text-xs">Age verification required</span>
          </div>
        ) : model.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={model.thumbnailUrl}
            alt={model.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <span className="text-3xl">🎨</span>
            <span className="text-xs">No preview</span>
          </div>
        )}

        {/* Type badge */}
        {model.type && (
          <span className="absolute right-2 top-2 rounded-full bg-accent/90 px-2 py-0.5 text-xs font-medium text-white">
            {model.type}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="mb-1 text-sm font-semibold text-card-foreground line-clamp-1">
          {model.name}
        </h3>
        <p className="mb-3 text-xs text-muted-foreground line-clamp-2">
          {model.description}
        </p>

        {/* Tags */}
        <div className="mb-3 flex flex-wrap gap-1">
          {model.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            by {model.creator}
          </span>
          {model.sourceUrl && (
            <a
              href={model.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-accent-foreground transition-colors hover:text-accent"
            >
              View <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
