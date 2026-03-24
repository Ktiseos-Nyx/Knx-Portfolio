import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

export interface ArticleFrontmatter {
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  published: boolean;
}

export interface ArticleMeta extends ArticleFrontmatter {
  slug: string;
  readingTime: string;
}

export interface Article extends ArticleMeta {
  content: string;
}

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

/** Get all published article metadata, sorted by date (newest first) */
export function getAllArticles(): ArticleMeta[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];

  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".mdx"));

  const articles = files
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const filePath = path.join(ARTICLES_DIR, filename);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);
      const frontmatter = data as ArticleFrontmatter;

      if (!frontmatter.published) return null;

      return {
        ...frontmatter,
        slug,
        readingTime: readingTime(content).text,
      } as ArticleMeta;
    })
    .filter(Boolean) as ArticleMeta[];

  return articles.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/** Get a single article by slug */
export function getArticleBySlug(slug: string): Article | null {
  const filePath = path.join(ARTICLES_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const frontmatter = data as ArticleFrontmatter;

  if (!frontmatter.published) return null;

  return {
    ...frontmatter,
    slug,
    content,
    readingTime: readingTime(content).text,
  };
}

/** Get all slugs (for static generation) */
export function getArticleSlugs(): string[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];

  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}
