"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Calendar, Clock } from "lucide-react";

const posts = [
  {
    id: 1,
    category: "Infrastructure",
    title: "How Modern Data Centers Are Redefining Enterprise Scalability",
    excerpt:
      "As businesses grow, the backbone of their IT infrastructure must evolve. We explore how hyper-converged systems and edge computing are reshaping data center architecture.",
    date: "Mar 28, 2026",
    readTime: "5 min read",
    tag: "Deep Dive",
    gradient: "from-primary/20 to-transparent",
  },
  {
    id: 2,
    category: "Cybersecurity",
    title: "Zero-Trust Architecture: Building Security from the Inside Out",
    excerpt:
      "Perimeter-based security is no longer enough. Learn why leading enterprises are adopting zero-trust principles and how FIDA implements them in real-world deployments.",
    date: "Mar 18, 2026",
    readTime: "7 min read",
    tag: "Featured",
    gradient: "from-blue-500/20 to-transparent",
  },
  {
    id: 3,
    category: "Digital Transformation",
    title: "AI-Driven HR: How Smart Systems Are Transforming Workforce Management",
    excerpt:
      "From automated payroll to predictive retention analytics, AI is revolutionizing human resources. Discover how FIDA's HR platform puts this power in your hands.",
    date: "Mar 10, 2026",
    readTime: "6 min read",
    tag: "Trending",
    gradient: "from-purple-500/20 to-transparent",
  },
  {
    id: 4,
    category: "Cloud Solutions",
    title: "Hybrid Cloud Strategies That Actually Work for Mid-Sized Businesses",
    excerpt:
      "Not every company needs a full cloud migration. We break down the hybrid strategies that deliver the best ROI while keeping data sovereignty intact.",
    date: "Feb 28, 2026",
    readTime: "4 min read",
    tag: "Practical Guide",
    gradient: "from-orange-500/20 to-transparent",
  },
  {
    id: 5,
    category: "Networking",
    title: "SD-WAN vs MPLS: Making the Right Choice for Your Enterprise Network",
    excerpt:
      "The network landscape has dramatically shifted. This comprehensive comparison helps IT leaders evaluate which WAN technology aligns with their operational goals.",
    date: "Feb 14, 2026",
    readTime: "8 min read",
    tag: "Technical",
    gradient: "from-cyan-500/20 to-transparent",
  },
  {
    id: 6,
    category: "Managed Services",
    title: "The ROI of Outsourcing IT: A Data-Driven Analysis",
    excerpt:
      "We analyzed 200+ client case studies to quantify the true return on investment of managed IT services — the numbers will surprise you.",
    date: "Feb 5, 2026",
    readTime: "5 min read",
    tag: "Case Study",
    gradient: "from-green-500/20 to-transparent",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function BlogSection() {
  return (
    <section className="py-32 relative" id="blog">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20"
        >
          <div className="space-y-4">
            <div className="text-sm font-bold text-primary uppercase tracking-widest bg-primary/10 px-4 py-2 rounded-full inline-flex">
              Insights & Expertise
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold tracking-tight text-secondary dark:text-white leading-[1.1]">
              From Our{" "}
              <span className="text-primary italic">Knowledge</span>
              <br />
              Base
            </h2>
          </div>
          <Link
            href="/blog"
            className="group inline-flex items-center gap-3 glass border px-6 py-3 rounded-full font-semibold text-sm text-secondary dark:text-white hover:border-primary/40 transition-smooth"
          >
            View All Articles
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </motion.div>

        {/* Featured post (large) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <Link href={`/blog/${posts[0].id}`} className="block group">
            <div className="relative overflow-hidden rounded-[2.5rem] glass border border-transparent hover:border-primary/30 p-12 lg:p-16 transition-smooth hover:shadow-2xl">
              <div
                className={`absolute inset-0 bg-gradient-to-br ${posts[0].gradient} opacity-60 group-hover:opacity-100 transition-opacity`}
              />
              <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                      {posts[0].category}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-white bg-primary px-3 py-1 rounded-full">
                      {posts[0].tag}
                    </span>
                  </div>
                  <h3 className="text-2xl lg:text-4xl font-bold text-secondary dark:text-white leading-tight group-hover:text-primary transition-colors">
                    {posts[0].title}
                  </h3>
                  <p className="text-muted leading-relaxed text-lg">
                    {posts[0].excerpt}
                  </p>
                  <div className="flex items-center gap-5 text-sm text-muted">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" /> {posts[0].date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" /> {posts[0].readTime}
                    </span>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="w-24 h-24 rounded-full border-4 border-primary/30 flex items-center justify-center group-hover:border-primary group-hover:scale-110 transition-smooth">
                    <ArrowUpRight className="w-10 h-10 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Grid of posts */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {posts.slice(1).map((post) => (
            <motion.div key={post.id} variants={cardVariants}>
              <Link href={`/blog/${post.id}`} className="block group h-full">
                <div className="relative overflow-hidden rounded-[2rem] glass border border-transparent hover:border-primary/20 p-8 h-full flex flex-col space-y-5 transition-smooth hover:shadow-xl hover:-translate-y-1">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${post.gradient} opacity-40 group-hover:opacity-70 transition-opacity`}
                  />
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xs font-medium text-muted/70 bg-white/5 px-2 py-1 rounded-full border border-border">
                      {post.tag}
                    </span>
                  </div>
                  <h3 className="relative z-10 text-lg font-bold text-secondary dark:text-white leading-snug group-hover:text-primary transition-colors flex-1">
                    {post.title}
                  </h3>
                  <p className="relative z-10 text-muted text-sm leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="relative z-10 flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-4 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {post.readTime}
                      </span>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
