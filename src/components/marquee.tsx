"use client";

import { useRef } from "react";

const items = [
  "IT Consultancy", "Cloud Solutions", "Cybersecurity", "HR Automation",
  "Infrastructure", "Managed Services", "Digital Transformation", "AI Integration",
  "Networking", "Data Analytics", "DevOps", "ERP Systems",
];

export default function MarqueeTicker() {
  return (
    <div className="relative overflow-hidden py-6 border-y border-white/5 bg-zinc-950">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />

      <div className="flex gap-0 marquee-track">
        {[...items, ...items].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-6 px-8 whitespace-nowrap text-sm font-semibold uppercase tracking-widest text-muted hover:text-primary transition-colors flex-shrink-0"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
