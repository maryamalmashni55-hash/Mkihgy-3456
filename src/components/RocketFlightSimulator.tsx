import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  RotateCcw, 
  Gauge, 
  Activity, 
  Radio, 
  Flame, 
  ArrowUpRight, 
  Layers, 
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Zap
} from 'lucide-react';
import { cosmicAudio } from './CosmicAudio';

interface MissionPhase {
  timeSeconds: number;
  name: string;
  nameEn: string;
  altitudeKm: number;
  velocityKmh: number;
  mach: number;
  dynPressureKpa: number;
  gForce: number;
  propellantPercent: number;
  stageStatus: string;
  voiceCallout: string;
}

const FLIGHT_PROFILE: MissionPhase[] = [
  { timeSeconds: 0, name: 'سكون المنصة والعد التنازلي', nameEn: 'Terminal Count', altitudeKm: 0, velocityKmh: 0, mach: 0, dynPressureKpa: 0, gForce: 1.0, propellantPercent: 100, stageStatus: 'المرحلة 1 و 2 ممتلئة ومؤمنة', voiceCallout: 'T-0: إشعال المحركات الرئيسية، وانطلاق الصاروخ!' },
  { timeSeconds: 15, name: 'تجاوز برج الإطلاق', nameEn: 'Tower Cleared', altitudeKm: 0.8, velocityKmh: 240, mach: 0.2, dynPressureKpa: 5, gForce: 1.3, propellantPercent: 96, stageStatus: 'مناورة التوجيه المداري بدأت', voiceCallout: 'الصاروخ في مسار طيران مستقر نحو الشرق.' },
  { timeSeconds: 45, name: 'اختراق سرعة الصوت', nameEn: 'Mach 1 Transonic', altitudeKm: 7.5, velocityKmh: 1250, mach: 1.05, dynPressureKpa: 28, gForce: 2.1, propellantPercent: 84, stageStatus: 'ماسات الصدمة الأسرع من الصوت ظاهرة', voiceCallout: 'تخطي حاجز الصوت بنجاح.' },
  { timeSeconds: 72, name: 'ذروة الإجهاد الأيروديناميكي (Max-Q)', nameEn: 'Max-Q', altitudeKm: 14.2, velocityKmh: 2180, mach: 1.8, dynPressureKpa: 36, gForce: 2.8, propellantPercent: 72, stageStatus: 'أقصى ضغط ديناميكي على هيكل الصاروخ', voiceCallout: 'اجتياز نقطة Max-Q، المركبة في حالة اسمية.' },
  { timeSeconds: 120, name: 'ضغط التسارع الأعظمي للمرحلة 1', nameEn: 'Booster Peak Thrust', altitudeKm: 48.0, velocityKmh: 5400, mach: 4.4, dynPressureKpa: 12, gForce: 3.8, propellantPercent: 28, stageStatus: 'خروج من الغلاف الجوي الكثيف', voiceCallout: 'أنظمة القيادة توجه الصاروخ للأفق المداري.' },
  { timeSeconds: 155, name: 'إطفاء محركات المرحلة الأولى (MECO)', nameEn: 'MECO', altitudeKm: 68.5, velocityKmh: 7650, mach: 6.2, dynPressureKpa: 0.5, gForce: 1.1, propellantPercent: 4, stageStatus: 'استهلاك وقود المرحلة المعززة بالكامل', voiceCallout: 'MECO: إطفاء محركات المرحلة الأولى.' },
  { timeSeconds: 160, name: 'انفصال المرحلة الأولى', nameEn: 'Stage Separation', altitudeKm: 73.0, velocityKmh: 7680, mach: 6.3, dynPressureKpa: 0.1, gForce: 0.2, propellantPercent: 100, stageStatus: 'انفصال بيني، المرحلة 2 جاهزة', voiceCallout: 'تم فصل المعزز بنجاح!' },
  { timeSeconds: 168, name: 'اشتعال محرك المرحلة الثانية (SES-1)', nameEn: 'SES-1 Ignition', altitudeKm: 81.0, velocityKmh: 8100, mach: 6.6, dynPressureKpa: 0, gForce: 1.6, propellantPercent: 96, stageStatus: 'المرحلة الثانية في الفراغ الكوني', voiceCallout: 'اشتعال محرك الفراغ المفرغ، تسارع مداري.' },
  { timeSeconds: 210, name: 'إسقاط دروع الحمولة (Fairing Sep)', nameEn: 'Fairing Deployment', altitudeKm: 115.0, velocityKmh: 11200, mach: 9.1, dynPressureKpa: 0, gForce: 1.9, propellantPercent: 78, stageStatus: 'كشف حمولة القمر الصناعي للفضاء', voiceCallout: 'انفصال درع الحمولة، قمر الاتصالات مكشوف.' },
  { timeSeconds: 360, name: 'التسارع نحو السرعة المدارية الأولى', nameEn: 'Orbital Burn', altitudeKm: 185.0, velocityKmh: 21500, mach: 17.5, dynPressureKpa: 0, gForce: 2.7, propellantPercent: 32, stageStatus: 'الاقتراب من سرعة المدار 7.8 كم/ث', voiceCallout: 'محرك المرحلة الثانية يواصل الاحتراق الاسمي.' },
  { timeSeconds: 510, name: 'الاستقرار في المدار الأرضي (SECO-1)', nameEn: 'SECO-1 / Orbit Insertion', altitudeKm: 210.0, velocityKmh: 28080, mach: 23.0, dynPressureKpa: 0, gForce: 0.0, propellantPercent: 6, stageStatus: 'استقرار مداري تام وانعدام الجاذبية', voiceCallout: 'SECO-1! المركبة استقرت في مدار أرضي مستقر 100%.' }
];

