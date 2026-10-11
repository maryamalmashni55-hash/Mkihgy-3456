import React, { useState } from 'react';
import { 
  Rocket, 
  Layers, 
  Flame, 
  Shield, 
  Compass, 
  Crosshair, 
  Cpu, 
  Zap, 
  CheckCircle2,
  Info
} from 'lucide-react';
import { cosmicAudio } from './CosmicAudio';

interface RocketComponentPart {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  specs: string;
  description: string;
  engineeringFact: string;
}

const ROCKET_PARTS: RocketComponentPart[] = [
  {
    id: 'fairing',
    name: 'درع الحمولة الأيروديناميكي (Fairings)',
    nameEn: 'Payload Fairing & Thermal Shield',
    category: 'الحماية الهيكلية',
    specs: 'مركبات ألياف الكربون، عزل صوتي وحراري لدرجة 1,200 م°',
    description: 'يحمي الأقمار الصناعية وكبسولات الرواد من الاحتكاك الهوائي القاتل والاهتزازات الصوتية أثناء اختراق الغلاف الجوي الأرضي بسرعة تفوق ماخ 5.',
    engineeringFact: 'ينفصل الدرع بدقة ميكروثانية عبر مكابس هوائية (Pneumatic Pushers) فور الخروج من الغلاف الجوي الكثيف على ارتفاع 110 كم لتخفيف الوزن.'
  },
  {
    id: 'payload',
    name: 'الحمولة المدارية أو كبسولة الطاقم',
    nameEn: 'Orbital Payload / Crew Dragon Capsule',
    category: 'الهدف والمهمة',
    specs: 'سعة 15 إلى 150 طن للمدار الأرضي المنخفض أو المريخ',
    description: 'تحتوي على التلسكوبات الفلكية أو أقمار الاتصالات أو كبسولة رواد الفضاء المزودة بأنظمة دعم الحياة والتحكم البيئي المتكامل.',
    engineeringFact: 'تُحمى الكبسولة بدرع حراري مصنوع من مادة PICA-X المقاومة لدرجة حرارة إعادة الدخول التي تصل لـ 2000 مئوية.'
  },
  {
    id: 'lox-tank',
    name: 'خزان الأكسجين السائل المبرد (LOX Tank)',
    nameEn: 'Cryogenic Liquid Oxygen Tank',
    category: 'نظام التغذية والوقود',
    specs: 'مبرد لدرجة حرارة -183 مئوية تحت ضغط 3.5 بار',
    description: 'نظراً لانعدام الأكسجين في الفضاء، يحمل الصاروخ مؤكسده الخاص في صورة سائلة مبردة بكثافة فائقة لتمكين الاحتراق المستمر للمحركات.',
    engineeringFact: 'يمثل الأكسجين السائل النسبة الأكبر من وزن الصاروخ الإجمالي بنسبة تقارب 78% من إجمالي كتلة الوقود!'
  },
  {
    id: 'grid-fins',
    name: 'زعانف التوجيه الشبكية (Hypersonic Grid Fins)',
    nameEn: 'Titanium Grid Fins & Aerodynamic Control',
    category: 'التحكم والملاحة',
    specs: 'تيتانيوم مصبوب كقطعة واحدة يتحمل درجات حرارة الاحتكاك الصوتي',
    description: 'تفتح الزعانف الشبكية فور فصل المرحلة لتوجيه المعزز الصاروخي أيروديناميكياً أثناء سقوطه الحر عبر طبقات الجو بسرعة تفوق ماخ 3.',
    engineeringFact: 'تسمح بالتحكم الدقيق في مسار الهبوط لتمكين الصاروخ من الهبوط عمودياً بدقة سنتيمترات على منصة بحرية عائمة وسط المحيط!'
  },
  {
    id: 'interstage',
    name: 'حلقة الفصل الهوائي بين المراحل (Interstage)',
    nameEn: 'Interstage & Hot Staging Ring',
    category: 'الفصل الحركي',
    specs: 'سبائك الألمنيوم والليثيوم أو الفولاذ المقاوم للصدأ 304L',
    description: 'توصل بين المعزز السفلي والمرحلة الثانية، وتضم أنظمة الانفصال الهوائي أو الفتحات المهواة لتقنية "Hot-Staging" الحديثة.',
    engineeringFact: 'تتيح تقنية Hot-Staging الحديثة في Starship اشتعال محركات المرحلة العليا قبل فصل المعزز للحفاظ على التسارع المداري دون فقدان ثانية واحدة.'
  },
  {
    id: 'fuel-tank',
    name: 'خزان الوقود الهيدروكربوني (CH4 / RP-1)',
    nameEn: 'Liquid Methane / Kerosene Fuel Tank',
    category: 'طاقة الدفع',
    specs: 'ميثان سائل فائق التبريد (-162 م°) أو كيروسين فضائي مكرر',
    description: 'يوفر الطاقة الكيميائية الهائلة التي تختلط مع الأكسجين السائل داخل غرف الاحتراق لتوليد نفاث الغازات الأسرع من الصوت.',
    engineeringFact: 'يُفضل الميثان السائل لرحلات المريخ المستقبلية لإمكانية تصنيعه على الكوكب الأحمر عبر تفاعل ساباتييه (Sabatier reaction) باستخدام الماء وغاز CO2.'
  },
  {
    id: 'engines',
    name: 'عنقود المحركات الصاروخية الموجهة (Gimbal Engines)',
    nameEn: 'Full-Flow Staged Combustion Rocket Engines',
    category: 'الدفع الميكانيكي',
    specs: 'ضغط احتراق داخلي 300 بار، سرعة نفاث غازي 3.4 كم/ثانية',
    description: 'تضخ مضخات التوربينات العملاقة أطناناً من الوقود في الثانية الواحدة، مع نظام توجيه هيدروليكي أو كهربائي (Thrust Vector Control) لضبط مسار الطيران.',
    engineeringFact: 'تبرد جدران المحرك بمرور الوقود المبرد داخل قنوات شعرية قبل حرقه، مما يحمي المعدن من الذوبان تحت درجات حرارة تفوق 3300 مئوية!'
  }
];

