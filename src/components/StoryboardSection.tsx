import React, { useState, useEffect, useRef } from 'react';
import { STORYBOARD_SCENES, StoryboardScene } from '../data/spaceData';
import { 
  Play, 
  Pause, 
  ChevronRight, 
  ChevronLeft, 
  Volume2, 
  Flame, 
  Compass, 
  Gauge, 
  Radio, 
  Activity, 
  Layers, 
  Sparkles,
  Camera,
  Crosshair,
  Sliders
} from 'lucide-react';
import { cosmicAudio } from './CosmicAudio';

export const StoryboardSection: React.FC = () => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [isPlayingAuto, setIsPlayingAuto] = useState<boolean>(false);
  const [cameraAngle, setCameraAngle] = useState<'ground' | 'onboard' | 'thermal'>('ground');
  const [progress, setProgress] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const scene = STORYBOARD_SCENES[currentSceneIndex];

  // Auto-play cinematic scene presentation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlayingAuto) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setCurrentSceneIndex((idx) => {
              const next = (idx + 1) % STORYBOARD_SCENES.length;
              cosmicAudio.playQuindarTone(true);
              return next;
            });
            return 0;
          }
          return prev + 1.2; // ~8.5 seconds per scene
        });
      }, 100);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [isPlayingAuto, currentSceneIndex]);

  const selectScene = (idx: number) => {
    setCurrentSceneIndex(idx);
    setProgress(0);
    cosmicAudio.playQuindarTone(false);
  };

  const handleAngleChange = (angle: 'ground' | 'onboard' | 'thermal') => {
    setCameraAngle(angle);
    cosmicAudio.playTelemetryBeep(940);
  };

  // Canvas visual rendering for cinematic effects
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = canvas.parentElement?.clientHeight || 450;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      life: number;
      color: string;
    }
    const particles: Particle[] = [];

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      // Thermal IR Filter mode tint
      if (cameraAngle === 'thermal') {
        ctx.filter = 'contrast(1.4) saturate(2) hue-rotate(180deg)';
      } else if (cameraAngle === 'onboard') {
        ctx.filter = 'contrast(1.1) brightness(1.05)';
      } else {
        ctx.filter = 'none';
      }

      if (scene.id === 1) {
        // Scene 1: Launchpad at Night & Cryogenic Vapor Steam
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, '#02050c');
        bgGrad.addColorStop(0.65, '#050c18');
        bgGrad.addColorStop(1, '#091524');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Tower silhouette & lightning arrestor
        ctx.fillStyle = '#020409';
        ctx.fillRect(w * 0.43, h * 0.12, w * 0.05, h * 0.88);
        ctx.fillRect(w * 0.35, h * 0.82, w * 0.3, h * 0.18);

        // Rocket Silhouette with frost condensation
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.moveTo(w * 0.5, h * 0.1);
        ctx.lineTo(w * 0.528, h * 0.2);
        ctx.lineTo(w * 0.528, h * 0.82);
        ctx.lineTo(w * 0.472, h * 0.82);
        ctx.lineTo(w * 0.472, h * 0.2);
        ctx.closePath();
        ctx.fill();

        // High-Intensity Floodlight Beams cutting through mist
        const beamGrad = ctx.createLinearGradient(w * 0.18, h * 0.85, w * 0.5, h * 0.25);
        beamGrad.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
        beamGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(w * 0.16, h * 0.85);
        ctx.lineTo(w * 0.56, h * 0.18);
        ctx.lineTo(w * 0.44, h * 0.18);
        ctx.closePath();
        ctx.fill();

        // Rising Cryogenic LOX Vapor Frost Clouds
        if (frame % 2 === 0 && particles.length < 110) {
          particles.push({
            x: w * 0.48 + (Math.random() - 0.5) * 55,
            y: h * 0.42 + Math.random() * 85,
            vx: (Math.random() - 0.5) * 1.6,
            vy: -0.8 - Math.random() * 1.4,
            size: 18 + Math.random() * 40,
            alpha: 0.36,
            life: 0,
            color: 'rgba(224, 242, 254,'
          });
        }
      } else if (scene.id === 2) {
        // Scene 2: Supersonic Liftoff & Mach Shock Diamonds
        const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.72, 15, w * 0.5, h * 0.72, w * 0.85);
        bgGrad.addColorStop(0, 'rgba(249, 115, 22, 0.55)');
        bgGrad.addColorStop(0.25, 'rgba(30, 58, 138, 0.35)');
        bgGrad.addColorStop(1, '#020409');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Ascending Rocket
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.moveTo(w * 0.5, h * 0.14);
        ctx.lineTo(w * 0.524, h * 0.24);
        ctx.lineTo(w * 0.522, h * 0.5);
        ctx.lineTo(w * 0.478, h * 0.5);
        ctx.lineTo(w * 0.476, h * 0.24);
        ctx.closePath();
        ctx.fill();

        // Blue Inner Supersonic Core Plume
        const blueFlame = ctx.createLinearGradient(w * 0.5, h * 0.5, w * 0.5, h * 0.78);
        blueFlame.addColorStop(0, '#67e8f9');
        blueFlame.addColorStop(0.35, '#00f0ff');
        blueFlame.addColorStop(1, 'rgba(14, 165, 233, 0)');
        ctx.fillStyle = blueFlame;
        ctx.beginPath();
        ctx.moveTo(w * 0.485, h * 0.5);
        ctx.lineTo(w * 0.515, h * 0.5);
        ctx.lineTo(w * 0.5, h * 0.8);
        ctx.closePath();
        ctx.fill();

        // 3 Visible Mach Shock Diamonds (ماسات الصدمة)
        for (let d = 0; d < 3; d++) {
          const dy = h * 0.56 + d * (h * 0.08);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.beginPath();
          ctx.moveTo(w * 0.5, dy - 6);
          ctx.lineTo(w * 0.51, dy);
          ctx.lineTo(w * 0.5, dy + 6);
          ctx.lineTo(w * 0.49, dy);
          ctx.closePath();
          ctx.fill();
        }

        // Giant Roaring Hydrocarbon Flame
        const orangeFlame = ctx.createLinearGradient(w * 0.5, h * 0.5, w * 0.5, h * 0.98);
        orangeFlame.addColorStop(0, '#fef08a');
        orangeFlame.addColorStop(0.25, '#f97316');
        orangeFlame.addColorStop(0.65, '#ea580c');
        orangeFlame.addColorStop(1, 'rgba(194, 65, 12, 0)');
        ctx.fillStyle = orangeFlame;
        ctx.beginPath();
        ctx.moveTo(w * 0.468, h * 0.5);
        ctx.lineTo(w * 0.532, h * 0.5);
        ctx.lineTo(w * 0.57 + Math.sin(frame * 0.45) * 10, h * 0.95);
        ctx.lineTo(w * 0.43 - Math.cos(frame * 0.45) * 10, h * 0.95);
        ctx.closePath();
        ctx.fill();

        // Sparks & Flame Smoke
        if (particles.length < 130) {
          particles.push({
            x: w * 0.5 + (Math.random() - 0.5) * 45,
            y: h * 0.58 + Math.random() * 35,
            vx: (Math.random() - 0.5) * 5.5,
            vy: 4.5 + Math.random() * 8,
            size: 2.5 + Math.random() * 4.5,
            alpha: 0.95,
            life: 0,
            color: Math.random() > 0.4 ? 'rgba(251, 191, 36,' : 'rgba(56, 189, 248,'
          });
        }
      } else if (scene.id === 3) {
        // Scene 3: Lunar Transit & High-Contrast Crater Relief
        ctx.fillStyle = '#020307';
        ctx.fillRect(0, 0, w, h);

        // Distant Glowing Earth Crescent
        const earthGrad = ctx.createRadialGradient(w * 0.84, h * 0.2, 8, w * 0.84, h * 0.2, 50);
        earthGrad.addColorStop(0, '#38bdf8');
        earthGrad.addColorStop(0.5, '#0284c7');
        earthGrad.addColorStop(1, 'rgba(2, 6, 23, 0)');
        ctx.fillStyle = earthGrad;
        ctx.beginPath();
        ctx.arc(w * 0.84, h * 0.2, 40, 0, Math.PI * 2);
        ctx.fill();

        // Giant Lunar Curvature Horizon
        const moonGrad = ctx.createRadialGradient(w * 0.35, h * 0.95, 80, w * 0.35, h * 0.95, w * 0.75);
        moonGrad.addColorStop(0, '#cbd5e1');
        moonGrad.addColorStop(0.45, '#64748b');
        moonGrad.addColorStop(0.8, '#1e293b');
        moonGrad.addColorStop(1, '#050811');
        ctx.fillStyle = moonGrad;
        ctx.beginPath();
        ctx.arc(w * 0.35, h * 1.05, w * 0.62, 0, Math.PI * 2);
        ctx.fill();

        // Lunar Craters with Stark Chiaroscuro Shadows
        const craters = [
          { x: w * 0.22, y: h * 0.7, r: 32 },
          { x: w * 0.41, y: h * 0.63, r: 46 },
          { x: w * 0.58, y: h * 0.76, r: 24 },
          { x: w * 0.32, y: h * 0.84, r: 38 },
        ];
        craters.forEach((c) => {
          ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
          ctx.beginPath();
          ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = 'rgba(241, 245, 249, 0.55)';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(c.x, c.y, c.r, Math.PI * 0.85, Math.PI * 1.85);
          ctx.stroke();
        });

        // Spacecraft in lunar orbit
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.moveTo(w * 0.68, h * 0.36);
        ctx.lineTo(w * 0.74, h * 0.34);
        ctx.lineTo(w * 0.72, h * 0.4);
        ctx.closePath();
        ctx.fill();
      } else if (scene.id === 4) {
        // Scene 4: Interstellar Nebulae & Ion Thruster Beam
        ctx.fillStyle = '#010206';
        ctx.fillRect(0, 0, w, h);

        const nebGrad1 = ctx.createRadialGradient(w * 0.35, h * 0.4, 30, w * 0.35, h * 0.4, w * 0.55);
        nebGrad1.addColorStop(0, 'rgba(168, 85, 247, 0.45)');
        nebGrad1.addColorStop(0.5, 'rgba(99, 102, 241, 0.25)');
        nebGrad1.addColorStop(1, 'rgba(2, 6, 23, 0)');
        ctx.fillStyle = nebGrad1;
        ctx.fillRect(0, 0, w, h);

        const nebGrad2 = ctx.createRadialGradient(w * 0.72, h * 0.62, 25, w * 0.72, h * 0.62, w * 0.5);
        nebGrad2.addColorStop(0, 'rgba(6, 182, 212, 0.4)');
        nebGrad2.addColorStop(0.5, 'rgba(59, 130, 246, 0.15)');
        nebGrad2.addColorStop(1, 'rgba(2, 6, 23, 0)');
        ctx.fillStyle = nebGrad2;
        ctx.fillRect(0, 0, w, h);

        // Ion Thruster Plasma Jet
        const ionBeam = ctx.createLinearGradient(w * 0.52, h * 0.48, w * 0.34, h * 0.48);
        ionBeam.addColorStop(0, '#38bdf8');
        ionBeam.addColorStop(0.4, 'rgba(56, 189, 248, 0.6)');
        ionBeam.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = ionBeam;
        ctx.beginPath();
        ctx.moveTo(w * 0.52, h * 0.47);
        ctx.lineTo(w * 0.34, h * 0.43);
        ctx.lineTo(w * 0.34, h * 0.53);
        ctx.lineTo(w * 0.52, h * 0.49);
        ctx.closePath();
        ctx.fill();

        // Probe hull
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(w * 0.52, h * 0.48, 5, 0, Math.PI * 2);
        ctx.fill();

        if (particles.length < 85) {
          particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            size: 0.8 + Math.random() * 2.2,
            alpha: 0.2 + Math.random() * 0.8,
            life: 0,
            color: Math.random() > 0.5 ? 'rgba(216, 180, 254,' : 'rgba(165, 243, 252,'
          });
        }
      }

      // Update particle physics
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        ctx.fillStyle = `${p.color} ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (scene.id === 1) {
          p.size += 0.25;
          p.alpha -= 0.005;
        } else if (scene.id === 2) {
          p.alpha -= 0.022;
        }

        if (p.alpha <= 0 || p.y < 0 || p.y > h || p.x < 0 || p.x > w) {
          particles.splice(i, 1);
        }
      }

      // Reset filter
      ctx.filter = 'none';

      // Telemetry HUD Crosshair Overlay
      if (cameraAngle === 'onboard') {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 1;
        ctx.strokeRect(w * 0.4, h * 0.35, w * 0.2, h * 0.3);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [scene.id, cameraAngle]);

  return (
    <section id="storyboard" className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>قاعة العرض السينمائي الملحمية • IMAX MISSION CONTROL</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            سردية الصعود: من ثرى الأرض إلى أطراف المجرة
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            استكشف المراحل الأربع الأيقونية لرحلة الصاروخ البشري، مع تبديل زوايا التصوير وبيانات التيليمترية الحية والسرد الفلكي الملحمي.
          </p>
        </div>

        {/* Scene Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {STORYBOARD_SCENES.map((item, index) => {
            const isActive = currentSceneIndex === index;
            return (
              <button
                key={item.id}
                onClick={() => selectScene(index)}
                className={`p-4 rounded-2xl text-right transition-all border relative overflow-hidden ${
                  isActive
                    ? 'bg-slate-900 border-cyan-400 shadow-xl shadow-cyan-950/60 ring-1 ring-cyan-500/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50 text-slate-400'
                }`}
              >
                {isActive && (
                  <span className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-500" />
                )}
                <span className={`text-[11px] font-mono block mb-1 ${isActive ? 'text-cyan-400 font-bold' : 'text-slate-500'}`}>
                  {item.stageNumber}
                </span>
                <span className={`text-sm font-bold block truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>
                  {item.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Cinematic Stage */}
        <div className="glass-panel-glow rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl">
          {/* Top Cinema Player Bar */}
          <div className="bg-slate-950/90 px-6 py-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                بث التيليمترية الفلكي المباشر
              </span>
              <span className="text-slate-700">|</span>
              <span className="text-slate-400 font-mono hidden sm:inline">{scene.subtitle}</span>
            </div>

            {/* Camera Angle Selector & Audio FX */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-900 rounded-xl p-1 border border-slate-800">
                <button
                  onClick={() => handleAngleChange('ground')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                    cameraAngle === 'ground' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  كاميرا المنصة
                </button>
                <button
                  onClick={() => handleAngleChange('onboard')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                    cameraAngle === 'onboard' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  كاميرا البدن
                </button>
                <button
                  onClick={() => handleAngleChange('thermal')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                    cameraAngle === 'thermal' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  مطياف حراري
                </button>
              </div>

              <button
                onClick={() => {
                  setIsPlayingAuto(!isPlayingAuto);
                  cosmicAudio.playQuindarTone(true);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                {isPlayingAuto ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-amber-400" />
                    <span>إيقاف العرض التلقائي</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-emerald-400" />
                    <span>عرض سينمائي متتابع</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Auto-play progress */}
          {isPlayingAuto && (
            <div className="w-full bg-slate-900 h-1">
              <div 
                className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-1 transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Visual Viewport */}
          <div className="relative w-full h-[380px] sm:h-[480px] lg:h-[540px] bg-black overflow-hidden flex items-center justify-center">
            <canvas ref={canvasRef} className="w-full h-full block" />

            {/* Letterboxing */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-black/60 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-black/60 pointer-events-none" />

            {/* Camera Feed Watermark */}
            <div className="absolute top-8 right-8 pointer-events-none text-right">
              <span className="px-3 py-1 rounded-md bg-black/70 border border-slate-700 text-cyan-400 font-mono text-xs block mb-1">
                {scene.stageNumber} // ANGLE: {cameraAngle.toUpperCase()}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white drop-shadow-md">
                {scene.title}
              </h3>
            </div>

            {/* Flight Telemetry Gauge Cluster */}
            <div className="absolute bottom-8 left-6 sm:left-8 pointer-events-none max-w-xs space-y-1.5 text-xs font-mono">
              <div className="bg-slate-950/85 backdrop-blur-md p-3.5 rounded-2xl border border-cyan-500/30 text-slate-300 space-y-1.5 shadow-2xl">
                <div className="text-[10px] text-cyan-400 font-bold border-b border-slate-800 pb-1 flex items-center justify-between">
                  <span>LIVE MISSION TELEMETRY</span>
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-400">الارتفاع:</span>
                  <span className="text-white font-semibold">{scene.telemetry.altitude}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-400">السرعة:</span>
                  <span className="text-amber-300 font-semibold">{scene.telemetry.velocity}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-400">تسارع G:</span>
                  <span className="text-cyan-300 font-semibold">{scene.telemetry.acceleration}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-400">حالة النظام:</span>
                  <span className="text-emerald-400 font-semibold truncate max-w-[150px]">{scene.telemetry.systemStatus}</span>
                </div>
              </div>
            </div>

            {/* Bottom-right Navigation Arrows */}
            <div className="absolute bottom-8 right-8 flex items-center gap-2 z-10">
              <button
                onClick={() => selectScene((currentSceneIndex - 1 + STORYBOARD_SCENES.length) % STORYBOARD_SCENES.length)}
                className="p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 backdrop-blur transition-all"
                title="المشهد السابق"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => selectScene((currentSceneIndex + 1) % STORYBOARD_SCENES.length)}
                className="p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 backdrop-blur transition-all"
                title="المشهد التالي"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Narrative Transcript */}
          <div className="p-6 sm:p-8 bg-slate-950/95 border-t border-slate-800/80 text-right">
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                <Radio className="w-4 h-4" />
                <span>السرد الفلكي الملحمي للمشهد:</span>
              </div>
              <p className="text-slate-200 text-base sm:text-lg leading-relaxed font-light">
                {scene.narrative}
              </p>

              <div className="pt-3 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>الوصف البصري والفيزيائي: {scene.keyVisualDescription}</span>
                </div>
                <div className="text-slate-500 font-mono">
                  معدل استهلاك الوقود: {scene.telemetry.engineBurnRate}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
