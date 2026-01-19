import { LessonModule } from '@/types';

export const lessonModules: LessonModule[] = [
  {
    id: 'module-1',
    title: 'Asosiy bilimlar',
    description: '0 darajadan boshlang\'ich darajaga',
    progress: 0,
    lessons: [
      {
        id: 'lesson-1-1',
        title: 'Logistika nima?',
        description: 'Logistika tushunchasi, tarixi va zamonaviy ahamiyati haqida umumiy ma\'lumot.',
        duration: '25 daqiqa',
        level: 'beginner',
        order: 1,
        isCompleted: false,
        isLocked: false,
        topics: ['Logistika tarixi', 'Asosiy tushunchalar', 'Logistika turlari'],
      },
      {
        id: 'lesson-1-2',
        title: 'Xalqaro logistika tushunchasi',
        description: 'Xalqaro savdo va logistika bog\'liqligi, global ta\'minot zanjirlari.',
        duration: '30 daqiqa',
        level: 'beginner',
        order: 2,
        isCompleted: false,
        isLocked: true,
        topics: ['Global savdo', 'Import/Eksport', 'Bojxona jarayonlari'],
      },
      {
        id: 'lesson-1-3',
        title: 'Transport turlari',
        description: 'Truck, Rail, Sea, Air - har bir transport turining afzalliklari va kamchiliklari.',
        duration: '35 daqiqa',
        level: 'beginner',
        order: 3,
        isCompleted: false,
        isLocked: true,
        topics: ['Avtomobil transporti', 'Temir yo\'l', 'Dengiz transporti', 'Havo transporti'],
      },
      {
        id: 'lesson-1-4',
        title: 'Logistik zanjir (Supply Chain)',
        description: 'Ta\'minot zanjiri tushunchasi va uning komponentlari.',
        duration: '40 daqiqa',
        level: 'beginner',
        order: 4,
        isCompleted: false,
        isLocked: true,
        topics: ['Supply Chain', 'Inventar boshqaruvi', 'Yetkazib berish'],
      },
    ],
  },
  {
    id: 'module-2',
    title: 'Amaliy logistika',
    description: 'Real logistik jarayonlar bilan ishlash',
    progress: 0,
    lessons: [
      {
        id: 'lesson-2-1',
        title: 'Buyurtma qabul qilish',
        description: 'Mijozlardan buyurtma qabul qilish va qayta ishlash jarayoni.',
        duration: '30 daqiqa',
        level: 'intermediate',
        order: 1,
        isCompleted: false,
        isLocked: true,
        topics: ['Order management', 'Mijoz bilan munosabat', 'Hujjatlashtirish'],
      },
      {
        id: 'lesson-2-2',
        title: 'Yuk ma\'lumotlari bilan ishlash',
        description: 'Yuk turlari, o\'lchamlari va xususiyatlari bilan ishlash.',
        duration: '35 daqiqa',
        level: 'intermediate',
        order: 2,
        isCompleted: false,
        isLocked: true,
        topics: ['Freight classes', 'Dimensions', 'Weight calculations'],
      },
      {
        id: 'lesson-2-3',
        title: 'Marshrut rejalashtirish',
        description: 'Optimal marshrut tanlash va vaqt rejalashtirish.',
        duration: '40 daqiqa',
        level: 'intermediate',
        order: 3,
        isCompleted: false,
        isLocked: true,
        topics: ['Route optimization', 'ETA hisoblash', 'Fuel efficiency'],
      },
      {
        id: 'lesson-2-4',
        title: 'Broker, Shipper, Carrier',
        description: 'Logistika ishtirokchilarining roli va vazifalar.',
        duration: '35 daqiqa',
        level: 'intermediate',
        order: 4,
        isCompleted: false,
        isLocked: true,
        topics: ['Freight broker', 'Shipper', 'Carrier', 'Consignee'],
      },
    ],
  },
  {
    id: 'module-3',
    title: 'Dispetcherlik darajasi',
    description: 'Professional dispetcher bo\'lish yo\'li',
    progress: 0,
    lessons: [
      {
        id: 'lesson-3-1',
        title: 'Load board bilan ishlash',
        description: 'DAT, Truckstop va boshqa load boardlardan foydalanish.',
        duration: '45 daqiqa',
        level: 'advanced',
        order: 1,
        isCompleted: false,
        isLocked: true,
        topics: ['DAT', 'Truckstop', 'Load posting', 'Searching loads'],
      },
      {
        id: 'lesson-3-2',
        title: 'Carrier bilan muzokara',
        description: 'Professional muzokara usullari va rate kelishuvi.',
        duration: '50 daqiqa',
        level: 'advanced',
        order: 2,
        isCompleted: false,
        isLocked: true,
        topics: ['Negotiation skills', 'Rate confirmation', 'Carrier vetting'],
      },
      {
        id: 'lesson-3-3',
        title: 'Rate Confirmation',
        description: 'Rate confirmation hujjatini to\'g\'ri tuzish va yuborish.',
        duration: '35 daqiqa',
        level: 'advanced',
        order: 3,
        isCompleted: false,
        isLocked: true,
        topics: ['RC template', 'Terms and conditions', 'Accessorials'],
      },
      {
        id: 'lesson-3-4',
        title: 'Tracking va Problem Solving',
        description: 'Yuklarni kuzatish va muammolarni hal qilish.',
        duration: '45 daqiqa',
        level: 'advanced',
        order: 4,
        isCompleted: false,
        isLocked: true,
        topics: ['GPS tracking', 'Check calls', 'Claims handling', 'Problem resolution'],
      },
    ],
  },
];

export const getLevelColor = (level: string) => {
  switch (level) {
    case 'beginner':
      return 'bg-success/10 text-success';
    case 'intermediate':
      return 'bg-warning/10 text-warning';
    case 'advanced':
      return 'bg-primary/10 text-primary';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export const getLevelLabel = (level: string) => {
  switch (level) {
    case 'beginner':
      return 'Boshlang\'ich';
    case 'intermediate':
      return 'O\'rta';
    case 'advanced':
      return 'Yuqori';
    default:
      return level;
  }
};
