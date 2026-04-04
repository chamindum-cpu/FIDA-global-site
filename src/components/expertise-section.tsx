"use client";

import { motion } from "framer-motion";
import { Server, Shield, Cloud, Terminal, Cpu, Users, Zap } from "lucide-react";

const cards = [
  {
    number: "01",
    title: "ICT Infrastructure",
    desc: "Server management, virtualization, datacenter setup, and smart office automation.",
    icon: Server,
    color: "from-blue-500/20 to-blue-500/5",
    border: "hover:border-blue-500/40",
  },
  {
    number: "02",
    title: "Managed IT Services",
    desc: "24/7 proactive IT support, maintenance, and monitoring for maximum performance.",
    icon: Cloud,
    color: "from-cyan-500/20 to-cyan-500/5",
    border: "hover:border-cyan-500/40",
  },
  {
    number: "03",
    title: "ICT Consultancy",
    desc: "Strategic planning and implementation for large-scale enterprise IT transformation.",
    icon: Terminal,
    color: "from-primary/20 to-primary/5",
    border: "hover:border-primary/40",
  },
  {
    number: "04",
    title: "Software Development",
    desc: "Specialized Web and Mobile applications using the latest modern tech stacks.",
    icon: Zap,
    color: "from-purple-500/20 to-purple-500/5",
    border: "hover:border-purple-500/40",
  },
  {
    number: "05",
    title: "Security Systems",
    desc: "Integrated CCTV and advanced security solutions protecting your physical assets.",
    icon: Shield,
    color: "from-orange-500/20 to-orange-500/5",
    border: "hover:border-orange-500/40",
  },
  {
    number: "06",
    title: "IoT & Automation",
    desc: "Custom industrial automation and R&D for next-generation connected systems.",
    icon: Cpu,
    color: "from-green-500/20 to-green-500/5",
    border: "hover:border-green-500/40",
  },
  {
    number: "07",
    title: "Manpower Outsourcing",
    desc: "Providing highly skilled IT professionals for short or long-term enterprise goals.",
    icon: Users,
    color: "from-secondary/20 to-secondary/5",
    border: "hover:border-secondary/40",
  },
];

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
          {cards.map((card) => {
            const Icon = card.icon;
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
                  <p className="text-muted leading-relaxed">{card.desc}</p>
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
