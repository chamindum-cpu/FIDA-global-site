import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import MarqueeTicker from "@/components/marquee";
import StatsSection from "@/components/stats-section";
import CompanyLogos from "@/components/company-logos";
import ExpertiseSection from "@/components/expertise-section";
import RobotArmHero from "@/components/robot-arm";
import ProjectsSection from "@/components/projects-section";
import BlogSection from "@/components/blog-section";
import CtaSection from "@/components/cta-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen font-sans">
      <Navbar />
      <Hero />
      <MarqueeTicker />
      <StatsSection />
      <CompanyLogos />
      <ExpertiseSection />
      <RobotArmHero />
      <ProjectsSection />
      <BlogSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