export const RocketCutawayViewer: React.FC = () => {
  const [activePartId, setActivePartId] = useState<string>('engines');
  const activePart = ROCKET_PARTS.find((p) => p.id === activePartId) || ROCKET_PARTS[0];

  const handleSelect = (id: string) => {
    setActivePartId(id);
    cosmicAudio.playTelemetryBeep(780);
  };

  return (
    <div className="glass-panel-glow rounded-3xl p-6 sm:p-10 border border-cyan-500/30 my-16 text-right">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>المخطط الهندسي التشريحي للصواريخ المدارية</span>
        </div>
        <h3 className="text-3xl sm:text-4xl font-black text-white">
          التشريح الهندسي لعملاق الفضاء الحديث
        </h3>
        <p className="text-slate-400 text-sm sm:text-base mt-2">
          انقر على أي جزء من أجزاء الصاروخ لاستكشاف التقنيات الميكانيكية والحرارية التي تجعل الصعود إلى الفضاء ممكناً.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Interactive Rocket Silhouette Diagram (Left 5 Cols) */}
        <div className="lg:col-span-5 bg-slate-950/90 rounded-2xl p-6 border border-slate-800 flex flex-col items-center">
          <span className="text-xs text-slate-500 font-mono mb-4 text-center">
            [انقر على الأقسام الهندسية لتشريحها]
          </span>

          <div className="w-full max-w-xs space-y-2 text-center">
            {ROCKET_PARTS.map((part) => {
              const isSelected = part.id === activePartId;
              return (
                <button
                  key={part.id}
                  onClick={() => handleSelect(part.id)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-all border flex items-center justify-between ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-lg shadow-cyan-500/30 scale-102'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <span className="font-mono text-[10px] opacity-75">{part.nameEn.split('&')[0]}</span>
                  <span className="flex items-center gap-1.5">
                    <span>{part.name.split('(')[0]}</span>
                    <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-slate-950' : 'bg-cyan-400'}`} />
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>الارتفاع النموذجي: 70 - 121 متراً • الوزن: 1,400 - 5,000 طن</span>
          </div>
        </div>

        {/* Selected Part Deep Engineering Specs (Right 7 Cols) */}
        <div className="lg:col-span-7 bg-slate-950/95 rounded-2xl p-6 sm:p-8 border border-cyan-500/30 shadow-2xl space-y-5">
          <div className="border-b border-slate-800 pb-4 flex flex-wrap items-center justify-between gap-3">
            <span className="px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
              {activePart.category}
            </span>
            <div>
              <h4 className="text-xl sm:text-2xl font-black text-white">
                {activePart.name}
              </h4>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{activePart.nameEn}</p>
            </div>
          </div>

          <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1 font-mono">المواصفات التقنية والمواد:</span>
            <span className="text-sm font-semibold text-cyan-300 font-mono">{activePart.specs}</span>
          </div>

          <div>
            <span className="text-xs text-slate-400 font-semibold block mb-1.5 flex items-center gap-1 justify-end">
              <span>الوظيفة الأيروديناميكية والميكانيكية:</span>
              <Info className="w-3.5 h-3.5 text-cyan-400" />
            </span>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
              {activePart.description}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800/80 bg-slate-900/40 p-4 rounded-xl border border-slate-800">
            <span className="text-amber-400 font-bold text-xs block mb-1 flex items-center gap-1.5 justify-end">
              <span>معجزة هندسية فلكية:</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </span>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-light">
              {activePart.engineeringFact}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
