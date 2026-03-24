import Link from "next/link";
import { ArrowRight, Sparkles, Users, Package } from "lucide-react";
import { SITE_NAME, ORG_INFO, CREATORS } from "@/lib/constants";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      {/* Hero */}
      <section className="flex flex-col items-center py-20 text-center sm:py-32">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          {SITE_NAME}
        </h1>
        <p className="mb-2 text-lg text-accent-foreground font-medium">
          Open Source AI Art Models
        </p>
        <p className="mb-8 max-w-xl text-muted-foreground">
          {ORG_INFO.description}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/models"
            className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent/80"
          >
            Browse Models <ArrowRight size={16} />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            About Us
          </Link>
        </div>
      </section>

      {/* Stats / highlights */}
      <section className="grid grid-cols-1 gap-6 pb-16 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-6 text-center">
          <Sparkles className="mx-auto mb-3 text-accent-foreground" size={28} />
          <h3 className="mb-1 text-lg font-semibold text-card-foreground">
            Models
          </h3>
          <p className="text-sm text-muted-foreground">
            Checkpoints, LoRAs, embeddings and more for Stable Diffusion, Pony,
            SDXL, and Flux.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6 text-center">
          <Users className="mx-auto mb-3 text-accent-foreground" size={28} />
          <h3 className="mb-1 text-lg font-semibold text-card-foreground">
            Collective
          </h3>
          <p className="text-sm text-muted-foreground">
            Built by {CREATORS.map((c) => c.displayName).join(", ")} — united
            under {SITE_NAME}.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6 text-center">
          <Package className="mx-auto mb-3 text-accent-foreground" size={28} />
          <h3 className="mb-1 text-lg font-semibold text-card-foreground">
            Open Source
          </h3>
          <p className="text-sm text-muted-foreground">
            All models freely available. Community-driven, community-shared.
          </p>
        </div>
      </section>
    </div>
  );
}
