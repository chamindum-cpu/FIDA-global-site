"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Loader2 } from "lucide-react";
import SpaceBackground from "./space-background";

export default function ProductsSection() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data.filter((p: any) => p.status === "Active"));
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="min-h-[60vh] bg-[#050507] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={28} />
      </section>
    );
  }

  return (
    <section className="py-24 bg-[#020617] relative overflow-hidden">
      <SpaceBackground />
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-blue-500 text-xs font-bold uppercase tracking-[0.4em] mb-4 flex items-center gap-2"
            >
              <div className="w-8 h-[1px] bg-blue-500" />
              Ecosystem Suite
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
              Our <span className="text-zinc-600 italic">Solutions</span>
            </h2>
          </div>
          <p className="text-zinc-500 text-sm max-w-xs font-medium border-l border-white/10 pl-6 hidden lg:block">
            Standardized platforms designed for rapid deployment and maximum enterprise impact.
          </p>
        </div>
      </div>

      {/* Horizontal List */}
      <div className="relative group">
        <div className="flex gap-8 overflow-x-auto pb-20 pt-10 px-[10vw] no-scrollbar snap-x snap-mandatory scroll-smooth">
          {products.map((product, index) => (
            <div key={product.id} className="snap-center">
              <ProductCard product={product} index={index} />
            </div>
          ))}

          {/* View All Card - The "End" of the list */}
          <Link 
            href="/solutions"
            className="snap-center shrink-0 w-[75vw] md:w-[30vw] aspect-[4/3] rounded-[2.5rem] border border-white/5 bg-white/[0.02] flex flex-col items-center justify-center gap-6 group/all transition-all hover:bg-white/5 hover:border-primary/20"
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover/all:scale-110 group-hover/all:bg-primary group-hover/all:text-white transition-all duration-500 shadow-2xl shadow-primary/20">
               <ArrowUpRight size={36} />
            </div>
            <div className="text-center">
               <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Explore Suite</h3>
               <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest mt-2">View Full Portfolio</p>
            </div>
          </Link>
        </div>
        
        {/* Side Gradients for fading */}
        <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-[#050507] to-transparent z-10 hidden md:block" />
        <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-[#050507] to-transparent z-10 hidden md:block" />
      </div>
    </section>
  );
}

function ProductCard({ product, index }: { product: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="shrink-0 w-[75vw] md:w-[40vw] lg:w-[28vw] flex flex-col group relative bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-primary/30 transition-all duration-500 h-full"
    >
      <div className="aspect-[16/10] overflow-hidden relative">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full bg-zinc-800/50 flex items-center justify-center">
            <span className="font-black text-6xl italic text-white/5">F</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
      </div>

      <div className="p-8 md:p-10 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            {product.tag || "Enterprise"}
          </span>
        </div>
        
        <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-2 group-hover:text-primary transition-colors">
          {product.title}
        </h3>
        
        {product.subtitle && (
          <p className="text-primary/70 text-[11px] font-bold uppercase tracking-widest mb-6">
            {product.subtitle}
          </p>
        )}

        <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2 mb-8 flex-1">
          {product.description}
        </p>

        <div className="pt-8 border-t border-white/5">
          <Link
            href={product.website_url || `/solutions#${product.id}`}
            target={product.website_url ? "_blank" : "_self"}
            className="inline-flex items-center gap-3 bg-white text-zinc-950 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all hover:bg-primary hover:text-white"
          >
            Learn More <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}