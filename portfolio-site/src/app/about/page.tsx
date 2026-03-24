import { SITE_NAME, ORG_INFO, CREATORS } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="mb-6 text-3xl font-bold text-foreground">
        About {SITE_NAME}
      </h1>

      {/* Org description */}
      <section className="mb-12">
        <div className="rounded-lg border border-border bg-card p-6 sm:p-8">
          <p className="mb-4 text-muted-foreground leading-relaxed">
            {ORG_INFO.description}
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted-foreground">
            <span>
              <strong className="text-card-foreground">Led by:</strong>{" "}
              {ORG_INFO.lead}
            </span>
            <span>
              <strong className="text-card-foreground">Overseen by:</strong>{" "}
              {ORG_INFO.parent}
            </span>
          </div>
        </div>
      </section>

      {/* Members */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold text-foreground">
          Members
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {CREATORS.map((creator) => (
            <div
              key={creator.name}
              className="rounded-lg border border-border bg-card p-6 text-center"
            >
              {/* Avatar placeholder */}
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20 text-2xl font-bold text-accent-foreground">
                {creator.displayName[0]}
              </div>
              <h3 className="mb-1 text-lg font-semibold text-card-foreground">
                {creator.displayName}
              </h3>
              {creator.role && (
                <p className="mb-2 text-xs text-accent-foreground">
                  {creator.role}
                </p>
              )}
              {creator.civitaiUsername && (
                <p className="text-xs text-muted-foreground">
                  Civitai: {creator.civitaiUsername}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Data sources note */}
      <section>
        <h2 className="mb-4 text-2xl font-semibold text-foreground">
          How It Works
        </h2>
        <div className="rounded-lg border border-border bg-card p-6 sm:p-8">
          <p className="mb-3 text-muted-foreground leading-relaxed">
            Models displayed on this site are pulled dynamically from our
            Civitai accounts. We also support manually added entries for models
            hosted elsewhere (HuggingFace, direct downloads, etc.).
          </p>
          <p className="text-sm text-muted-foreground">
            Some content may be marked as NSFW and requires age verification
            before viewing. We believe in responsible sharing — no age
            verification laws exist in NZ yet, but we want to be upfront about
            content maturity.
          </p>
        </div>
      </section>
    </div>
  );
}
