"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Box, Layers, ArrowUpRight } from "lucide-react";

export default function ProductsSection() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const targetRef = useRef<HTMLDivElement>(null);

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

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    if (loading || products.length === 0) return;
    const unsub = scrollYProgress.on("change", (latest) => {
      const index = Math.min(Math.floor(latest * (products.length + 1)), products.length);
      setActiveIndex(Math.max(0, index));
    });
    return () => unsub();
  }, [scrollYProgress, products.length, loading]);

  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(products.length) * 60}vw`]);

  if (loading) {
    return (
      <section ref={targetRef} className="h-[300vh] bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-white/50">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold tracking-widest uppercase">Charging Ecosystem...</span>
        </div>
      </section>
    );
  }

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-[#080d22]">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">

        {/* Background Aura - More Light Colors */}
        <div className="absolute inset-0 z-0 opacity-70">
          <div className="absolute top-[10%] left-[10%] w-[80vw] h-[80vw] bg-blue-500/20 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[10%] w-[70vw] h-[70vw] bg-indigo-500/20 rounded-full blur-[130px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10 w-full h-full flex flex-col justify-center py-10">

          <div className="container mx-auto px-10 mb-8 shrink-0">
            <div className="flex items-center gap-2 text-blue-500 font-bold uppercase tracking-[0.3em] text-[10px] mb-2">
              <Layers size={14} />
              <span>Product Suite</span>
            </div>
            <h2 className="text-[6vw] font-black text-white uppercase leading-none tracking-tighter">
              Our <span className="text-blue-500 italic">Products</span>
            </h2>
          </div>

          <motion.div style={{ x }} className="flex gap-[8vw] pl-[35vw] pr-[50vw] items-center">
            {products.map((product, i) => (
              <ProductCard
                key={product.id || i}
                product={product}
                index={i}
                total={products.length + 1}
                scrollYProgress={scrollYProgress}
              />
            ))}

            {/* View All Card */}
            <div className="w-[300px] md:w-[400px] aspect-[4/5] shrink-0 rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center bg-white/5 backdrop-blur-3xl group hover:bg-white/10 transition-colors">
              <Link href="/solutions" className="flex flex-col items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-700">
                  <ArrowRight size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">Browse All</h3>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* HUD Tracker */}
        <div className="absolute bottom-10 right-10 flex items-center gap-4">
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Navigation</span>
          <div className="w-32 h-[1px] bg-white/10 relative overflow-hidden">
            <motion.div
              className="absolute h-full bg-blue-500"
              style={{ width: `${(scrollYProgress.get() * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product, index, total, scrollYProgress }: any) {
  const start = index / total;
  const end = (index + 1) / total;
  const focus = (start + end) / 2;

  // Nonlinear range to keep the card "Full Front" longer when centered
  const range = [
    Math.max(0, focus - 0.3),
    focus - 0.05,
    focus + 0.05,
    Math.min(1, focus + 0.3)
  ];
  const rotateY = useTransform(scrollYProgress, range, [-180, 0, 0, 180]);
  const scale = useTransform(scrollYProgress, range, [0.75, 1.1, 1.1, 0.75]);
  const opacity = useTransform(scrollYProgress, [Math.max(0, focus - 0.4), focus, Math.min(1, focus + 0.4)], [0, 1, 0]);

  return (
    <Link
      href={product.website_url || `/solutions#${product.id}`}
      target={product.website_url ? "_blank" : "_self"}
      className="shrink-0 cursor-pointer"
    >
      <motion.div
        style={{ scale, opacity, perspective: "1500px" }}
        className="w-[60vw] md:w-[22vw] aspect-[3/4] relative"
      >
        <motion.div
          style={{ rotateY, transformStyle: "preserve-3d" }}
          className="w-full h-full relative"
        >
          {/* FRONT */}
          <div
            className="absolute inset-0 w-full h-full rounded-[2rem] overflow-hidden border border-white/10 bg-[#09090b] shadow-2xl"
            style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
          >
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-full object-cover opacity-80"
              />
            ) : (
              <div className="w-full h-full bg-blue-900/10 flex items-center justify-center text-blue-500/20 font-black">PRODUCT</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-10 flex flex-col justify-end">
              <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter leading-none">{product.title}</h3>
            </div>
          </div>

          {/* BACK */}
          <div
            className="absolute inset-0 w-full h-full rounded-[2rem] bg-emerald-600 p-12 flex flex-col items-center justify-center text-center shadow-2xl"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)"
            }}
          >
            <div className="space-y-6">
              <h4 className="text-black text-2xl font-black uppercase tracking-tighter">{product.title}</h4>
              <p className="text-black/70 text-xs md:text-sm font-medium leading-relaxed line-clamp-6">{product.description}</p>
              <div className="pt-8">
                <div className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center mx-auto">
                  <ArrowUpRight size={24} className="text-black" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Link>
  );
}
