"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

const solutions = [
  {
    tag: "HR Automation",
    tagColor: "var(--green)",
    title: "FIDA HRIS",
    subtitle: "Complete Workforce Management",
    desc: "A comprehensive Human Resource Information System covering the entire employee lifecycle — from recruitment and payroll to attendance and performance management.",
    highlights: ["Cloud-based Payroll", "Employee Self-Service", "Attendance & Leave Tracking", "Multi-country Compliance", "Performance Analytics", "Digital Onboarding"],
    cta: "Request Demo",
    gradient: "from-green/10 to-transparent",
  },
  {
    tag: "Enterprise ERP",
    tagColor: "var(--blue)",
    title: "Expertise ERP",
    subtitle: "Integrated Business Intelligence",
    desc: "A high-performance ERP suite that unifies your operations, finance, and supply chain into a single, intelligent data ecosystem for maximum efficiency.",
    highlights: ["Financial Management", "Inventory Control", "Sales & Distribution", "Production Planning", "BI Dashboards", "Seamless Integrations"],
    cta: "Schedule Tour",
    gradient: "from-blue/10 to-transparent",
  },
  {
    tag: "Operational Tools",
    tagColor: "var(--grey-light)",
    title: "Asset Management",
    subtitle: "Digital Tracking & Governance",
    desc: "Full visibility over your organization's physical and digital assets. Track depreciation, maintenance schedules, and ownership in real-time.",
    highlights: ["Real-time Tracking", "Automated Audits", "Maintenance Alerts", "Depreciation Logic", "barcode/QR Integration", "Reporting Engine"],
    cta: "Learn More",
    gradient: "from-grey/10 to-transparent",
  },
  {
    tag: "Support Systems",
    tagColor: "var(--green)",
    title: "FIDA HelpDesk",
    subtitle: "Incident Reporting & IT Support",
    desc: "Streamline your IT support and task management with a robust helpdesk system designed for rapid resolution and high employee satisfaction.",
    highlights: ["Ticket Lifecycle Mgmt", "SLA Monitoring", "Knowledge Base", "Collaborative Tasks", "Feedback Loops", "Mobile-first Access"],
    cta: "Get Started",
    gradient: "from-green/10 to-transparent",
  },
];

export default function SolutionsClient() {
  return (
    <section className="py-20 container mx-auto px-6 space-y-12">
      {solutions.map((sol, i) => (
        <motion.div
          key={sol.title}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut", delay: i * 0.08 }}
          className={`glass rounded-[2.5rem] overflow-hidden relative`}
        >
          {/* Accent strip */}
          <div className="absolute top-0 left-0 w-1 h-full rounded-l-[2.5rem]" style={{ background: sol.tagColor }} />

          <div className="p-10 lg:p-14 grid lg:grid-cols-5 gap-10 items-start">
            {/* Left */}
            <div className="lg:col-span-3 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: `${sol.tagColor}15`, color: sol.tagColor }}>
                  {sol.tag}
                </span>
              </div>
              <div>
                <h2 className="text-4xl font-black" style={{ color: "var(--text-primary)" }}>{sol.title}</h2>
                <p className="text-lg font-medium mt-1" style={{ color: sol.tagColor }}>{sol.subtitle}</p>
              </div>
              <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>{sol.desc}</p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm text-white transition-smooth hover:scale-105"
                style={{ background: `linear-gradient(135deg, ${sol.tagColor}, ${sol.tagColor}99)` }}
              >
                {sol.cta} →
              </Link>
            </div>

            {/* Right — Feature list */}
            <div className="lg:col-span-2 section-elevated rounded-2xl p-8 space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>Key Features</p>
              {sol.highlights.map((h) => (
                <div key={h} className="flex items-center gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                  <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: sol.tagColor }} />
                  {h}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </section>
  );
}
