export interface PlanetData {
  id: string;
  name: string;
  nameEn: string;
  arabicSubtitle: string;
  color: string;
  emissiveColor: string;
  size: number; // scaled for 3D view
  realDiameterKm: number;
  distanceFromSunAU: number;
  distanceFromSunKmMillion: number;
  orbitRadius: number; // visual scale
  orbitSpeed: number; // relative orbital speed
  rotationSpeed: number;
  gravity: number; // m/s^2
  dayLengthHours: number;
  yearLengthDays: number;
  surfaceTempC: string;
  hasRings?: boolean;
  texturePattern: 'rocky' | 'dense-gas' | 'earth' | 'rust' | 'gas-bands' | 'ice-gas';
  atmosphere: string;
  explorationHistory: {
    firstFlyby: string;
    keyMissions: string[];
    rocketryRole: string;
  };
  scientificFact: string;
}

export const PLANETS: PlanetData[] = [
  {
    id: 'mercury',
    name: 'عطارد',
    nameEn: 'Mercury',
    arabicSubtitle: 'الكوكب الصخري الأقرب للشمس',
    color: '#9ca3af',
    emissiveColor: '#374151',
    size: 0.9,
    realDiameterKm: 4879,
    distanceFromSunAU: 0.39,
    distanceFromSunKmMillion: 57.9,
    orbitRadius: 18,
    orbitSpeed: 0.04,
    rotationSpeed: 0.004,
    gravity: 3.7,
    dayLengthHours: 1407.6,
    yearLengthDays: 88,
    surfaceTempC: '-180 إلى 430 م°',
    texturePattern: 'rocky',
    atmosphere: 'غلاف جوي خارجي رقيق جداً (إكسوسفير) من الأكسجين والصوديوم والهيليوم.',
    explorationHistory: {
      firstFlyby: '1974 (مسبار مارينر 10)',
      keyMissions: ['مارينر 10 (1974)', 'ماسنجر MESSENGER (2011)', 'بيبيكولومبو BepiColombo (2025)'],
      rocketryRole: 'تطلب الوصول إليه صواريخ ذات كفاءة إفلات عالية ومناورات فرملة مدارية مستمرة لمقاومة جاذبية الشمس الهائلة.'
    },
    scientificFact: 'يواجه عطارد أشد تباين حراري بين ليله ونهاره في النظام الشمسي بأكمله، حيث تنخفض الحرارة ليلاً إلى -180° مئوية.'
  },
  {
    id: 'venus',
    name: 'الزهرة',
    nameEn: 'Venus',
    arabicSubtitle: 'الجحيم الكبريتي وتوأم الأرض القاسي',
    color: '#eab308',
    emissiveColor: '#78350f',
    size: 1.5,
    realDiameterKm: 12104,
    distanceFromSunAU: 0.72,
    distanceFromSunKmMillion: 108.2,
    orbitRadius: 26,
    orbitSpeed: 0.03,
    rotationSpeed: -0.002, // rotates clockwise
    gravity: 8.87,
    dayLengthHours: 5832.5,
    yearLengthDays: 224.7,
    surfaceTempC: '465 م° (ثابتة)',
    texturePattern: 'dense-gas',
    atmosphere: '96.5% ثنائي أكسيد الكربون، وسحب كثيفة من حمض الكبريتيك بضغط يعادل 92 ضعف ضغط الأرض.',
    explorationHistory: {
      firstFlyby: '1962 (مارينر 2)',
      keyMissions: ['فينيرا 7 و 9 (الاتحاد السوفيتي)', 'ماجلان (ناسا)', 'أكاتسوكي (اليابان)'],
      rocketryRole: 'أول كوكب تهبط عليه مركبة من صنع البشر، متحدية ضغطاً ساحقاً يذيب الرصاص بفضل الدروع الحرارية الفضائية.'
    },
    scientificFact: 'يدور كوكب الزهرة في الاتجاه المعاكس لغالبية كواكب المجموعة الشمسية، بحيث تشرق الشمس هناك من الغرب وتغرب في الشرق.'
  },
  {
    id: 'earth',
    name: 'الأرض',
    nameEn: 'Earth',
    arabicSubtitle: 'واحة الحياة والمهد الصاروخي للبشرية',
    color: '#38bdf8',
    emissiveColor: '#0369a1',
    size: 1.6,
    realDiameterKm: 12742,
    distanceFromSunAU: 1.0,
    distanceFromSunKmMillion: 149.6,
    orbitRadius: 36,
    orbitSpeed: 0.02,
    rotationSpeed: 0.02,
    gravity: 9.807,
    dayLengthHours: 24,
    yearLengthDays: 365.25,
    surfaceTempC: 'متوسط 15 م° (-89 إلى 58)',
    texturePattern: 'earth',
    atmosphere: '78% نيتروجين، 21% أكسجين، 1% غازات أخرى، مع طبقة أوزون تحمي من الإشعاعات.',
    explorationHistory: {
      firstFlyby: 'نقطة الانطلاق (سبوتنيك 1، 1957)',
      keyMissions: ['أبولو 11 (الهبوط على القمر 1969)', 'محطة الفضاء الدولية (ISS)', 'تلسكوب جيمس ويب'],
      rocketryRole: 'احتاج الإنسان لمحركات تولد سرعة إفلات 11.2 كم/ثانية للتحرر من أسر الجاذبية والانطلاق للمجرة.'
    },
    scientificFact: 'تتحرك الأرض بسرعة مدارية حول الشمس تبلغ 107,200 كم/ساعة، حارسةً مهد الحضارة والتقنية الصاروخية.'
  },
  {
    id: 'mars',
    name: 'المريخ',
    nameEn: 'Mars',
    arabicSubtitle: 'الكوكب الأحمر والوجهة القادمة لرواد الفضاء',
    color: '#ef4444',
    emissiveColor: '#991b1b',
    size: 1.1,
    realDiameterKm: 6779,
    distanceFromSunAU: 1.52,
    distanceFromSunKmMillion: 227.9,
    orbitRadius: 48,
    orbitSpeed: 0.016,
    rotationSpeed: 0.019,
    gravity: 3.72,
    dayLengthHours: 24.6,
    yearLengthDays: 687,
    surfaceTempC: '-65 م° متوسط (-140 إلى 20)',
    texturePattern: 'rust',
    atmosphere: 'غلاف جوي رقيق مؤلف من 95% ثنائي أكسيد الكربون، وضغط يمثل 1% فقط من أرضنا.',
    explorationHistory: {
      firstFlyby: '1965 (مارينر 4)',
      keyMissions: ['فايكنغ 1 و 2', 'كوريوسيتي وبيرسيفيرانس', 'مسبار الأمل الإماراتي (2021)'],
      rocketryRole: 'المقصد الأساسي لمنظومة Starship ومستقبل الاستيطان البشري المستقل عن كوكب الأرض.'
    },
    scientificFact: 'يحتضن المريخ جبل أوليمبوس، أكبر بركان معروف في المجموعة الشمسية، بارتفاع يناهز 22 كم فوق السطح.'
  },
  {
    id: 'jupiter',
    name: 'المشتري',
    nameEn: 'Jupiter',
    arabicSubtitle: 'عملاق الغاز وحارس النظام الشمسي',
    color: '#fbbf24',
    emissiveColor: '#b45309',
    size: 3.2,
    realDiameterKm: 139820,
    distanceFromSunAU: 5.2,
    distanceFromSunKmMillion: 778.5,
    orbitRadius: 65,
    orbitSpeed: 0.009,
    rotationSpeed: 0.04,
    gravity: 24.79,
    dayLengthHours: 9.9,
    yearLengthDays: 4333,
    surfaceTempC: '-110 م° في السحب الخارجية',
    texturePattern: 'gas-bands',
    atmosphere: '90% هيدروجين، 10% هيليوم، مع عواصف إعصارية عملاقة كالقعة الحمراء الكبرى.',
    explorationHistory: {
      firstFlyby: '1973 (بيونير 10)',
      keyMissions: ['فوياجر 1 و 2', 'غاليليو (1995)', 'جونو Juno (2016)', 'مركبة JUICE الأوروبية'],
      rocketryRole: 'استُخدمت جاذبيته الهائلة كمقلاع جاذبي (Gravity Assist) لتسريع الصواريخ نحو أطراف المنظومة الشمسية.'
    },
    scientificFact: 'تبلغ كتلة المشتري مرتين ونصف ضعف كتلة جميع كواكب المجموعة الشمسية الأخرى مجتمعة.'
  },
  {
    id: 'saturn',
    name: 'زحل',
    nameEn: 'Saturn',
    arabicSubtitle: 'درة الكواكب بحلقاته الثلجية الفاتنة',
    color: '#fef08a',
    emissiveColor: '#a16207',
    size: 2.7,
    realDiameterKm: 116460,
    distanceFromSunAU: 9.58,
    distanceFromSunKmMillion: 1434.0,
    orbitRadius: 82,
    orbitSpeed: 0.006,
    rotationSpeed: 0.038,
    gravity: 10.44,
    dayLengthHours: 10.7,
    yearLengthDays: 10759,
    surfaceTempC: '-140 م°',
    hasRings: true,
    texturePattern: 'dense-gas',
    atmosphere: 'هيدروجين وهيليوم، وتتكون حلقاته من تريليونات الجسيمات الجليدية والصخور الفضائية.',
    explorationHistory: {
      firstFlyby: '1979 (بيونير 11)',
      keyMissions: ['فوياجر 1 و 2', 'كاسيني-هويجنز (2004 - 2017)', 'مهمة دراغونفلاي المستقبلية لتيتان'],
      rocketryRole: 'أوصل مسبار كاسيني مجس هويجنز للهبوط على سطح قمره "تيتان"، أبعد عملية هبوط نفذها الإنسان.'
    },
    scientificFact: 'كثافة كوكب زحل الإجمالية أقل من كثافة الماء؛ لو وجد محيط هائل بما يكفي لاحتوائه لطفى فوق سطحه!'
  },
  {
    id: 'uranus',
    name: 'أورانوس',
    nameEn: 'Uranus',
    arabicSubtitle: 'العملاق الجليدي المائل بزاوية 98 درجة',
    color: '#67e8f9',
    emissiveColor: '#0e7490',
    size: 2.0,
    realDiameterKm: 50724,
    distanceFromSunAU: 19.22,
    distanceFromSunKmMillion: 2871.0,
    orbitRadius: 100,
    orbitSpeed: 0.004,
    rotationSpeed: -0.025,
    gravity: 8.69,
    dayLengthHours: 17.2,
    yearLengthDays: 30687,
    surfaceTempC: '-195 م° (أبرد كوكب)',
    texturePattern: 'ice-gas',
    atmosphere: 'هيدروجين وهيليوم مع وفرة من غاز الميثان الذي يمنحه لونه الفيروزي المميز.',
    explorationHistory: {
      firstFlyby: '1986 (فوياجر 2)',
      keyMissions: ['فوياجر 2 (المسبار الوحيد الذي زاره)', 'أولوية قصوى لبعثات المسابير العقد القادم'],
      rocketryRole: 'تتطلب الرحلة إليه صواريخ فائقة السرعة مع رحلة سفر فضائية تستغرق نحو 9 إلى 12 عاماً.'
    },
    scientificFact: 'يدور أورانوس على جنبه بميل محوري قدره 98 درجة، وكأنه كرة تتدحرج في مدارها حول الشمس.'
  },
  {
    id: 'neptune',
    name: 'نبتون',
    nameEn: 'Neptune',
    arabicSubtitle: 'حارس التخوم الكونية وعواصف الرياح الأسرع',
    color: '#3b82f6',
    emissiveColor: '#1d4ed8',
    size: 1.9,
    realDiameterKm: 49244,
    distanceFromSunAU: 30.05,
    distanceFromSunKmMillion: 4495.0,
    orbitRadius: 118,
    orbitSpeed: 0.003,
    rotationSpeed: 0.028,
    gravity: 11.15,
    dayLengthHours: 16.1,
    yearLengthDays: 60190,
    surfaceTempC: '-200 م°',
    texturePattern: 'ice-gas',
    atmosphere: 'ميثان ومركبات هيدروكربونية تولد رياحاً تفوق سرعتها 2,100 كم/ساعة (أسرع من سرعة الصوت).',
    explorationHistory: {
      firstFlyby: '1989 (فوياجر 2)',
      keyMissions: ['فوياجر 2 فقط حتى الآن'],
      rocketryRole: 'رمز التحدي لتقنيات الدفع الأيوني والنووي للوصول إلى أقصى أطراف المنظومة الشمسية.'
    },
    scientificFact: 'يستغرق نبتون قرابة 165 سنة أرضية ليكمل دورة واحدة فقط حول الشمس.'
  }
];

