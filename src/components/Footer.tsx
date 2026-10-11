import React from 'react';
import { Rocket, Globe, Shield, Sparkles, ExternalLink, Compass } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#04060c] border-t border-slate-900 py-16 px-4 sm:px-6 lg:px-8 text-right">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        {/* Brand & Mission Statement */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-3 justify-end">
            <div>
              <span className="text-xl font-black text-white block">ثورة الصواريخ: بوابتنا إلى أعماق الكون</span>
              <span className="text-xs text-cyan-400 font-mono">World Space Week • The Rocketry Revolution</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Rocket className="w-5 h-5" />
            </div>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed font-light">
            مبادرة علمية سينمائية تفاعلية تحتفي بأسبوع الفضاء العالمي (4 - 10 أكتوبر)، تسلط الضوء على المعجزات الهندسية ومحركات الدفع الصاروخي التي نقلت الوعي البشري من حدود كوكب الأرض إلى رحاب المجموعة الشمسية.
          </p>
        </div>

        {/* Space Agencies & Principles */}
        <div className="md:col-span-4 space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2 justify-end">
            <span>المرتكزات العلمية والفيزيائية</span>
            <Shield className="w-4 h-4 text-cyan-400" />
          </h4>
          <ul className="text-xs text-slate-400 space-y-2">
            <li className="flex items-center justify-end gap-2">
              <span>محاكاة مدارية مطابقة للبيانات الفلكية المعتمدة (NASA JPL Horizons)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            </li>
            <li className="flex items-center justify-end gap-2">
              <span>حسابات تسيولكوفسكي للدفع الصاروخي وحفظ كمية الحركة</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            </li>
            <li className="flex items-center justify-end gap-2">
              <span>محرك ثلاثي الأبعاد فوري الأداء مبني بـ Three.js و WebGL</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            </li>
          </ul>
        </div>

        {/* Quick Nav */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2 justify-end">
            <span>أقسام التجربة الفضائية</span>
            <Compass className="w-4 h-4 text-cyan-400" />
          </h4>
          <div className="flex flex-col gap-2 text-xs text-slate-400 font-light">
            <a href="#simulation" className="hover:text-cyan-300 transition-colors">المحاكاة ثلاثية الأبعاد للنظام الشمسي</a>
            <a href="#storyboard" className="hover:text-cyan-300 transition-colors">قاعة العرض السينمائي (4 مشاهد)</a>
            <a href="#flight-sim" className="hover:text-cyan-300 transition-colors">غرفة التحكم ومحاكاة الصعود المداري</a>
            <a href="#cutaway" className="hover:text-cyan-300 transition-colors">التشريح الهندسي لعملاق الصواريخ</a>
            <a href="#timeline" className="hover:text-cyan-300 transition-colors">موسوعة الصواريخ وحاسبة تسيولكوفسكي</a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-slate-900 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span>«الأرض هي مهد البشرية، لكن لا يمكن للمرء أن يعيش في المهد إلى الأبد» — قسطنطين تسيولكوفسكي</span>
        </div>
        <div>
          <span>أسبوع الفضاء العالمي • صُمم بدقة هندسية عالية</span>
        </div>
      </div>
    </footer>
  );
};
