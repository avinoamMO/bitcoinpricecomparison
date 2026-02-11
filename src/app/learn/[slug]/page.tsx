import { notFound } from "next/navigation";
import { articles, getArticleBySlug } from "@/data/articles";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar } from "lucide-react";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export default function ArticlePage({ params }: Props) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();

  const renderContent = (content: string) => {
    return content.split("\n\n").map((block, i) => {
      const trimmed = block.trim();
      if (trimmed.startsWith("## ")) return <h2 key={i} className="text-xl font-bold text-foreground mt-8 mb-4">{trimmed.replace("## ", "")}</h2>;
      if (trimmed.startsWith("### ")) return <h3 key={i} className="text-lg font-semibold text-foreground mt-6 mb-3">{trimmed.replace("### ", "")}</h3>;
      if (trimmed.startsWith("- ")) {
        const items = trimmed.split("\n").filter((l) => l.startsWith("- "));
        return <ul key={i} className="list-disc pl-6 space-y-2 mb-4">{items.map((item, j) => <li key={j} className="text-muted-foreground">{item.replace("- ", "")}</li>)}</ul>;
      }
      if (trimmed.length === 0) return null;
      return <p key={i} className="text-muted-foreground leading-relaxed mb-4">{trimmed}</p>;
    });
  };

  return (
    <article className="max-w-3xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Compare
      </Link>
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{article.title}</h1>
        <p className="text-lg text-muted-foreground mb-4">{article.description}</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Date(article.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{article.readTime} min read</span>
        </div>
      </header>
      <div className="prose">{renderContent(article.content)}</div>
      <div className="mt-12 p-6 rounded-xl border border-gold/20 bg-gold/5 text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">Ready to find the best deal?</h3>
        <p className="text-muted-foreground mb-4">Use CryptoROI to compare real-time costs across 7 exchanges.</p>
        <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-black rounded-xl font-semibold hover:bg-gold-light transition-colors">Compare Exchanges Now</Link>
      </div>
      <div className="mt-12">
        <h3 className="text-lg font-semibold text-foreground mb-4">More Articles</h3>
        <div className="grid gap-4">
          {articles.filter((a) => a.slug !== article.slug).map((a) => (
            <Link key={a.slug} href={`/learn/${a.slug}`} className="rounded-xl border border-border bg-card p-4 hover:border-gold/30 transition-colors block">
              <h4 className="font-semibold text-foreground">{a.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">{a.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