export interface StoryboardScene {
  id: number;
  stageNumber: string;
  title: string;
  subtitle: string;
  narrative: string;
  themeGradient: string;
  accentGlow: string;
  telemetry: {
    altitude: string;
    velocity: string;
    acceleration: string;
    systemStatus: string;
    engineBurnRate: string;
  };
  keyVisualDescription: string;
}

export const STORYBOARD_SCENES: StoryboardScene[] = [
  {
    id: 1,
    stageNumber: 'المرحلة 01',
    title: 'سكون المنصة وانبعاث الأبخرة المبردة',
    subtitle: 'T-Minus 00:02:00 | الهدوء المهيب قبل الزئير الكوني',
    narrative: `تحت جنح الظلام الدامس في قاعدة الإطلاق الفضائية، تقف ناطحة السحاب الصاروخية كبرج من الصلب والسبائك المتقدمة. يلف المنصة صمتٌ خاشع تقطعه فقط صفارات الإنذار البعيدة. تنبعث سحب البخار الأبيض الكثيف من صمامات تنفيس الأكسجين السائل المبرد لدرجة -183 مئوية والهيدروجين فائق البرودة، مشكّلة هالة ضبابية سينمائية تلامس الأضواء الكاشفة العملاقة. الأنظمة الحيوية في ذروة الاستعداد، وعداد الثواني يتناقص نحو لحظة التاريخ.`,
    themeGradient: 'from-slate-950 via-slate-900 to-cyan-950',
    accentGlow: '#06b6d4',
    telemetry: {
      altitude: '0.00 كم (منصة الإطلاق LC-39A)',
      velocity: '0.00 كم/ساعة (سكون مطلق)',
      acceleration: '1.0 G (الجاذبية الأرضية القياسية)',
      systemStatus: 'أنظمة التبريد والتغذية مؤمنة 100%',
      engineBurnRate: '0 كغ/ثانية (جاهز للشرارة الأولى)'
    },
    keyVisualDescription: 'برج الإطلاق الليلي، أعمدة البخار الأبيض الكثيف المنبعث، أضواء كاشفة خارقة للظلام، بدن الصاروخ المتجمد.'
  },
  {
    id: 2,
    stageNumber: 'المرحلة 02',
    title: 'لحظة الاشتعال: شواظ البلازما وكسر الجاذبية',
    subtitle: 'T+ 00:00:45 | زئير المحركات وقهر قيد الأرض',
    narrative: `في جزء من الثانية، تنفجر حجرات الاحتراق بضغط يتجاوز 250 باراً! تنطلق نفاثات البلازما الزرقاء الفوق صوتية مع لهب برتقالي ساطع يضيء الأفق الليلي كشمس اصطناعية وليدة. يرتجف الهواء وتتحول ملايين اللترات من المياه أسفل المنصة إلى طوفان بخاري ممتص للصدمات. يتحرر الصاروخ من مشابك التثبيت العملاقة، ليتصاعد في عمود من النار الخالصة، كاسراً حاجز الصوت وممزقاً طبقات الغلاف الجوي الكثيفة في طريقه إلى الفضاء.`,
    themeGradient: 'from-slate-950 via-amber-950/70 to-blue-950',
    accentGlow: '#f97316',
    telemetry: {
      altitude: '18.4 كم (طبقة الستراتوسفير)',
      velocity: '2,850 كم/ساعة (ماخ 2.3)',
      acceleration: '3.4 G (ضغط تسارع تصاعدي)',
      systemStatus: 'المرحلة الأولى تعمل بأقصى دفع (Max-Q)',
      engineBurnRate: '12,500 كغ/ثانية (وقود سائل مشتعل)'
    },
    keyVisualDescription: 'لهب هيدروكربوني برتقالي وأزرق متلألئ، ماسات صدمية (Shock Diamonds) في نفاث اللهب، انشقاق السحب ليلاً.'
  },
  {
    id: 3,
    stageNumber: 'المرحلة 03',
    title: 'العبور الصامت بمحاذاة فوهات القمر',
    subtitle: 'T+ 03:14:00 | هدوء المدار الشاحب وتضاريس التابع الفضي',
    narrative: `تنطفئ محركات المرحلة المعززة ويسود صمت كوني مطلق. تنفصل حجرة القيادة لتبحر المركبة في مدار انتقالي بيضاوي شاحب. من نافذة الكبسولة المصنوعة من زجاج الكوارتز، تبرز تضاريس القمر المهيبة: فوهات بركانية عملاقة نحتتها النيازك على مدى مليارات السنين، وظلال سوداء قاطعة لعدم وجود غلاف جوي يشتت الضوء. في الخلفية، تبدو كرتنا الأرضية الزرقاء كهشيم رخامي وادع يطفو وحيداً في ظلمات اللانهاية.`,
    themeGradient: 'from-slate-950 via-zinc-900 to-sky-950',
    accentGlow: '#e0e7ff',
    telemetry: {
      altitude: '384,400 كم (مدار لونا الانتقالي)',
      velocity: '38,900 كم/ساعة (مسار عودة حر)',
      acceleration: '0.0 G (انعدام وزن تام Microgravity)',
      systemStatus: 'محركات المناورة المدارية RCS نشطة',
      engineBurnRate: 'دفعات نبضية دقيقة للتوجيه'
    },
    keyVisualDescription: 'تضاريس فوهات القمر الفضية الساحرة، انعكاس ضوء الأرض الأزرق، تباين الظلال الحادة في الفراغ.'
  },
  {
    id: 4,
    stageNumber: 'المرحلة 04',
    title: 'الإبحار السحيق بين السدم وتخوم المجرات',
    subtitle: 'T+ 12:00:00 Deep Space | نحو ما وراء الأبدية',
    narrative: `تتخطى المركبة الفضائية نطاق المشتري وزحل، مخترقة حزام كايبر نحو فضاء ما بين النجوم. هنا لا حدود للزمان والمكان البشريين. تتراقص سحب السدم الهيدروجينية بألوان البنفسجي واللازوردي والزمردي المشع، محتضنةً نجومًا وليدة تشرق لأول مرة. أصبحت الصواريخ ليست مجرد آلات ميكانيكية، بل هي سفن وعي كوني أطلقتها البشرية لتكون رسالة خلود تحمل جينات الفضول الإنساني عبر النجوم والمجرات السحيقة.`,
    themeGradient: 'from-slate-950 via-purple-950/80 to-blue-950',
    accentGlow: '#a855f7',
    telemetry: {
      altitude: 'أكثر من 22 مليار كم (الفضاء البين-نجمي)',
      velocity: '61,200 كم/ساعة (سرعة فوياجر الكونية)',
      acceleration: '0.001 G (دفع أيوني مستمر)',
      systemStatus: 'هوائي الاتصال العميق DSN يرسل بيانات علمية',
      engineBurnRate: '0.0003 كغ/ثانية (غاز زينون متأين)'
    },
    keyVisualDescription: 'سدم كونية غازية بألوان البنفسجي والأرجواني، حقول نجوم فائقة الكثافة، وهج المحرك الأيوني الأزرق الخافت.'
  }
];

