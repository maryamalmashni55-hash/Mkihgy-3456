import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SolarSystemScene } from './components/SolarSystemScene';
import { StoryboardSection } from './components/StoryboardSection';
import { RocketFlightSimulator } from './components/RocketFlightSimulator';
import { RocketCutawayViewer } from './components/RocketCutawayViewer';
import { TimelineSection } from './components/TimelineSection';
import { Footer } from './components/Footer';
import { PlanetData } from './data/spaceData';
import { Orbit } from 'lucide-react';

export default function App() {
  const [activePlanet, setActivePlanet] = useState<PlanetData | null>(null);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#030509] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Fixed Navigation */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <HeroSection
          onExploreClick={() => scrollToSection('simulation')}
          onCinemaClick={() => scrollToSection('storyboard')}
        />

        {/* 2. Interactive 3D Solar Simulation Section */}
        <section id="simulation" className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3">
                <Orbit className="w-3.5 h-3.5 text-cyan-400" />
                <span>محاكاة فيزيائية ثلاثية الأبعاد • Three.js WebGL Engine</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                النظام الشمسي: ميادين ومسارات الصواريخ
              </h2>
              <p className="text-slate-400 text-base sm:text-lg leading-relaxed font-light">
                استكشف كواكب المجموعة الشمسية في مداراتها الدقيقة حول الشمس مع حزام الكويكبات ومركبة Starship في رحلة انتقال هوهمان المدارية. انقر على أي كوكب لعرض الجاذبية، المسافة، وتاريخ استكشاف الصواريخ له.
              </p>
            </div>

            {/* 3D Scene Container */}
            <SolarSystemScene onSelectPlanet={(planet) => setActivePlanet(planet)} />
          </div>
        </section>

        {/* 3. Cinematic Storyboard & Video Gallery */}
        <StoryboardSection />

        {/* 4. Live Rocket Flight Ascent Simulator Section */}
        <section id="flight-sim" className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <RocketFlightSimulator />
        </section>

        {/* 5. Rocket Anatomical Cutaway Section */}
        <section id="cutaway" className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <RocketCutawayViewer />
        </section>

        {/* 6. Timeline & Tech Specs Encyclopedia + Rocket Calculator */}
        <TimelineSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
