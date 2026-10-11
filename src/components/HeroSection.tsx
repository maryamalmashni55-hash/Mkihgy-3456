import React from 'react';
import { HERO_STATS } from '../data/spaceData';
import { 
  Rocket, 
  ChevronDown, 
  Flame, 
  Sparkles, 
  Compass, 
  Play, 
  Orbit,
  ArrowDown
} from 'lucide-react';
import { cosmicAudio } from './CosmicAudio';

interface HeroSectionProps {
  onExploreClick: () => void;
  onCinemaClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreClick, onCinemaClick }) => {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 pt-20 pb-16 overflow-hidden">
      {/* Cinematic Starfield & Ambient Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(14,165,233,0.18),rgba(255,255,255,0))]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_60%,rgba(99,102,241,0.12),rgba(255,255,255,0))]" />

      {/* Grid line accents */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)`,
          backgroundSize: '4rem 4rem'
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        {/* World Space Week Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-950/90 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-medium tracking-wide mb-8 shadow-xl shadow-cyan-950/40 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
          <span>أسبوع الفضاء العالمي • احتفاء بالذكاء البشري وقهر الجاذبية</span>
          <span className="text-slate-600">|</span>
          <span className="text-amber-400 font-mono font-semibold">World Space Week</span>
        </div>

        {/* Grand Cinematic Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.18] mb-6">
          <span className="block text-slate-100">ثورة الصواريخ:</span>
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
            بوابتنا إلى أعماق الكون
          </span>
        </h1>

        {/* Cinematic Subtitle */}
        <p className="max-w-3xl text-slate-300 text-base sm:text-xl md:text-2xl leading-relaxed font-light mb-10 text-balance">
          في كل إطلاق، يتحرر الإنسان من أسره الأرضي بلهب يمزق صمت الفضاء. رحلة ملحمية من محركات الكيروسين البدائية إلى عمالقة المريخ والمحركات الأيونية العابرة للنظام الشمسي.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <button
            onClick={() => {
              cosmicAudio.playRocketPulse();
              onExploreClick();
            }}
            className="group relative px-7 py-3.5 sm:px-8 sm:py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-bold text-sm sm:text-base transition-all duration-300 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 inline-flex items-center gap-2.5 cursor-pointer"
          >
            <Orbit className="w-5 h-5 transition-transform group-hover:rotate-45 shrink-0" />
            <span>استكشف الرحلة والمحاكاة</span>
            <ArrowDown className="w-4 h-4 animate-bounce shrink-0" />
          </button>

          <button
            onClick={() => {
              cosmicAudio.playTelemetryBeep(800);
              onCinemaClick();
            }}
            className="px-6 py-3.5 sm:py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-cyan-500/40 text-sm sm:text-base font-semibold transition-all duration-300 backdrop-blur-md inline-flex items-center gap-2.5 cursor-pointer hover:text-white"
          >
            <Play className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>قاعة العرض السينمائي (4 مشاهد)</span>
          </button>
        </div>

        {/* Real Astrodynamics HUD Stats Bar */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 max-w-4xl text-right">
          {HERO_STATS.map((stat, idx) => (
            <div 
              key={idx}
              className="glass-panel p-4 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-colors"
            >
              <span className="text-slate-400 text-xs block mb-1 font-medium">{stat.label}</span>
              <span className="text-xl sm:text-2xl font-black font-mono text-cyan-300 block">{stat.value}</span>
              <span className="text-[11px] text-slate-500 block mt-1 leading-tight">{stat.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
