"use client";

import { HeroContent } from "./HeroContent";
import { CinematicVisual } from "./CinematicVisual";
import { CtaCards } from "../sections/CtaCards";
import { InfoBar } from "../sections/InfoBar";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#fdfdfd] pt-24">
      {/* Absolute Background Pattern - Refined */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-[0.03] pointer-events-none" />
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10 flex flex-col items-center">
        {/* Top Grid: Content (Left) and Visuals (Right) */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-8 lg:mb-12">
          <HeroContent />
          <CinematicVisual />
        </div>

        {/* CTA Cards Section */}
        <div className="w-full relative">
          <CtaCards />
        </div>
      </div>

      {/* Info Bar at the very bottom */}
      <InfoBar />
    </section>
  );
}
