"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, Clock, ArrowUpRight } from "lucide-react";
import { useState } from "react";

const categories = ["All", "Infrastructure", "Cybersecurity", "Cloud", "AI & Data", "Digital Transformation", "Managed Services"];

const posts = [
  { id: 1, cat: "Infrastructure", color: "var(--green)", title: "How Modern Data Centers Are Redefining Enterprise Scalability", excerpt: "As businesses grow, the backbone of their IT infrastructure must evolve. We explore how hyper-converged systems and edge computing are reshaping architecture.", date: "Mar 28, 2026", read: "5 min", tag: "Deep Dive" },
  { id: 2, cat: "Cybersecurity", color: "var(--blue)", title: "Zero-Trust Architecture: Building Security from the Inside Out", excerpt: "Perimeter-based security is no longer enough. Learn why leading enterprises are adopting zero-trust and how FIDA implements it in real-world deployments.", date: "Mar 18, 2026", read: "7 min", tag: "Featured" },
  { id: 3, cat: "Digital Transformation", color: "var(--green)", title: "AI-Driven HR: How Smart Systems Are Transforming Workforce Management", excerpt: "From automated payroll to predictive retention analytics, AI is revolutionising HR. Discover how FIDA's HR platform puts this power in your hands.", date: "Mar 10, 2026", read: "6 min", tag: "Trending" },
  { id: 4, cat: "Cloud", color: "var(--blue)", title: "Hybrid Cloud Strategies That Actually Work for Mid-Sized Businesses", excerpt: "Not every company needs a full cloud migration. We break down the hybrid strategies that deliver the best ROI while keeping data sovereignty intact.", date: "Feb 28, 2026", read: "4 min", tag: "Practical Guide" },
  { id: 5, cat: "Infrastructure", color: "var(--grey-light)", title: "SD-WAN vs MPLS: Making the Right Choice for Your Enterprise Network", excerpt: "The network landscape has dramatically shifted. This comprehensive comparison helps IT leaders evaluate which WAN technology aligns with their goals.", date: "Feb 14, 2026", read: "8 min", tag: "Technical" },
  { id: 6, cat: "Managed Services", color: "var(--green)", title: "The ROI of Outsourcing IT: A Data-Driven Analysis", excerpt: "We analysed 200+ client case studies to quantify the true return on investment of managed IT services — the numbers will surprise you.", date: "Feb 5, 2026", read: "5 min", tag: "Case Study" },
  { id: 7, cat: "AI & Data", color: "var(--blue)", title: "Building an Enterprise Data Strategy in 2026: A Practical Roadmap", excerpt: "Data is the new infrastructure. Here is how leading enterprises are building scalable, secure, and AI-ready data foundations this year.", date: "Jan 25, 2026", read: "9 min", tag: "Roadmap" },
  { id: 8, cat: "Cybersecurity", color: "var(--blue)", title: "Anatomy of a Ransomware Attack: How FIDA Stopped a Major Breach", excerpt: "A step-by-step breakdown of how our SOC team detected, contained, and recovered from a sophisticated ransomware attack in under 4 hours.", date: "Jan 15, 2026", read: "11 min", tag: "Case Study" },
  { id: 9, cat: "Cloud", color: "var(--green)", title: "FinOps in Practice: Cutting Cloud Costs by 40% Without Losing Performance", excerpt: "Cloud bills spiralling out of control? Our FinOps team shares the exact strategies that saved one client over $1.2M annually.", date: "Jan 5, 2026", read: "6 min", tag: "FinOps" },
];

export default function BlogClient() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? posts : posts.filter((p) => p.cat === active);

  return (
    <section className="py-16 container mx-auto px-6">
      {/* Category filter */}
      <div className="flex flex-wrap gap-3 mb-14 justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className="px-5 py-2 rounded-full text-sm font-semibold transition-smooth"
            style={{
              background: active === cat ? "var(--green)" : "var(--bg-elevated)",
              color: active === cat ? "#fff" : "var(--text-secondary)",
              border: `1px solid ${active === cat ? "var(--green)" : "var(--grey-dark)"}`,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((post, i) => (
          <motion.div
            key={post.id}
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.5, ease: "easeOut" }}
          >
            <Link href={`/blog/${post.id}`} className="block group h-full">
              <div className="glass rounded-3xl p-8 h-full flex flex-col space-y-5 transition-smooth hover:-translate-y-2 card-hover-blue relative overflow-hidden">
                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: post.color }} />

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: `${post.color}15`, color: post.color }}>
                    {post.cat}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full" style={{ background: "var(--bg-elevated)", color: "var(--text-muted)" }}>{post.tag}</span>
                </div>

                <h3 className="text-base font-bold leading-snug flex-1 group-hover:transition-colors" style={{ color: "var(--text-primary)" }}>
                  {post.title}
                </h3>

                <p className="text-sm leading-relaxed line-clamp-3" style={{ color: "var(--text-secondary)" }}>
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: "var(--grey-dark)" }}>
                  <div className="flex items-center gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.read}</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" style={{ color: post.color }} />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
