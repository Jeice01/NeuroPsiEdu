import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/hero/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { CoursesSection } from "@/components/sections/CoursesSection";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col selection:bg-neuro-blue/20">
      <Navbar />
      
      {/* Hero Section */}
      <div id="inicio">
        <HeroSection />
      </div>

      {/* Main Sections */}
      <AboutSection />
      <ServicesSection />
      <CoursesSection />
      
      <Footer />
    </main>
  );
}
