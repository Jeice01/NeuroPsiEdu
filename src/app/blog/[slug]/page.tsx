import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { blogPosts } from "@/data/blog";
import { notFound } from "next/navigation";
import { Calendar, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";

type BlogPostProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((candidate) => candidate.slug === slug);

  if (!post) {
    return { title: "Artigo não encontrado", robots: { index: false, follow: false } };
  }

  const url = absoluteUrl(`/blog/${post.slug}/`);
  const image = absoluteUrl(post.image);

  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.summary,
      url,
      siteName: SITE_NAME,
      locale: "pt_BR",
      type: "article",
      authors: [post.author],
      images: [{ url: image, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: [image],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col selection:bg-neuro-blue/20">
      <Navbar />
      
      <article className="flex-1 container mx-auto px-6 py-32 max-w-4xl">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-neuro-orange transition-colors mb-10">
          <ArrowLeft className="w-4 h-4" /> Voltar para o blog
        </Link>
        
        <header className="mb-16">
          <div className="flex items-center gap-6 text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
            <div className="flex items-center gap-2"><Calendar className="w-4 h-4" />{post.date}</div>
            <div className="flex items-center gap-2"><User className="w-4 h-4" />{post.author}</div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neuro-blue leading-[1.1] mb-12">
            {post.title}
          </h1>
          <div className="w-full aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl mb-16">
            <img
              src={post.image}
              srcSet={post.imageSrcSet}
              sizes="(max-width: 896px) 100vw, 896px"
              width={1440}
              height={960}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </header>

        <div className="prose prose-lg prose-slate max-w-none">
          {post.content.map((paragraph, idx) => (
            <p key={idx} className="mb-6 text-lg text-slate-600 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
      
      <Footer />
    </main>
  );
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}
