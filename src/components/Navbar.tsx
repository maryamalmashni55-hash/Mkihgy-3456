import React, { useState } from 'react';
import { 
  Rocket, 
  Volume2, 
  VolumeX, 
  Menu, 
  X, 
  Orbit, 
  Film, 
  Compass, 
  Layers, 
  Calculator,
  Activity
} from 'lucide-react';
import { cosmicAudio } from './CosmicAudio';

export const Navbar: React.FC = () => {
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const toggleSound = () => {
    const muted = cosmicAudio.toggleMute();
    setIsAudioMuted(muted);
    if (!muted) {
      cosmicAudio.playQuindarTone(true);
    }
  };

  const navLinks = [
    { label: 'المحاكاة ثلاثية الأبعاد', href: '#simulation', icon: Orbit },
    { label: 'العرض السينمائي', href: '#storyboard', icon: Film },
    { label: 'غرفة التحكم والإطلاق', href: '#flight-sim', icon: Compass },
    { label: 'التشريح الهندسي', href: '#cutaway', icon: Layers },
    { label: 'موسوعة الصواريخ والفيزياء', href: '#timeline', icon: Calculator },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#030509]/85 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Right Brand / Logo (RTL primary) */}
        <a href="#" className="flex items-center gap-3.5 group select-none">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-600 to-sky-400 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
            <div className="w-full h-full bg-[#030509] rounded-[14px] flex items-center justify-center">
              <Rocket className="w-5 h-5 text-cyan-400 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
          <div className="text-right">
            <span className="text-base sm:text-lg font-black text-white block leading-tight tracking-tight">
              أسبوع الفضاء العالمي
            </span>
            <span className="text-[11px] text-cyan-400 font-mono block tracking-normal">
              ثورة الصواريخ • The Rocketry Revolution
            </span>
          </div>
        </a>

        {/* Center Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-slate-950/70 p-1.5 rounded-2xl border border-slate-800/80 shadow-inner">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/70 transition-all"
              >
                <Icon className="w-3.5 h-3.5 text-cyan-400" />
                <span>{link.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Left Actions (Audio Synthesizer toggle & Mobile Menu) */}
        <div className="flex items-center gap-3">
          {/* Audio Synthesizer Toggle */}
          <button
            onClick={toggleSound}
            title={isAudioMuted ? "تشغيل المؤثرات الفضائية ونغمات ناسا" : "كتم الصوت"}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all border ${
              !isAudioMuted
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-850 border-slate-800'
            }`}
          >
            {!isAudioMuted ? (
              <>
                <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="hidden sm:inline font-mono">الصوت السينمائي نشط</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline font-mono">الصوت مكتوم</span>
              </>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800"
            title="القائمة"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#030509] border-b border-slate-800 px-4 py-4 space-y-2 text-right">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-end gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
              >
                <span>{link.label}</span>
                <Icon className="w-4 h-4 text-cyan-400" />
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
};
