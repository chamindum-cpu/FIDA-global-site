"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Server, Shield, Cloud, Terminal, Cpu, Users, Zap, 
  Database, Code, Award, Loader2, Search, Building2, Layout, Briefcase, Globe
} from "lucide-react";

// Helper to map icon names from DB to components
const IconMap: { [key: string]: any } = {
  Server, Shield, Cloud, Terminal, Cpu, Users, Zap, Database, Code, Award,
  Building2, Layout, Briefcase, Globe
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

export default function ExpertiseSection() {
  const [expertise, setExpertise] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExpertise() {
      try {
        const res = await fetch("/api/expertise");
        const data = await res.json();
        // Filter published and map colors/numbers
        const published = data.filter((ex: any) => ex.status === 'Published').map((ex: any, idx: number) => ({
          ...ex,
          number: (idx + 1).toString().padStart(2, '0'),
          // Generate a varied but harmonious color set
          color: idx % 2 === 0 ? "from-blue-500/20 to-blue-500/5" : "from-primary/20 to-primary/5",
          border: idx % 2 === 0 ? "hover:border-blue-500/40" : "hover:border-primary/40",
        }));
        setExpertise(published);
      } catch (err) {
        console.error("Error fetching expertise:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchExpertise();
  }, []);

  if (loading) {
    return (
       <div className="py-20 flex flex-col items-center justify-center gap-4 text-[var(--text-muted)]">
          <Loader2 className="animate-spin" size={40} />
          <p className="text-sm font-medium tracking-widest uppercase">Initializing Core Capabilities...</p>
       </div>
    );
  }

  // If no expertise yet, don't show the section or show a minimal version
  if (expertise.length === 0) return null;

  return (
    <section className="py-32 relative" id="solutions">
      <div className="container mx-auto px-6">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center space-y-6 mb-24 max-w-3xl mx-auto"
        >
          <div className="text-sm font-bold text-primary uppercase tracking-widest bg-primary/10 px-4 py-2 rounded-full inline-flex">
            Our Expertise
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold tracking-tight text-secondary dark:text-white leading-[1.1]">
            Tailored Excellence for{" "}
            <span className="text-primary italic">Every</span>
            <br />
            Business Need
          </h2>
          <p className="text-xl text-muted leading-relaxed">
            From smart HR systems to global infrastructure, we deliver innovation
            that works as hard as you do.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {expertise.map((card) => {
            const Icon = IconMap[card.icon] || Server;
            return (
              <motion.div
                key={card.number}
                variants={cardVariants}
                whileHover={{ y: -8 }}
                className={`group relative overflow-hidden rounded-[2.5rem] glass border border-border ${card.border} p-10 flex flex-col space-y-6 cursor-pointer transition-smooth`}
              >
                {/* Gradient bg */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Number */}
                <div className="relative z-10 text-7xl font-black text-border/60 group-hover:text-border transition-colors leading-none select-none">
                  {card.number}
                </div>

                {/* Icon */}
                <div className="relative z-10 w-14 h-14 rounded-2xl bg-secondary/5 dark:bg-white/5 border border-border group-hover:border-primary/30 flex items-center justify-center transition-colors">
                  <Icon className="w-7 h-7 text-primary" />
                </div>

                <div className="relative z-10 space-y-3 flex-1">
                  <h3 className="text-2xl font-bold text-secondary dark:text-white">
                    {card.title}
                  </h3>
                  <p className="text-muted leading-relaxed">{card.description}</p>
                </div>

                <div className="relative z-10 pt-4 flex items-center gap-2 text-primary font-bold text-sm tracking-widest uppercase">
                  Explore
                  <motion.span
                    className="inline-block"
                    animate={{ x: 0 }}
                    whileHover={{ x: 4 }}
                  >
                    →
                  </motion.span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
