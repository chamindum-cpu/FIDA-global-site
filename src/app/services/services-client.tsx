"use client";

import { motion } from "framer-motion";
import { Server, Shield, Cloud, Terminal, Database, Cpu, Network, Settings } from "lucide-react";
import Link from "next/link";

const services = [
  {
    icon: Terminal, color: "var(--green)", label: "Strategy",
    title: "IT Consultancy",
    desc: "Align technology with business goals. Our consultants work as embedded partners, not advisors, delivering actionable roadmaps with measurable outcomes.",
    features: ["Digital transformation roadmaps", "Technology audits", "Vendor selection", "IT governance frameworks"],
  },
  {
    icon: Server, color: "var(--blue)", label: "Infrastructure",
    title: "Data Center & Infrastructure",
    desc: "Design, deploy, and optimise enterprise-grade server infrastructure — on-premises, colocation, or hybrid — with 99.9% uptime SLA as standard.",
    features: ["Server design & procurement", "HCI / hyperconverged", "Disaster recovery", "24/7 NOC monitoring"],
  },
  {
    icon: Shield, color: "var(--green)", label: "Security",
    title: "Cybersecurity",
    desc: "Protect every layer of your digital estate with zero-trust architecture, real-time threat detection, and incident response frameworks.",
    features: ["Zero-trust implementation", "SOC-as-a-service", "Penetration testing", "Compliance (ISO 27001, GDPR)"],
  },
  {
    icon: Cloud, color: "var(--blue)", label: "Cloud",
    title: "Managed Cloud Services",
    desc: "Seamless migration, management, and cost optimisation across AWS, Azure, and GCP — with governance guardrails built in.",
    features: ["Cloud migration", "FinOps & cost optimisation", "Multi-cloud management", "Serverless architecture"],
  },
  {
    icon: Network, color: "var(--grey)", label: "Networking",
    title: "Networking & SD-WAN",
    desc: "Enterprise networking solutions for the modern, distributed workforce — fast, secure, and centrally managed.",
    features: ["SD-WAN deployment", "MPLS design", "Wi-Fi 6 rollout", "Network segmentation"],
  },
  {
    icon: Database, color: "var(--green)", label: "Data",
    title: "Data & Analytics",
    desc: "Turn raw data into business intelligence with real-time dashboards, AI-driven analytics, and data warehouse modernisation.",
    features: ["Business intelligence", "Data lake architecture", "AI/ML integration", "Real-time reporting"],
  },
  {
    icon: Cpu, color: "var(--blue)", label: "AI",
    title: "AI & Automation",
    desc: "Embed generative AI, RPA, and intelligent automation into your core workflows to drive efficiency and unlock new value streams.",
    features: ["Generative AI implementation", "Process automation (RPA)", "AI chatbots & agents", "LLM fine-tuning"],
  },
  {
    icon: Settings, color: "var(--grey)", label: "Operations",
    title: "Managed IT Operations",
    desc: "Full IT outsourcing or co-managed support — our engineers become an extension of your team, covering helpdesk through infrastructure ops.",
    features: ["24/7 helpdesk support", "Patch & update management", "Asset lifecycle", "SLA-backed response"],
  },
];

export default function ServicesClient() {
  return (
    <section className="py-24 container mx-auto px-6">
      <div className="grid md:grid-cols-2 gap-8">
        {services.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.6, ease: "easeOut" }}
              className="glass rounded-3xl p-10 group hover:-translate-y-1 transition-smooth card-hover-blue relative overflow-hidden"
            >
              {/* Accent bg */}
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[80px] opacity-0 group-hover:opacity-10 transition-opacity" style={{ background: s.color }} />

              <div className="flex items-start gap-6 mb-6">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}18` }}>
                  <Icon className="w-7 h-7" style={{ color: s.color }} />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: `${s.color}15`, color: s.color }}>{s.label}</span>
                  <h3 className="text-xl font-bold mt-2" style={{ color: "var(--text-primary)" }}>{s.title}</h3>
                </div>
              </div>

              <p className="leading-relaxed mb-6 text-sm" style={{ color: "var(--text-secondary)" }}>{s.desc}</p>

              <ul className="space-y-2 mb-8">
                {s.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-smooth"
                style={{ color: s.color }}
              >
                Enquire Now →
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
