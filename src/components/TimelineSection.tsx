import React, { useState } from 'react';
import { ROCKET_TIMELINE, RocketTech } from '../data/spaceData';
import { 
  Rocket, 
  Flame, 
  ArrowUpRight, 
  Layers, 
  TrendingUp, 
  Calculator, 
  Gauge, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Zap
} from 'lucide-react';
import { cosmicAudio } from './CosmicAudio';

export const TimelineSection: React.FC = () => {
  const [selectedRocket, setSelectedRocket] = useState<RocketTech>(ROCKET_TIMELINE[0]);

  // Tsiolkovsky Rocket Equation Interactive Calculator State
  // Delta V = Isp * g0 * ln(m0 / mf)
  const [dryMass, setDryMass] = useState<number>(30); // in tons
  const [fuelMass, setFuelMass] = useState<number>(270); // in tons
  const [isp, setIsp] = useState<number>(360); // specific impulse in seconds (vacuum)

  // Calculations
  const g0 = 9.80665; // m/s^2
  const m0 = dryMass + fuelMass;
  const mf = dryMass;
  const massRatio = m0 / mf;
  // deltaV in m/s, convert to km/s
  const deltaV = (isp * g0 * Math.log(massRatio)) / 1000;

  // Thresholds
  const orbitThreshold = 7.8; // km/s for LEO
  const escapeThreshold = 11.2; // km/s for escape velocity
  const marsThreshold = 13.0; // km/s for Mars transfer

  return (
    <section id="timeline" className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 bg-[#030509]">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Rocket className="w-3.5 h-3.5 text-cyan-400" />
            <span>موسوعة ثورة الصواريخ • الأرقام والفيزياء</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            أعظم قفزات الهندسة في تاريخ البشرية
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed font-light">
            من عمالقة سباق الفضاء الأول إلى منظومات الهبوط العمودي والدفع النووي؛ تعرّف على المواصفات الفيزيائية واختبر معادلة تسيولكوفسكي الصاروخية بنفسك.
          </p>
        </div>

        {/* 1. Interactive Timeline Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20 items-start">
          {/* Timeline List (Left 5 Cols) */}
          <div className="lg:col-span-5 space-y-3.5">
            <h3 className="text-sm font-semibold text-slate-400 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>المحطات التاريخية لثورة المحركات:</span>
            </h3>

            {ROCKET_TIMELINE.map((rocket) => {
              const isSelected = selectedRocket.id === rocket.id;
              return (
                <div
                  key={rocket.id}
                  onClick={() => {
                    setSelectedRocket(rocket);
                    cosmicAudio.playTelemetryBeep(680);
                  }}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border text-right relative overflow-hidden ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500 shadow-xl shadow-cyan-950/40 ring-1 ring-cyan-500/50'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800/90 text-cyan-300 border border-slate-700/60">
                      {rocket.era}
                    </span>
                    <span className={`text-base font-bold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                      {rocket.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
                    <span className="text-slate-500">{rocket.agencyOrCompany}</span>
                    <span className="font-mono text-cyan-400">{rocket.liftoffThrustKN.toLocaleString('ar-EG')} كيلو نيوتن</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Rocket Deep Specs Card (Right 7 Cols) */}
          <div className="lg:col-span-7">
            <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-slate-700 text-right">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-5">
                <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                  {selectedRocket.era} • {selectedRocket.agencyOrCompany}
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    {selectedRocket.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-cyan-400 mt-1 font-mono">
                    {selectedRocket.fuelType}
                  </p>
                </div>
              </div>

              {/* Physical Comparison Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6 text-center">
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-xs block mb-1">الارتفاع الكلي</span>
                  <span className="text-xl font-bold font-mono text-white">{selectedRocket.heightMeters} م</span>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-xs block mb-1">القطر</span>
                  <span className="text-xl font-bold font-mono text-cyan-300">{selectedRocket.diameterMeters} م</span>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-xs block mb-1">قوة الدفع بالإقلاع</span>
                  <span className="text-xl font-bold font-mono text-amber-300">{(selectedRocket.liftoffThrustKN / 1000).toFixed(1)} MN</span>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-xs block mb-1">الحمولة إلى LEO</span>
                  <span className="text-xl font-bold font-mono text-emerald-400">{(selectedRocket.payloadToLEOKg / 1000).toFixed(0)} طن</span>
                </div>
              </div>

              {/* Visual Height Comparison Bar */}
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80 mb-6">
                <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-mono">
                  <span>مقارنة الارتفاع بالنسبة لـ Starship (121 م)</span>
                  <span className="text-cyan-400">{((selectedRocket.heightMeters / 121) * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(selectedRocket.heightMeters / 121) * 100}%` }}
                  />
                </div>
              </div>

              {/* Achievement & Historical Quote */}
              <div className="space-y-3 bg-slate-900/50 p-4 rounded-xl border border-slate-800/80 text-sm">
                <div>
                  <span className="text-cyan-300 font-semibold block mb-1 flex items-center gap-1.5 justify-end">
                    <span>الإنجاز التاريخي والتقني:</span>
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  </span>
                  <p className="text-slate-300 leading-relaxed font-light">
                    {selectedRocket.achievement}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800">
                  <span className="text-amber-400 font-semibold block mb-1 flex items-center gap-1.5 justify-end">
                    <span>حقيقة علمية استثنائية:</span>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </span>
                  <p className="text-slate-300 leading-relaxed font-light text-xs sm:text-sm">
                    {selectedRocket.highlightText}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Interactive Tsiolkovsky Rocket Equation Sandbox */}
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-cyan-500/30">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-cyan-400 text-xs font-mono mb-2">
              <Calculator className="w-3.5 h-3.5" />
              <span>مختبر فيزياء الطيران الفلكي</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              حاسبة معادلة تسيولكوفسكي الصاروخية
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 font-mono">
              Δv = I_sp · g₀ · ln(m₀ / m_f)
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Controls (7 Cols) */}
            <div className="lg:col-span-7 space-y-6 text-right">
              {/* Slider 1: Dry Mass */}
              <div>
                <div className="flex justify-between items-center text-xs sm:text-sm mb-2 font-mono">
                  <span className="text-cyan-400 font-bold">{dryMass} طن</span>
                  <label className="text-slate-300">الكتلة الصافية للهيكل والحمولة (m_f):</label>
                </div>
                <input
                  type="range"
                  min="5"
                  max="120"
                  step="1"
                  value={dryMass}
                  onChange={(e) => setDryMass(Number(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
                <span className="text-[11px] text-slate-500 block mt-1">تتضمن المحركات، الخزانات، والرواد أو الأقمار الصناعية.</span>
              </div>

              {/* Slider 2: Propellant Mass */}
              <div>
                <div className="flex justify-between items-center text-xs sm:text-sm mb-2 font-mono">
                  <span className="text-amber-400 font-bold">{fuelMass} طن</span>
                  <label className="text-slate-300">كتلة الوقود والمؤكسد (m_prop):</label>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1200"
                  step="10"
                  value={fuelMass}
                  onChange={(e) => setFuelMass(Number(e.target.value))}
                  className="w-full accent-amber-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
                <span className="text-[11px] text-slate-500 block mt-1">تشكل عادة ما بين 85% إلى 95% من إجمالي وزن الصاروخ عند الإقلاع.</span>
              </div>

              {/* Slider 3: Specific Impulse Isp */}
              <div>
                <div className="flex justify-between items-center text-xs sm:text-sm mb-2 font-mono">
                  <span className="text-emerald-400 font-bold">{isp} ثانية</span>
                  <label className="text-slate-300">النبض النوعي للمحرك (I_sp):</label>
                </div>
                <input
                  type="range"
                  min="250"
                  max="950"
                  step="10"
                  value={isp}
                  onChange={(e) => setIsp(Number(e.target.value))}
                  className="w-full accent-emerald-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
                <span className="text-[11px] text-slate-500 block mt-1">
                  كفاءة المحرك: الكيروسين ~310ث، الهيدروجين ~450ث، الدفع النووي الحراري ~900ث!
                </span>
              </div>
            </div>

            {/* Results HUD (5 Cols) */}
            <div className="lg:col-span-5 bg-slate-950/80 p-6 rounded-2xl border border-cyan-500/30 text-right space-y-5">
              <div>
                <span className="text-xs text-slate-400 font-mono block mb-1">السرعة التراكمية الناتجة (Delta-V):</span>
                <div className="flex items-baseline gap-2 justify-end">
                  <span className="text-xs text-cyan-400 font-mono">كم/ثانية</span>
                  <span className="text-4xl sm:text-5xl font-black font-mono text-cyan-300">
                    {deltaV.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Assessment gauges */}
              <div className="space-y-2 text-xs pt-3 border-t border-slate-800">
                <span className="text-slate-400 block mb-1.5 font-semibold">جاهزية المهمة الفلكية:</span>
                
                {/* LEO check */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="font-mono text-slate-400">7.8 كم/ث</span>
                  <span className={`font-semibold flex items-center gap-1.5 ${deltaV >= orbitThreshold ? 'text-emerald-400' : 'text-rose-400'}`}>
                    <span>الوصول للمدار الأرضي المنخفض (LEO)</span>
                    <span className="text-xs">{deltaV >= orbitThreshold ? '✓ تم تحقيقه' : '✗ غير كافٍ'}</span>
                  </span>
                </div>

                {/* Escape velocity check */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="font-mono text-slate-400">11.2 كم/ث</span>
                  <span className={`font-semibold flex items-center gap-1.5 ${deltaV >= escapeThreshold ? 'text-emerald-400' : 'text-rose-400'}`}>
                    <span>سرعة الإفلات من جاذبية الأرض</span>
                    <span className="text-xs">{deltaV >= escapeThreshold ? '✓ هروب ناجح' : '✗ لا يمكن الإفلات'}</span>
                  </span>
                </div>

                {/* Mars transfer check */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="font-mono text-slate-400">13.0 كم/ث</span>
                  <span className={`font-semibold flex items-center gap-1.5 ${deltaV >= marsThreshold ? 'text-emerald-400' : 'text-slate-500'}`}>
                    <span>مسار الانتقال إلى المريخ (TMI)</span>
                    <span className="text-xs">{deltaV >= marsThreshold ? '✓ جاهز للمريخ' : 'يحتاج مراحل إضافية'}</span>
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 font-mono bg-cyan-950/30 p-2.5 rounded-lg border border-cyan-800/40">
                نسبة كتلة الإقلاع للإفراغ (m₀/m_f): <span className="text-cyan-300 font-bold">{massRatio.toFixed(2)}x</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
