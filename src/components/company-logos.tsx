"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["700"],
});

const DEFAULT_BRANDS = [
  "Apple", "Sony", "Porsche", "Google", "Nvidia", "Samsung", "Intel", "Microsoft",
  "MaxMara", "Calvin Klein", "Wallpaper*", "Coca-Cola", "Hyundai", "AKQA", 
  "Awwwards.", "The Webby Awards", "Adobe", "Meta", "Amazon", "SpaceX"
];

interface Customer {
  id: number;
  name: string;
  logo_url: string | null;
  status: string;
}

const TickerRow = ({
  items,
  speed = 20,
  direction = "left",
  fontClass,
}: {
  items: (string | Customer)[];
  speed?: number;
  direction?: "left" | "right";
  fontClass: string;
}) => {
  return (
    <div className="flex overflow-hidden py-4 select-none">
      <motion.div
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex gap-16 items-center whitespace-nowrap px-8"
      >
        {[...items, ...items, ...items, ...items].map((item, i) => {
          const isCustomer = typeof item !== "string";
          const name = isCustomer ? (item as Customer).name : (item as string);

          return (
            <div key={i} className="flex items-center justify-center">
              <span
                className={`${fontClass} text-3xl md:text-5xl font-bold tracking-tight uppercase grayscale opacity-30 hover:opacity-100 hover:grayscale-0 transition-all duration-500 cursor-default text-white`}
              >
                {name}
              </span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default function CompanyLogos() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await fetch("/api/customers");
        if (res.ok) {
          const data = await res.json();
          setCustomers(data.filter((c: Customer) => c.status === "Active"));
        }
      } catch (err) {
        console.error("Failed to fetch customers:", err);
      }
    }
    fetchCustomers();
  }, []);

  // Split customers or default brands into 3 rows for the ticker
  const displayItems = customers.length > 0 ? customers : DEFAULT_BRANDS;
  
  const row1 = displayItems.slice(0, Math.ceil(displayItems.length / 3));
  const row2 = displayItems.slice(Math.ceil(displayItems.length / 3), Math.ceil(displayItems.length * 2 / 3));
  const row3 = displayItems.slice(Math.ceil(displayItems.length * 2 / 3));

  // If there are too few items, duplicate them to ensure smooth ticker
  const r1 = row1.length > 0 ? row1 : DEFAULT_BRANDS.slice(0, 8);
  const r2 = row2.length > 0 ? row2 : DEFAULT_BRANDS.slice(8, 14);
  const r3 = row3.length > 0 ? row3 : DEFAULT_BRANDS.slice(14);

  return (
    <section className="py-32 relative overflow-hidden bg-black">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`${spaceGrotesk.className} space-y-4`}
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
            Global Partnership
          </span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white uppercase">
            Brands We Work With
          </h2>
        </motion.div>
      </div>

      <div className="mt-10 flex flex-col gap-8 opacity-40 hover:opacity-80 transition-opacity duration-1000">
        <TickerRow items={r1} speed={30} direction="left" fontClass={spaceGrotesk.className} />
        <TickerRow items={r2} speed={40} direction="right" fontClass={spaceGrotesk.className} />
        <TickerRow items={r3} speed={25} direction="left" fontClass={spaceGrotesk.className} />
      </div>
    </section>
  );
}