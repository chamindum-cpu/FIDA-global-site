"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownRight, Loader2 } from "lucide-react";

export default function ProjectsSection() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        // Filter only published projects
        setProjects(data.filter((p: any) => p.status === 'Published'));
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  if (loading) {
     return (
        <div className="py-20 flex flex-col items-center justify-center gap-4 text-[var(--text-muted)]">
           <Loader2 className="animate-spin" size={40} />
           <p className="text-sm font-medium tracking-widest uppercase">Opening Portfolio Doors...</p>
        </div>
     );
  }

  // Hide section if no published projects
  if (projects.length === 0) return null;

  return (
    <section className="py-32 relative" id="projects">
      <div className="container mx-auto px-6">
        {/* Header — Massive Headline + Counter */}
        <div className="flex items-baseline justify-between mb-20 border-b border-white/5 pb-10">
          <motion.h2
            initial={{ y: 80, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[8vw] leading-none font-bold tracking-tighter uppercase text-white"
          >
            Projects
          </motion.h2>

          <div className="flex items-start gap-8">
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="text-6xl md:text-8xl font-medium text-white/40"
            >
              {projects.length.toString().padStart(2, '0')}
            </motion.span>
            <motion.div
              animate={{ rotate: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="mt-4"
            >
              <ArrowDownRight className="w-16 h-16 md:w-20 md:h-20 text-white stroke-[1]" />
            </motion.div>
          </div>
        </div>

        {/* Grid — Large Portfolio Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.8, ease: "easeOut" }}
              className="group cursor-pointer"
            >
              {/* Image with rounded corners */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2.5rem] mb-8 bg-[#0f172a] shadow-2xl border border-[var(--grey-dark)]">
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover transition-smooth group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[var(--bg-elevated)] to-transparent flex items-center justify-center">
                     <span className="text-[var(--text-muted)] text-sm uppercase tracking-widest font-bold">FIDA Project</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
              </div>

              {/* Text Info */}
              <motion.div
                initial={{ opacity: 0.8 }}
                whileHover={{ x: 10, opacity: 1 }}
                className="space-y-1 mt-6"
              >
                <div className="overflow-hidden">
                  <motion.span
                    className="block text-[9px] font-bold uppercase tracking-[0.4em] text-primary/70"
                  >
                    {project.category_name} • {project.client_name}
                  </motion.span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                  {project.title}
                </h3>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
