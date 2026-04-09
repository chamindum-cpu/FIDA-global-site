"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star, UserPlus, ChevronLeft, ChevronRight } from "lucide-react";

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await fetch("/api/testimonials");
        if (res.ok) {
          const data = await res.json();
          setTestimonials(data);
        }
      } catch (err) {
        console.error("Failed to fetch testimonials:", err);
      }
    }
    fetchTestimonials();
  }, []);

  const next = () => setIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  if (testimonials.length === 0) return null;

  return (
    <section className="py-32 bg-[#050510] relative overflow-hidden">
      {/* Background Decor - More Light Colors */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[160px] -mr-64 -mt-64 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-emerald-600/20 rounded-full blur-[160px] -ml-64 -mb-64" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-20">
           <div className="flex items-center gap-2 text-blue-500 font-bold uppercase tracking-[0.4em] text-[10px] mb-4">
              <Quote size={16} />
              <span>Customer Voice</span>
           </div>
           <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
              Trusted by <br/><span className="text-blue-500 italic">Visionaries</span>
           </h2>
        </div>

        <div className="max-w-5xl mx-auto relative h-[400px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 100, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -100, scale: 0.95 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="glass rounded-[3rem] p-12 md:p-20 border border-white/5 shadow-2xl relative w-full"
            >
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="w-32 h-32 md:w-48 md:h-48 shrink-0 rounded-full overflow-hidden border-4 border-white/5 relative">
                   {testimonials[index].image_url ? (
                     <img src={testimonials[index].image_url} alt={testimonials[index].client_name} className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full bg-blue-900/20 flex items-center justify-center text-blue-500/30">
                        <UserPlus size={48} />
                     </div>
                   )}
                </div>

                <div className="flex-1 space-y-8">
                  <div className="flex gap-1">
                    {[...Array(testimonials[index].rating || 5)].map((_, i) => (
                      <Star key={i} size={16} className="fill-blue-500 text-blue-500" />
                    ))}
                  </div>
                  
                  <p className="text-xl md:text-3xl font-medium text-white/90 italic leading-relaxed">
                    "{testimonials[index].content}"
                  </p>

                  <div className="border-t border-white/5 pt-8">
                    <h4 className="text-xl font-black text-white uppercase tracking-tight">{testimonials[index].client_name}</h4>
                    <p className="text-blue-500 font-bold uppercase tracking-widest text-[10px]">
                      {testimonials[index].client_position} at {testimonials[index].client_company}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="absolute -bottom-16 md:bottom-auto md:-right-12 flex md:flex-col gap-4">
             <button onClick={prev} className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all group">
                <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
             </button>
             <button onClick={next} className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all group">
                <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
        </div>
      </div>
    </section>
  );
}
