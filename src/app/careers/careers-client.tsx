"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, ArrowUpRight, Zap, Globe, Users, TrendingUp } from "lucide-react";

const perks = [
  { icon: Globe, color: "var(--green)", title: "Work Globally", desc: "Remote-first with offices in 12 countries. Work where you thrive." },
  { icon: TrendingUp, color: "var(--blue)", title: "Grow Fast", desc: "Structured career paths, mentorship, and a learning budget for every employee." },
  { icon: Zap, color: "var(--green)", title: "Cutting-Edge Tech", desc: "Work on enterprise problems at scale using the latest AI, cloud, and security tools." },
  { icon: Users, color: "var(--grey-light)", title: "Diverse Team", desc: "40+ nationalities. A culture of inclusion, respect, and collaboration." },
];

const jobs = [
  { id: 1, title: "Senior Cloud Infrastructure Engineer", dept: "Infrastructure", type: "Full-time", location: "Dubai / Remote", color: "var(--green)" },
  { id: 2, title: "Cybersecurity Analyst (SOC L2)", dept: "Security", type: "Full-time", location: "Nairobi / Remote", color: "var(--blue)" },
  { id: 3, title: "Full-Stack Engineer — FIDA HR", dept: "Product Engineering", type: "Full-time", location: "Amsterdam / Remote", color: "var(--green)" },
  { id: 4, title: "AI / ML Engineer", dept: "AI Practice", type: "Full-time", location: "Remote (Global)", color: "var(--blue)" },
  { id: 5, title: "IT Operations Manager", dept: "Managed Services", type: "Full-time", location: "Riyadh", color: "var(--grey-light)" },
  { id: 6, title: "Pre-Sales Solutions Architect", dept: "Sales Engineering", type: "Full-time", location: "London / Dubai", color: "var(--green)" },
  { id: 7, title: "Network Design Engineer (SD-WAN)", dept: "Networking", type: "Full-time", location: "Dubai", color: "var(--blue)" },
  { id: 8, title: "Technical Project Manager", dept: "Delivery", type: "Full-time", location: "Remote (EMEA)", color: "var(--grey-light)" },
];

export default function CareersClient() {
  return (
    <>
      {/* Perks */}
      <section className="section-alt py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {perks.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
                  className="glass rounded-3xl p-8 text-center group hover:-translate-y-2 transition-smooth"
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: `${p.color}18` }}>
                    <Icon className="w-7 h-7" style={{ color: p.color }} />
                  </div>
                  <h3 className="font-bold mb-2" style={{ color: "var(--text-primary)" }}>{p.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{p.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Jobs */}
      <section className="py-24 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 space-y-3"
        >
          <span className="badge-green px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">Open Positions</span>
          <h2 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
            {jobs.length} roles currently open
          </h2>
        </motion.div>

        <div className="space-y-4">
          {jobs.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5, ease: "easeOut" }}
            >
              <div className="glass rounded-2xl px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:-translate-x-1 transition-smooth card-hover-green relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-2xl" style={{ background: job.color }} />

                <div className="flex-1 space-y-1 pl-2">
                  <h3 className="font-bold text-lg group-hover:transition-colors" style={{ color: "var(--text-primary)" }}>{job.title}</h3>
                  <div className="flex items-center flex-wrap gap-4 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <span className="font-medium" style={{ color: job.color }}>{job.dept}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{job.type}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{job.location}</span>
                  </div>
                </div>

                <button
                  className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm flex-shrink-0 transition-smooth hover:scale-105"
                  style={{ background: `${job.color}18`, color: job.color, border: `1px solid ${job.color}30` }}
                >
                  Apply Now <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Open application CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-10 glass rounded-3xl p-10 text-center space-y-4"
        >
          <p className="text-lg font-medium" style={{ color: "var(--text-secondary)" }}>
            Don't see a role that fits? We hire exceptional people regardless.
          </p>
          <button
            className="px-8 py-4 rounded-full font-bold text-white gradient-green hover:scale-105 transition-smooth"
          >
            Send Open Application
          </button>
        </motion.div>
      </section>
    </>
  );
}