export const RocketFlightSimulator: React.FC = () => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [missionClock, setMissionClock] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentPhase = FLIGHT_PROFILE[currentStepIndex];

  // Live flight simulation tick
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setMissionClock((t) => {
          const nextTime = t + 2;
          // check if we reached next phase
          const nextIndex = FLIGHT_PROFILE.findIndex((p, idx) => idx > currentStepIndex && nextTime >= p.timeSeconds);
          if (nextIndex !== -1 && nextIndex !== currentStepIndex) {
            setCurrentStepIndex(nextIndex);
            if (nextIndex === 6) {
              // stage separation sound
              cosmicAudio.playStageSeparation();
            } else {
              cosmicAudio.playQuindarTone(false);
            }
          }
          if (nextTime >= 510) {
            setIsRunning(false);
            cosmicAudio.playQuindarTone(true);
            return 510;
          }
          return nextTime;
        });
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, currentStepIndex]);

  const startSimulation = () => {
    if (missionClock >= 510) {
      setMissionClock(0);
      setCurrentStepIndex(0);
    }
    setIsRunning(true);
    cosmicAudio.playRocketPulse();
    cosmicAudio.playQuindarTone(true);
  };

  const pauseSimulation = () => {
    setIsRunning(false);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setMissionClock(0);
    setCurrentStepIndex(0);
    cosmicAudio.playTelemetryBeep(600);
  };

  const jumpToPhase = (idx: number) => {
    setCurrentStepIndex(idx);
    setMissionClock(FLIGHT_PROFILE[idx].timeSeconds);
    if (idx === 6) {
      cosmicAudio.playStageSeparation();
    } else {
      cosmicAudio.playTelemetryBeep(820);
    }
  };

  // Format flight clock T+ mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `T+ ${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass-panel-glow rounded-3xl p-6 sm:p-10 border border-cyan-500/35 relative overflow-hidden my-16 text-right">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={isRunning ? pauseSimulation : startSimulation}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/25'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/25'
            }`}
          >
            {isRunning ? (
              <>
                <Flame className="w-4 h-4 text-slate-950 animate-pulse" />
                <span>إيقاف مؤقت للرحلة</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>{missionClock > 0 && missionClock < 510 ? 'استئناف الإطلاق' : 'إطلاق محاكاة الطيران الحية'}</span>
              </>
            )}
          </button>

          <button
            onClick={resetSimulation}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="إعادة ضبط ساعة الإطلاق"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-1.5">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>REAL-TIME ASCENT TRAJECTORY ENGINE</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            غرفة التحكم المباشر: محاكاة مناورة الصعود المداري
          </h3>
        </div>
      </div>

      {/* Main Telemetry & Mission Clock */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3.5 mb-8">
        {/* Mission Clock */}
        <div className="col-span-2 bg-slate-950/90 p-4 rounded-2xl border border-cyan-500/30">
          <span className="text-slate-400 text-xs font-mono block mb-1">ساعة المهمة (MISSION CLOCK):</span>
          <span className="text-3xl sm:text-4xl font-mono font-black text-cyan-300 tracking-wider">
            {formatTime(missionClock)}
          </span>
          <span className="text-[11px] text-emerald-400 font-mono block mt-1">
            {currentPhase.nameEn}
          </span>
        </div>

        {/* Altitude */}
        <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
          <span className="text-slate-400 text-xs font-mono block mb-1">الارتفاع (ALTITUDE)</span>
          <span className="text-2xl font-mono font-bold text-white">
            {currentPhase.altitudeKm.toFixed(1)} <span className="text-xs font-normal text-slate-400">كم</span>
          </span>
          <div className="w-full bg-slate-900 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-cyan-400 h-full transition-all duration-300"
              style={{ width: `${Math.min(100, (currentPhase.altitudeKm / 210) * 100)}%` }}
            />
          </div>
        </div>

        {/* Velocity */}
        <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
          <span className="text-slate-400 text-xs font-mono block mb-1">السرعة (VELOCITY)</span>
          <span className="text-2xl font-mono font-bold text-amber-300">
            {currentPhase.velocityKmh.toLocaleString('ar-EG')} <span className="text-xs font-normal text-slate-400">كم/س</span>
          </span>
          <span className="text-[10px] text-slate-500 font-mono block mt-1">ماخ {currentPhase.mach.toFixed(1)}</span>
        </div>

        {/* Dynamic Pressure Q */}
        <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
          <span className="text-slate-400 text-xs font-mono block mb-1">الضغط الديناميكي (Q)</span>
          <span className="text-2xl font-mono font-bold text-sky-300">
            {currentPhase.dynPressureKpa} <span className="text-xs font-normal text-slate-400">كيلوباسكال</span>
          </span>
          <span className="text-[10px] text-slate-500 font-mono block mt-1">
            {currentPhase.dynPressureKpa > 30 ? 'ذروة Max-Q الحرجة' : 'ضغط طبيعي'}
          </span>
        </div>

        {/* G-Force Load */}
        <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
          <span className="text-slate-400 text-xs font-mono block mb-1">تسارع الجاذبية (G)</span>
          <span className="text-2xl font-mono font-bold text-emerald-400">
            {currentPhase.gForce.toFixed(1)} G
          </span>
          <span className="text-[10px] text-slate-500 font-mono block mt-1">
            حمولة الإجهاد الجسدي
          </span>
        </div>
      </div>

      {/* Voice Callout & Flight Director Commentary */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-xs text-cyan-400 font-mono font-bold block">
              نداء مراقب الطيران (FLIGHT DIRECTOR CALLOUT):
            </span>
            <p className="text-white text-sm sm:text-base font-semibold mt-0.5">
              « {currentPhase.voiceCallout} »
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>حالة المرحلة: {currentPhase.stageStatus}</span>
        </div>
      </div>

      {/* Trajectory Timeline Phase Steps Selector */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 font-mono mb-3">
          تسلسل مراحل الإطلاق الصاروخي (LAUNCH STAGING SEQUENCE):
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {FLIGHT_PROFILE.map((phase, idx) => {
            const isPassed = missionClock >= phase.timeSeconds;
            const isCurrent = currentStepIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => jumpToPhase(idx)}
                className={`p-3 rounded-xl text-right transition-all border text-xs relative overflow-hidden ${
                  isCurrent
                    ? 'bg-cyan-950/70 border-cyan-400 text-white ring-1 ring-cyan-500/40 shadow-lg'
                    : isPassed
                    ? 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:border-slate-600'
                    : 'bg-slate-950/40 border-slate-900 text-slate-500 hover:text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1 font-mono text-[10px]">
                  <span className={isCurrent ? 'text-cyan-400 font-bold' : 'text-slate-500'}>
                    T+{phase.timeSeconds}s
                  </span>
                  {isPassed && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                </div>
                <span className="font-bold block truncate">{phase.name}</span>
                <span className="text-[10px] text-slate-400 font-mono block truncate">{phase.nameEn}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
