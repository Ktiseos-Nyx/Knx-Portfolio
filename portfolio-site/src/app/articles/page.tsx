import Link from "next/link";
import { getAllArticles } from "@/lib/articles";
import { Calendar, Clock, Tag } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles",
  description: "Posts, tutorials, and updates from the Ktiseos Nyx collective.",
};

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-foreground">Articles</h1>
        <p className="text-muted-foreground">
          Posts, tutorials, and updates from the collective.
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <p className="text-muted-foreground">No articles yet. Check back soon!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="block rounded-lg border border-border bg-card p-6 transition-colors hover:border-accent/50"
            >
              <h2 className="mb-2 text-xl font-semibold text-card-foreground">
                {article.title}
              </h2>
              <p className="mb-4 text-sm text-muted-foreground">
                {article.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(article.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock size={12} />
                  {article.readingTime}
                </span>
                <span className="text-xs text-muted-foreground">
                  by {article.author}
                </span>
              </div>
              {article.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                    >
                      <Tag size={8} />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
