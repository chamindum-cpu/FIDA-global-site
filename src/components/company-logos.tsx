"use client";

import { motion } from "framer-motion";

const row1 = ["Apple", "Sony", "Porsche", "Google", "Nvidia", "Samsung", "Intel", "Microsoft"];
const row2 = ["Porsche", "MaxMara", "Calvin Klein", "Wallpaper*", "Coca-Cola", "Hyundai", "Sony", "Google"];
const row3 = ["Nvidia", "AKQA", "Awwwards.", "The Webby Awards", "Adobe", "Meta", "Amazon", "SpaceX"];

const TickerRow = ({ items, speed = 20, direction = "left" }: { items: string[], speed?: number, direction?: "left" | "right" }) => {
  return (
    <div className="flex overflow-hidden py-4 select-none">
      <motion.div 
        animate={{ 
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] 
        }}
        transition={{ 
          duration: speed, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="flex gap-16 whitespace-nowrap px-8"
      >
        {/* Double the items to make the loop seamless */}
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <span 
            key={i} 
            className="text-3xl md:text-5xl font-black tracking-tighter uppercase grayscale opacity-30 hover:opacity-100 hover:grayscale-0 transition-all duration-500 cursor-default text-white"
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default function CompanyLogos() {
  return (
    <section className="py-32 relative overflow-hidden bg-black">
      {/* Background glow trace */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 mb-16 relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="space-y-4"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Global Partnership</span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white uppercase">
            Brands We Work With
          </h2>
        </motion.div>
      </div>

      <div className="mt-10 flex flex-col gap-8 opacity-40 hover:opacity-80 transition-opacity duration-1000">
        <TickerRow items={row1} speed={30} direction="left" />
        <TickerRow items={row2} speed={40} direction="right" />
        <TickerRow items={row3} speed={25} direction="left" />
      </div>
    </section>
  );
}
