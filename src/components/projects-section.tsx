"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Loader2 } from "lucide-react";

export default function ProjectsSection() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // This ref must be attached to a stable element that doesn't disappear
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(data.filter((p: any) => p.status === 'Published'));
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  // useScroll hook
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (loading || projects.length === 0) return;

    const unsub = scrollYProgress.on("change", (latest) => {
      const index = Math.min(Math.floor(latest * projects.length), projects.length - 1);
      setActiveIndex(Math.max(0, index));
    });
    return () => unsub();
  }, [scrollYProgress, projects.length, loading]);

  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(projects.length - 1) * 60}vw`]);

  return (
    // FIX: The ref is now on this outer wrapper which exists during loading AND after.
    <section ref={containerRef} className="relative h-[600vh] bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {loading ? (
          <div className="h-full w-full flex flex-col items-center justify-center gap-4 text-white">
            <Loader2 className="animate-spin text-primary" size={40} />
            <p className="text-sm font-medium tracking-widest uppercase opacity-50">Hydrating Gallery...</p>
          </div>
        ) : (
          <>
            {/* Background Layer */}
            <AnimatePresence mode="wait">
              <motion.div
                key={projects[activeIndex]?.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 z-0 bg-cover bg-center grayscale"
                style={{ backgroundImage: `url(${projects[activeIndex]?.image_url})` }}
              />
            </AnimatePresence>

            <div className="relative z-10 w-full h-full flex flex-col justify-center py-10">
              <div className="container mx-auto px-10 mb-8 shrink-0">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Work Archive</span>
                <h2 className="text-[6.5vw] font-bold text-white uppercase leading-[0.9] tracking-tighter">
                  Selected<br />Projects
                </h2>
              </div>

              {/* Horizontal Track */}
              <motion.div
                style={{ x }}
                className="flex gap-[8vw] pl-[25vw] pr-[50vw] perspective-2000 items-center"
              >
                {projects.map((project, i) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={i}
                    total={projects.length}
                    scrollYProgress={scrollYProgress}
                  />
                ))}
              </motion.div>
            </div>

            {/* HUD Progress */}
            <div className="absolute bottom-10 left-10 flex items-center gap-6">
              <div className="h-[1px] w-40 bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  style={{ width: `${((activeIndex + 1) / projects.length) * 100}%` }}
                />
              </div>
              <span className="text-white font-mono text-xs tracking-tighter">
                {String(activeIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
              </span>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project, index, total, scrollYProgress }: any) {
  const start = index / total;
  const end = (index + 1) / total;
  const focus = (start + end) / 2;

  // Subtle Warp Range
  const range = [Math.max(0, focus - 0.25), focus, Math.min(1, focus + 0.25)];

  // Subtle tilting instead of flipping
  const rotateY = useTransform(scrollYProgress, range, [-45, 0, 45]);
  const scale = useTransform(scrollYProgress, range, [0.85, 1.1, 0.85]);
  const opacity = useTransform(scrollYProgress, [Math.max(0, focus - 0.35), focus, Math.min(1, focus + 0.35)], [0.3, 1, 0.3]);

  return (
    <motion.div
      onClick={() => window.open(`/projects#${project.id}`, '_self')}
      style={{ scale, opacity, perspective: "1000px" }}
      className="shrink-0 w-[50vw] md:w-[22vw] aspect-[3/4] relative cursor-pointer"
    >
      <motion.div
        style={{ rotateY, transformStyle: "preserve-3d" }}
        className="w-full h-full relative rounded-[2rem] overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl group"
      >
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover transition-smooth group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/20 font-black">FIDA PROJECT</div>
        )}

        {/* Immersive Front-Facing Content */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-8 flex flex-col justify-end">
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">{project.category_name}</span>
            <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter leading-none">{project.title}</h3>
            <p className="text-xs text-white/60 line-clamp-3 leading-relaxed">{project.description}</p>

            <div className="pt-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                <ArrowUpRight size={20} className="text-white" />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">Project Insight</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}