import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { Footer, FooterMobile } from "@/components/Footer";
import { Clock, ArrowRight } from "lucide-react";
import { BLOG_POSTS, formatDate } from "@/lib/blog";

export default function BlogPage() {
  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--bg)" }}>
      <Navbar />
      <main className="flex-1 pb-24 md:pb-8">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-black mb-2" style={{ color: "var(--text-primary)" }}>
            Blog
          </h1>
          <p className="text-base mb-8" style={{ color: "var(--text-secondary)" }}>
            Tips for buying and selling safely in Pakistan.
          </p>

          <div className="space-y-4">
            {BLOG_POSTS.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="card p-5 flex items-start justify-between gap-4 group block"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: "var(--brand-green-light)", color: "var(--brand-green)" }}
                    >
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                      <Clock size={11} />
                      {post.readTime}
                    </span>
                  </div>
                  <h2
                    className="text-base font-semibold leading-snug mb-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {post.title}
                  </h2>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    {post.description}
                  </p>
                  <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
                    {formatDate(post.date)}
                  </p>
                </div>
                <ArrowRight
                  size={18}
                  strokeWidth={2}
                  className="flex-shrink-0 mt-1"
                  style={{ color: "var(--brand-green)" }}
                />
              </Link>
            ))}
          </div>
        </div>
      </main>
      <BottomNav />
      <Footer />
      <FooterMobile />
    </div>
  );
}