export interface RocketTech {
  id: string;
  name: string;
  era: string;
  agencyOrCompany: string;
  heightMeters: number;
  diameterMeters: number;
  liftoffThrustKN: number;
  payloadToLEOKg: number;
  stages: number;
  fuelType: string;
  achievement: string;
  highlightText: string;
}

export const ROCKET_TIMELINE: RocketTech[] = [
  {
    id: 'saturn-v',
    name: 'ساتورن 5 (Saturn V)',
    era: '1967 - 1973',
    agencyOrCompany: 'ناسا (NASA)',
    heightMeters: 110.6,
    diameterMeters: 10.1,
    liftoffThrustKN: 34500, // 34.5 MN
    payloadToLEOKg: 140000,
    stages: 3,
    fuelType: 'كيروسين RP-1 + أكسجين سائل (LOX) / هيدروجين سائل',
    achievement: 'حمل رواد فضاء برنامج أبولو إلى القمر، وظل أضخم صاروخ ناجح لعدة عقود دون أي فشل كارثي أثناء الطيران.',
    highlightText: 'محركات F-1 الخمسة في مرحلته الأولى كانت تحرق 15 طناً من الوقود كل ثانية واحدة!'
  },
  {
    id: 'space-shuttle',
    name: 'المكوك الفضائي (Space Shuttle)',
    era: '1981 - 2011',
    agencyOrCompany: 'ناسا (NASA)',
    heightMeters: 56.1,
    diameterMeters: 8.4,
    liftoffThrustKN: 30160,
    payloadToLEOKg: 27500,
    stages: 2, // معززات صلبة + خزان خارجي
    fuelType: 'وقود صلب للمُعززات + هيدروجين سائل للمحركات الرئيسية SSME',
    achievement: 'أول مركبة فضائية مدارية قابلة لإعادة الاستخدام الجزئي؛ بنى محطة الفضاء الدولية ونشر تلسكوب هابل.',
    highlightText: 'شكّل طفرة في نقل الحمولات الضخمة وصيانة التلسكوبات الفضائية في المدار مباشرة.'
  },
  {
    id: 'falcon-9',
    name: 'فالكون 9 (Falcon 9 Full Thrust)',
    era: '2015 - الآن',
    agencyOrCompany: 'سبيس إكس (SpaceX)',
    heightMeters: 70.0,
    diameterMeters: 3.7,
    liftoffThrustKN: 7607,
    payloadToLEOKg: 22800,
    stages: 2,
    fuelType: 'كيروسين مبرد RP-1 + أكسجين سائل فائق التبريد',
    achievement: 'أحدث ثورة تاريخية عبر الهبوط العمودي الذاتي للمرحلة الأولى، وخفض تكلفة الكيلوغرام للمدار بنسبة تفوق 70%.',
    highlightText: 'أثبت أن الصواريخ يمكن إعادة إطلاقها أكثر من 20 مرة تماماً كالطائرات التجارية.'
  },
  {
    id: 'starship',
    name: 'ستارشيب (Starship & Super Heavy)',
    era: '2023 - الحاضر والمستقبل',
    agencyOrCompany: 'سبيس إكس (SpaceX)',
    heightMeters: 121.0,
    diameterMeters: 9.0,
    liftoffThrustKN: 74500, // 74.5 MN - most powerful ever
    payloadToLEOKg: 150000,
    stages: 2, // قابلة لإعادة الاستخدام الكامل 100%
    fuelType: 'ميثالوكس (ميثان سائل CH4 + أكسجين سائل LOX)',
    achievement: 'أقوى وأكبر منظومة إطلاق فضائي شُيدت في تاريخ البشرية؛ مصممة لنقل 100 راكب وبناء مستعمرات على المريخ والقمر.',
    highlightText: 'تستخدم 33 محرك رابتور تعمل بدورة الاحتراق التدريجي الكامل للغازات (Full-Flow Staged Combustion).'
  },
  {
    id: 'deep-space-propulsion',
    name: 'الدفع النووي والأيوني (NTP & Ion Drives)',
    era: 'آفاق المستقبل (2026+)',
    agencyOrCompany: 'مبادرات ناسا ووكالات الفضاء الدولية',
    heightMeters: 45.0,
    diameterMeters: 6.5,
    liftoffThrustKN: 1200, // نبض نوعي هائل
    payloadToLEOKg: 85000,
    stages: 1, // مرحلة فضاء عميق
    fuelType: 'هيدروجين سائل مسخن بمفاعل انشطاري نووي / ذرات زينون متأينة',
    achievement: 'توليد نبض نوعي (Isp) يتجاوز 900-3000 ثانية؛ يقلص زمن الرحلة إلى المريخ من 9 أشهر إلى 3 أشهر فقط.',
    highlightText: 'المفتاح التكنولوجي الحقيقي الذي سيجعل السفر بين النجوم والمحيطات الجليدية في أقمار المشتري أمراً ممكناً.'
  }
];

export const HERO_STATS = [
  { label: 'سرعة الإفلات المدارية', value: '11.2 كم/ث', sub: 'السرعة اللازمة للهروب من جاذبية الأرض' },
  { label: 'أقصى قوة دفع مسجلة', value: '74.5 ميغانيوتن', sub: 'قوة منظومة Starship Super Heavy' },
  { label: 'درجة حرارة حجرة الاحتراق', value: '3,300+ م°', sub: 'تفوق حرارة صهر فولاذ المنصات' },
  { label: 'كفاءة إعادة الاستخدام', value: '100% مستهدفة', sub: 'خفض كلفة النقل الفضائي إلى 1%' }
];
