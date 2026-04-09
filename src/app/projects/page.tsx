import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PageHero from "@/components/page-hero";
import ProjectsClient from "@/app/projects/projects-client";

export const metadata = {
  title: "Projects | FIDA Global",
  description: "Browse FIDA Global's portfolio of custom implementations and specialized software projects.",
};

export default function ProjectsPage() {
  return (
    <main className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      <Navbar />
      <PageHero
        badge="Portfolio Archive"
        badgeColor="green"
        accent="green"
        title={<>Precision <span style={{ color: "var(--green)" }} className="italic">Projects</span><br />for Global Clients</>}
        subtitle="Exploring our history of bespoke development, consulting, and custom technical implementations."
      />
      <ProjectsClient />
      <Footer />
    </main>
  );
}
