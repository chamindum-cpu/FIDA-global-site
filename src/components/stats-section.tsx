"use client";

import { motion } from "framer-motion";
import { AnimatedCounter } from "./animated-counter";

const stats = [
  { value: 360, suffix: "+", prefix: "", label: "Total Projects", desc: "Successfully delivered" },
  { value: 13, suffix: "+", prefix: "", label: "Years Exp.", desc: "Innovation & R&D" },
  { value: 28862, suffix: "+", prefix: "", label: "Cloud Users", desc: "On FIDA HR Platform" },
  { value: 45, suffix: "+", prefix: "", label: "Happy Clients", desc: "Global Enterprises" },
];

export default function StatsSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background line */}
      <div className="absolute inset-0 border-y border-border/50" />

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-y lg:divide-y-0 divide-border/50">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="p-10 text-center space-y-2 group"
            >
              <div className="text-5xl lg:text-6xl font-bold text-primary tracking-tight group-hover:scale-105 transition-transform">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
              </div>
              <div className="text-base font-semibold text-secondary dark:text-white">
                {stat.label}
              </div>
              <div className="text-sm text-muted">{stat.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
