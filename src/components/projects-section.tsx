"use client";

import { motion } from "framer-motion";
import { ArrowDownRight } from "lucide-react";
import Image from "next/image";

const projects = [
  {
    id: "01",
    name: "Aether AI Dashboard",
    tags: "WEB • DESIGN • DEVELOPMENT • 3D",
    image: "/project_ai_dashboard_1775280882001.png",
  },
  {
    id: "02",
    name: "Nova Infrastructure",
    tags: "CONCEPT • 3D ILLUSTRATION • MOGRAPH • VIDEO",
    image: "/project_smart_infra_1775280901972.png",
  },
];

export default function ProjectsSection() {
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
              15
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
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2.5rem] mb-8 bg-[#0f172a] shadow-2xl">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  className="object-cover transition-smooth group-hover:scale-105"
                />
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
                    {project.tags}
                  </motion.span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                  {project.name}
                </h3>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
