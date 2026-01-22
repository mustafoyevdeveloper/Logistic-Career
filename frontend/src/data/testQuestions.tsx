// Xalqaro logistika bo'yicha 40 ta test savollari
// Bu testlar TSX faylda HTML ko'rinishida saqlanadi

export interface TestQuestion {
  _id?: string;
  question: string;
  type: 'multiple-choice' | 'text' | 'scenario';
  options?: string[];
  correctAnswer?: string;
  points: number;
}

export const test40Questions: TestQuestion[] = [
  {
    question: 'Xalqaro logistika nima?',
    type: 'multiple-choice',
    options: [
      'Faqat ombor boshqaruvi',
      'Tovarlarni ichki bozor bo\'yicha taqsimlash',
      'Tovarlarni bir davlatdan boshqasiga yetkazish tizimi',
      'Faqat transport haydash'
    ],
    correctAnswer: 'Tovarlarni bir davlatdan boshqasiga yetkazish tizimi',
    points: 1
  },
  {
    question: 'Logistika so\'zi qaysi tildan kelib chiqqan?',
    type: 'multiple-choice',
    options: ['Lotin', 'Yunon', 'Arab', 'Ingliz'],
    correctAnswer: 'Yunon',
    points: 1
  },
  {
    question: 'Xalqaro logistikaning asosiy maqsadi nima?',
    type: 'multiple-choice',
    options: [
      'Ko\'proq hujjat qilish',
      'Eng qimmat yo\'lni tanlash',
      'Tez, arzon va xavfsiz yetkazish',
      'Faqat bojxona ishlari'
    ],
    correctAnswer: 'Tez, arzon va xavfsiz yetkazish',
    points: 1
  },
  {
    question: 'Quyidagilardan qaysi biri logistika tarkibiga kirmaydi?',
    type: 'multiple-choice',
    options: ['Transport', 'Hujjatlar', 'Ombor', 'Marketing dizayn'],
    correctAnswer: 'Marketing dizayn',
    points: 1
  },
  {
    question: 'Qaysi transport eng arzon hisoblanadi?',
    type: 'multiple-choice',
    options: ['Avto', 'Havo', 'Dengiz', 'Temiryo\'l'],
    correctAnswer: 'Dengiz',
    points: 1
  },
  {
    question: 'Dengiz transportining asosiy kamchiligi?',
    type: 'multiple-choice',
    options: ['Qimmat', 'Sekin', 'Yuk sig\'imi kam', 'Xavfli'],
    correctAnswer: 'Sekin',
    points: 1
  },
  {
    question: 'Eng tez transport turi qaysi?',
    type: 'multiple-choice',
    options: ['Temiryo\'l', 'Dengiz', 'Avto', 'Havo'],
    correctAnswer: 'Havo',
    points: 1
  },
  {
    question: '"Door to door" qaysi transportga xos?',
    type: 'multiple-choice',
    options: ['Dengiz', 'Avtomobil', 'Havo', 'Temiryo\'l'],
    correctAnswer: 'Avtomobil',
    points: 1
  },
  {
    question: 'Multimodal transport nima?',
    type: 'multiple-choice',
    options: [
      'Faqat bitta transport',
      'Avto + havo',
      'Bir nechta transport aralashmasi',
      'Faqat temiryo\'l'
    ],
    correctAnswer: 'Bir nechta transport aralashmasi',
    points: 1
  },
  {
    question: 'Tent fura qanday xususiyatga ega?',
    type: 'multiple-choice',
    options: [
      'Sovutkichli',
      'Ochiq platforma',
      'Yon tomoni parda bilan yopilgan',
      'Faqat konteyner uchun'
    ],
    correctAnswer: 'Yon tomoni parda bilan yopilgan',
    points: 1
  },
  {
    question: 'Tent furaning asosiy afzalligi?',
    type: 'multiple-choice',
    options: [
      'Juda arzon',
      'Tez yuklash va tushirish',
      'Sovitish',
      'Hujjatsiz yuradi'
    ],
    correctAnswer: 'Tez yuklash va tushirish',
    points: 1
  },
  {
    question: 'Tent Mega fura nimasi bilan farq qiladi?',
    type: 'multiple-choice',
    options: [
      'Harorati bilan',
      'Hajmi kattaroq',
      'Ochiq bo\'lishi bilan',
      'Faqat shahar ichida'
    ],
    correctAnswer: 'Hajmi kattaroq',
    points: 1
  },
  {
    question: 'Tent Mega maksimal hajmi qancha bo\'lishi mumkin?',
    type: 'multiple-choice',
    options: ['80 kub', '90 kub', '100 kub', '110 kub'],
    correctAnswer: '110 kub',
    points: 1
  },
  {
    question: 'REF fura qaysi yuklar uchun?',
    type: 'multiple-choice',
    options: ['Qurilish', 'Metall', 'Tez buziladigan yuklar', 'Texnika'],
    correctAnswer: 'Tez buziladigan yuklar',
    points: 1
  },
  {
    question: 'Muzlatilgan go\'sht uchun REF harorati?',
    type: 'multiple-choice',
    options: ['+10°C', '0°C', '–5°C', '–18°C'],
    correctAnswer: '–18°C',
    points: 1
  },
  {
    question: 'REF furaning kamchiligi?',
    type: 'multiple-choice',
    options: [
      'Yuk sig\'imi kam',
      'Qimmat va yoqilg\'i ko\'p sarflaydi',
      'Sekin',
      'Faqat ichki yukda ishlaydi'
    ],
    correctAnswer: 'Qimmat va yoqilg\'i ko\'p sarflaydi',
    points: 1
  },
  {
    question: 'Paravoz fura nimani anglatadi?',
    type: 'multiple-choice',
    options: [
      'Bitta fura',
      'Sovutkichli fura',
      'Bir nechta ulangan furalar',
      'Ochiq platforma'
    ],
    correctAnswer: 'Bir nechta ulangan furalar',
    points: 1
  },
  {
    question: 'Paravoz fura ko\'proq qayerda ishlatiladi?',
    type: 'multiple-choice',
    options: [
      'Shahar ichida',
      'Tor yo\'llarda',
      'Keng hududli davlatlarda',
      'Tog\'larda'
    ],
    correctAnswer: 'Keng hududli davlatlarda',
    points: 1
  },
  {
    question: 'Ploshadka fura qanday bo\'ladi?',
    type: 'multiple-choice',
    options: ['Yon devorli', 'Sovutkichli', 'Ochiq platforma', 'Tentli'],
    correctAnswer: 'Ochiq platforma',
    points: 1
  },
  {
    question: 'Ploshadka fura qaysi yuklar uchun qulay?',
    type: 'multiple-choice',
    options: [
      'Meva',
      'Sut mahsulotlari',
      'Notekis va katta yuklar',
      'Dori'
    ],
    correctAnswer: 'Notekis va katta yuklar',
    points: 1
  },
  {
    question: 'CMR hujjati nima?',
    type: 'multiple-choice',
    options: [
      'Ruxsatnoma',
      'Tranzit bojxona hujjati',
      'Avtomobil yuk xati',
      'Bank hujjati'
    ],
    correctAnswer: 'Avtomobil yuk xati',
    points: 1
  },
  {
    question: 'CMR qachon kerak bo\'ladi?',
    type: 'multiple-choice',
    options: [
      'Ichki yukda',
      'Avia yukda',
      'Xalqaro avtomobil yukida',
      'Dengizda'
    ],
    correctAnswer: 'Xalqaro avtomobil yukida',
    points: 1
  },
  {
    question: 'CMRda qaysi ma\'lumot bo\'lmaydi?',
    type: 'multiple-choice',
    options: [
      'Yuk og\'irligi',
      'Mashina ma\'lumoti',
      'Haydovchi maoshi',
      'Yuboruvchi'
    ],
    correctAnswer: 'Haydovchi maoshi',
    points: 1
  },
  {
    question: 'TIR Carnet nima uchun kerak?',
    type: 'multiple-choice',
    options: [
      'Davlatga kirish',
      'Yukni sovitish',
      'Bojxona tranzitini soddalashtirish',
      'To\'lov qilish'
    ],
    correctAnswer: 'Bojxona tranzitini soddalashtirish',
    points: 1
  },
  {
    question: 'TIR Carnet bo\'lsa nima bo\'ladi?',
    type: 'multiple-choice',
    options: [
      'Yuk har chegarada ochiladi',
      'Bojxona to\'lovi olinadi',
      'Yuk ochilmaydi',
      'Yuk bekor qilinadi'
    ],
    correctAnswer: 'Yuk ochilmaydi',
    points: 1
  },
  {
    question: 'TIR qaysi holatda ishlatilmaydi?',
    type: 'multiple-choice',
    options: [
      '2 davlat orqali o\'tsa',
      'Ochiq kuzovda',
      'Avtomobil yukida',
      'Tranzitda'
    ],
    correctAnswer: 'Ochiq kuzovda',
    points: 1
  },
  {
    question: 'Dazvol nima?',
    type: 'multiple-choice',
    options: [
      'Yuk xati',
      'Bojxona deklaratsiyasi',
      'Davlatga kirish ruxsatnomasi',
      'Sug\'urta'
    ],
    correctAnswer: 'Davlatga kirish ruxsatnomasi',
    points: 1
  },
  {
    question: 'Dazvolsiz nima bo\'ladi?',
    type: 'multiple-choice',
    options: [
      'Mashina kira olmaydi',
      'Yuk arzonlashadi',
      'Tez o\'tadi',
      'TIR ishlaydi'
    ],
    correctAnswer: 'Mashina kira olmaydi',
    points: 1
  },
  {
    question: 'CMR nimaning "pasporti"?',
    type: 'multiple-choice',
    options: [
      'Mashinaning',
      'Yukning',
      'Haydovchining',
      'Kompaniyaning'
    ],
    correctAnswer: 'Yukning',
    points: 1
  },
  {
    question: 'TIR nimani beradi?',
    type: 'multiple-choice',
    options: [
      'Ruxsat',
      'Tezkor bojxona o\'tishi',
      'Sovutish',
      'Narx'
    ],
    correctAnswer: 'Tezkor bojxona o\'tishi',
    points: 1
  },
  {
    question: 'Dazvol nimani anglatadi?',
    type: 'multiple-choice',
    options: ['Yo\'lga ruxsat', 'To\'lov', 'Ombor', 'Marshrut'],
    correctAnswer: 'Yo\'lga ruxsat',
    points: 1
  },
  {
    question: 'Dispatcherning asosiy ishi?',
    type: 'multiple-choice',
    options: [
      'Mashina haydash',
      'Yuk topish va tarqatish',
      'Ombor tozalash',
      'Bojxona tekshirish'
    ],
    correctAnswer: 'Yuk topish va tarqatish',
    points: 1
  },
  {
    question: 'Telegram gruppalarda nima tashlanadi?',
    type: 'multiple-choice',
    options: [
      'Mashina reklamalari',
      'Faqat haydovchilar',
      'Yuk e\'lonlari',
      'Video'
    ],
    correctAnswer: 'Yuk e\'lonlari',
    points: 1
  },
  {
    question: 'Yuk shablonida nechta asosiy band bor?',
    type: 'multiple-choice',
    options: ['5', '6', '7', '8'],
    correctAnswer: '8',
    points: 1
  },
  {
    question: '"Перечисление" nima?',
    type: 'multiple-choice',
    options: [
      'Naqd pul',
      'Bank orqali o\'tkazma',
      'Kredit',
      'Valyuta'
    ],
    correctAnswer: 'Bank orqali o\'tkazma',
    points: 1
  },
  {
    question: '"Наличи" nima?',
    type: 'multiple-choice',
    options: ['Bank', 'Karta', 'Naqd pul', 'Chek'],
    correctAnswer: 'Naqd pul',
    points: 1
  },
  {
    question: '"Комбо" to\'lov nima?',
    type: 'multiple-choice',
    options: [
      'Faqat naqd',
      'Faqat bank',
      'Ikkalasi aralash',
      'Kredit'
    ],
    correctAnswer: 'Ikkalasi aralash',
    points: 1
  },
  {
    question: 'Yuk og\'irligi shablonda qanday ko\'rsatiladi?',
    type: 'multiple-choice',
    options: ['Kub', 'Dona', 'Tonna', 'Litr'],
    correctAnswer: 'Tonna',
    points: 1
  },
  {
    question: 'Zatamojka va rastamojka nimani bildiradi?',
    type: 'multiple-choice',
    options: [
      'Yuklash',
      'Tushirish',
      'Bojxona rasmiylashtiruvi',
      'To\'lov'
    ],
    correctAnswer: 'Bojxona rasmiylashtiruvi',
    points: 1
  },
  {
    question: 'Logistika gruppalarida kimlar bo\'ladi?',
    type: 'multiple-choice',
    options: [
      'Faqat haydovchi',
      'Logist, dispecher, mashinalar',
      'Faqat mijoz',
      'Bank xodimi'
    ],
    correctAnswer: 'Logist, dispecher, mashinalar',
    points: 1
  }
];

// Test assignment ma'lumotlari
export const test40AssignmentData = {
  title: '📘 XALQARO LOGISTIKA BO\'YICHA 40 TA TEST',
  description: 'Xalqaro logistika, transport turlari, hujjatlar va dispecherlik bo\'yicha bilimingizni sinab ko\'ring. Barcha 40 ta savolga javob bering.',
  type: 'quiz' as const,
  maxScore: 40,
  questions: test40Questions
};
