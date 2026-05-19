import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { blogPosts } from "@/data/blog";
import { Calendar, User, ArrowRight } from "lucide-react";

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col selection:bg-neuro-blue/20">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-6 py-32 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-6xl font-bold text-neuro-blue mb-6 leading-tight">
            Nosso <span className="text-[#42b6a5]">Blog</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Acompanhe nossos artigos, novidades e informações importantes sobre Neuropsicologia e Saúde Mental.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogPosts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.slug} className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.02)] hover:shadow-[0_25px_60px_-15px_rgba(28,69,104,0.1)] transition-all duration-500 hover:-translate-y-2">
              <div className="relative h-60 w-full overflow-hidden bg-slate-50">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                  <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{post.date}</div>
                </div>
                <h3 className="text-xl font-bold text-neuro-blue mb-4 leading-tight group-hover:text-[#42b6a5] transition-colors line-clamp-3">
                  {post.title}
                </h3>
                <p className="text-sm text-slate-500 mb-8 leading-relaxed line-clamp-3">
                  {post.summary}
                </p>
                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <User className="w-4 h-4" />
                    {post.author}
                  </div>
                  <span className="text-neuro-orange group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
