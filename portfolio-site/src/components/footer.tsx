import { SITE_NAME, ORG_INFO } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="text-sm font-semibold text-card-foreground">
              {SITE_NAME}
            </p>
            <p className="text-xs text-muted-foreground">
              Overseen by {ORG_INFO.parent}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Open source AI art models for the community.
          </p>
        </div>
      </div>
    </footer>
  );
}
