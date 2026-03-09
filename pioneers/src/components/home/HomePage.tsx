"use client";

import Navigation from "@/components/layout/Navigation";
import HeroSection from "@/components/sections/HeroSection";
import KeyFeatures from "@/components/sections/KeyFeatures";
import CitizenReporting from "@/components/sections/CitizenReporting";
import ImpactStats from "@/components/sections/ImpactStats";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100/10 rounded-full blur-3xl"></div>
      </div>

      {/* Components */}
      <Navigation />
      <HeroSection />
      <KeyFeatures />
      <CitizenReporting />
      <ImpactStats />
      <Footer />
    </div>
  );
}
