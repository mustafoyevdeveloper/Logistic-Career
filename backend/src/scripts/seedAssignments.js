import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectDB from '../config/database.js';
import Assignment from '../models/Assignment.js';
import User from '../models/User.js';
import Lesson from '../models/Lesson.js';

// ES modules uchun __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env faylini backend papkasidan yuklash
dotenv.config({ path: join(__dirname, '../../.env') });

const seedAssignments = async () => {
  try {
    await connectDB();

    // Admin userni topish yoki yaratish
    let admin = await User.findOne({ 
      $or: [
        { email: 'teacheradmin@role.com' },
        { email: 'asliddin913329424@gmail.com' },
        { role: 'admin' }
      ]
    });

    if (!admin) {
      console.log('⚠️ Admin user topilmadi. Iltimos, avval admin login qiling.');
      process.exit(1);
    }

    console.log(`✅ Admin user topildi: ${admin.email}`);

    // Darslarni olish
    const lessons = await Lesson.find().sort({ order: 1 }).lean();
    
    // Darslar bo'lmasa ham testni yaratish mumkin
    if (lessons.length < 7) {
      console.log('⚠️ Kamida 7 ta dars bo\'lishi kerak. Hozirgi darslar soni:', lessons.length);
      console.log('⚠️ Lekin 40 ta test topshirig\'i yaratiladi.');
    }

    // Eski topshiriqlarni o'chirish (ixtiyoriy)
    // await Assignment.deleteMany({});

    // 7 kun uchun 7 ta topshiriq yaratish (faqat darslar bo'lsa)
    const assignments = lessons.length >= 7 ? [
      {
        title: '1-kun topshirig\'i: Logistika asoslari testi',
        description: 'Logistika tushunchalari, dispatcher vazifalari va asosiy hujjatlar haqidagi bilimingizni sinab ko\'ring.',
        type: 'quiz',
        lessonId: lessons[0]._id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 kun keyin
        maxScore: 100,
        questions: [
          {
            question: 'Logistika nima?',
            type: 'multiple-choice',
            options: [
              'Yuklarni bir joydan ikkinchi joyga tashish',
              'Mahsulotlarni saqlash va tarqatish',
              'Yuklarni rejalashtirish, tashish va boshqarish tizimi',
              'Faqat transport xizmatlari'
            ],
            correctAnswer: 'Yuklarni rejalashtirish, tashish va boshqarish tizimi',
            points: 25
          },
          {
            question: 'Dispatcherning asosiy vazifasi nima?',
            type: 'multiple-choice',
            options: [
              'Faqat yuklarni yuklash',
              'Transport vositalarini boshqarish va yuk tashish jarayonini koordinatorlik qilish',
              'Faqat mijozlar bilan muloqot qilish',
              'Faqat hujjatlarni to\'ldirish'
            ],
            correctAnswer: 'Transport vositalarini boshqarish va yuk tashish jarayonini koordinatorlik qilish',
            points: 25
          },
          {
            question: 'CMR hujjati nima uchun ishlatiladi?',
            type: 'multiple-choice',
            options: [
              'Havo transporti uchun',
              'Dengiz transporti uchun',
              'Xalqaro avtomobil yuk tashish uchun',
              'Faqat ichki yuk tashish uchun'
            ],
            correctAnswer: 'Xalqaro avtomobil yuk tashish uchun',
            points: 25
          },
          {
            question: 'Quyidagi transport turlaridan qaysi biri eng tez, lekin eng qimmat?',
            type: 'multiple-choice',
            options: [
              'Avtomobil transporti',
              'Temir yo\'l transporti',
              'Havo transporti',
              'Dengiz transporti'
            ],
            correctAnswer: 'Havo transporti',
            points: 25
          }
        ],
        createdBy: admin._id,
        isActive: true
      },
      {
        title: '2-kun topshirig\'i: Transport turlari va ularning xususiyatlari',
        description: 'Turli transport turlarining afzalliklari va kamchiliklari haqida yozing.',
        type: 'practical',
        lessonId: lessons[1]._id,
        dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 kun keyin
        maxScore: 100,
        questions: [
          {
            question: 'Avtomobil, temir yo\'l, havo va dengiz transportlarining har birining afzalliklari va kamchiliklari nima? Har bir transport turi uchun kamida 2 ta afzallik va 2 ta kamchilik yozing.',
            type: 'text',
            options: [],
            correctAnswer: null,
            points: 100
          }
        ],
        createdBy: admin._id,
        isActive: true
      },
      {
        title: '3-kun topshirig\'i: Yuk tashish hujjatlari testi',
        description: 'CMR, AWB, Bill of Lading va boshqa hujjatlar haqidagi bilimingizni sinab ko\'ring.',
        type: 'quiz',
        lessonId: lessons[2]._id,
        dueDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), // 9 kun keyin
        maxScore: 100,
        questions: [
          {
            question: 'AWB (Air Waybill) hujjati qaysi transport turi uchun ishlatiladi?',
            type: 'multiple-choice',
            options: [
              'Avtomobil transporti',
              'Havo transporti',
              'Dengiz transporti',
              'Temir yo\'l transporti'
            ],
            correctAnswer: 'Havo transporti',
            points: 33
          },
          {
            question: 'Bill of Lading (B/L) hujjati qaysi transport turi uchun ishlatiladi?',
            type: 'multiple-choice',
            options: [
              'Avtomobil transporti',
              'Havo transporti',
              'Dengiz transporti',
              'Temir yo\'l transporti'
            ],
            correctAnswer: 'Dengiz transporti',
            points: 33
          },
          {
            question: 'CMR hujjatida qanday ma\'lumotlar bo\'lishi kerak?',
            type: 'multiple-choice',
            options: [
              'Faqat yukning og\'irligi',
              'Yuk jo\'natuvchisi, oluvchisi, yukning tavsifi, og\'irligi va narxi',
              'Faqat transport kompaniyasi nomi',
              'Faqat yukning narxi'
            ],
            correctAnswer: 'Yuk jo\'natuvchisi, oluvchisi, yukning tavsifi, og\'irligi va narxi',
            points: 34
          }
        ],
        createdBy: admin._id,
        isActive: true
      },
      {
        title: '4-kun topshirig\'i: Bo\'jxona rasmiylashtirish jarayoni',
        description: 'Bo\'jxona rasmiylashtirish jarayoni va zarur hujjatlar haqida batafsil yozing.',
        type: 'practical',
        lessonId: lessons[3]._id,
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 kun keyin
        maxScore: 100,
        questions: [
          {
            question: 'Bo\'jxona rasmiylashtirish jarayonida qanday hujjatlar kerak bo\'ladi? Jarayonni bosqichma-bosqich tushuntiring.',
            type: 'text',
            options: [],
            correctAnswer: null,
            points: 100
          }
        ],
        createdBy: admin._id,
        isActive: true
      },
      {
        title: '5-kun topshirig\'i: Logistika xarajatlari va narxlash',
        description: 'Logistika xarajatlarini hisoblash va narxlash usullari haqida yozing.',
        type: 'practical',
        lessonId: lessons[4]._id,
        dueDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000), // 11 kun keyin
        maxScore: 100,
        questions: [
          {
            question: 'Yuk tashish narxini hisoblashda qanday omillar hisobga olinadi? Masalan: 1000 km masofaga 5 tonna yuk tashish narxini qanday hisoblay olasiz?',
            type: 'text',
            options: [],
            correctAnswer: null,
            points: 100
          }
        ],
        createdBy: admin._id,
        isActive: true
      },
      {
        title: '6-kun topshirig\'i: Mijozlar bilan ishlash senariyasi',
        description: 'Mijozlar bilan muloqot va shikoyatlar bilan ishlash holatlarini hal qiling.',
        type: 'scenario',
        lessonId: lessons[5]._id,
        dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 kun keyin
        maxScore: 100,
        questions: [
          {
            question: 'Senariy: Mijoz sizga murojaat qildi va yukning kechikib yetib kelganidan shikoyat qilmoqda. Siz qanday javob berasiz va muammoni qanday hal qilasiz? Batafsil yozing.',
            type: 'text',
            options: [],
            correctAnswer: null,
            points: 100
          }
        ],
        createdBy: admin._id,
        isActive: true
      },
      {
        title: '7-kun topshirig\'i: Logistika tizimlari va texnologiyalar',
        description: 'Zamonaviy logistika tizimlari va ularning afzalliklari haqida yozing.',
        type: 'practical',
        lessonId: lessons[6]._id,
        dueDate: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000), // 13 kun keyin
        maxScore: 100,
        questions: [
          {
            question: 'TMS (Transport Management System) nima va u qanday afzalliklar beradi? GPS kuzatuv tizimlari logistikada qanday rol o\'ynaydi?',
            type: 'text',
            options: [],
            correctAnswer: null,
            points: 100
          }
        ],
        createdBy: admin._id,
        isActive: true
      }
    ] : [];

    // Xalqaro logistika bo'yicha 40 ta test topshirig'i
    const test40Questions = [
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
        points: 2
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
        points: 2
      },
      {
        question: 'Quyidagilardan qaysi biri logistika tarkibiga kirmaydi?',
        type: 'multiple-choice',
        options: ['Transport', 'Hujjatlar', 'Ombor', 'Marketing dizayn'],
        correctAnswer: 'Marketing dizayn',
        points: 2
      },
      {
        question: 'Qaysi transport eng arzon hisoblanadi?',
        type: 'multiple-choice',
        options: ['Avto', 'Havo', 'Dengiz', 'Temiryo\'l'],
        correctAnswer: 'Dengiz',
        points: 2
      },
      {
        question: 'Dengiz transportining asosiy kamchiligi?',
        type: 'multiple-choice',
        options: ['Qimmat', 'Sekin', 'Yuk sig\'imi kam', 'Xavfli'],
        correctAnswer: 'Sekin',
        points: 2
      },
      {
        question: 'Eng tez transport turi qaysi?',
        type: 'multiple-choice',
        options: ['Temiryo\'l', 'Dengiz', 'Avto', 'Havo'],
        correctAnswer: 'Havo',
        points: 2
      },
      {
        question: '"Door to door" qaysi transportga xos?',
        type: 'multiple-choice',
        options: ['Dengiz', 'Avtomobil', 'Havo', 'Temiryo\'l'],
        correctAnswer: 'Avtomobil',
        points: 2
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
        points: 2
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
        points: 2
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
        points: 2
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
        points: 2
      },
      {
        question: 'Tent Mega maksimal hajmi qancha bo\'lishi mumkin?',
        type: 'multiple-choice',
        options: ['80 kub', '90 kub', '100 kub', '110 kub'],
        correctAnswer: '110 kub',
        points: 2
      },
      {
        question: 'REF fura qaysi yuklar uchun?',
        type: 'multiple-choice',
        options: ['Qurilish', 'Metall', 'Tez buziladigan yuklar', 'Texnika'],
        correctAnswer: 'Tez buziladigan yuklar',
        points: 2
      },
      {
        question: 'Muzlatilgan go\'sht uchun REF harorati?',
        type: 'multiple-choice',
        options: ['+10°C', '0°C', '–5°C', '–18°C'],
        correctAnswer: '–18°C',
        points: 2
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
        points: 2
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
        points: 2
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
        points: 2
      },
      {
        question: 'Ploshadka fura qanday bo\'ladi?',
        type: 'multiple-choice',
        options: ['Yon devorli', 'Sovutkichli', 'Ochiq platforma', 'Tentli'],
        correctAnswer: 'Ochiq platforma',
        points: 2
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
        points: 2
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
        points: 2
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
        points: 2
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
        points: 2
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
        points: 2
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
        points: 2
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
        points: 2
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
        points: 2
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
        points: 2
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
        points: 2
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
        points: 2
      },
      {
        question: 'Dazvol nimani anglatadi?',
        type: 'multiple-choice',
        options: ['Yo\'lga ruxsat', 'To\'lov', 'Ombor', 'Marshrut'],
        correctAnswer: 'Yo\'lga ruxsat',
        points: 2
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
        points: 2
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
        points: 2
      },
      {
        question: 'Yuk shablonida nechta asosiy band bor?',
        type: 'multiple-choice',
        options: ['5', '6', '7', '8'],
        correctAnswer: '8',
        points: 2
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
        points: 2
      },
      {
        question: '"Наличи" nima?',
        type: 'multiple-choice',
        options: ['Bank', 'Karta', 'Naqd pul', 'Chek'],
        correctAnswer: 'Naqd pul',
        points: 2
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
        points: 2
      },
      {
        question: 'Yuk og\'irligi shablonda qanday ko\'rsatiladi?',
        type: 'multiple-choice',
        options: ['Kub', 'Dona', 'Tonna', 'Litr'],
        correctAnswer: 'Tonna',
        points: 2
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
        points: 2
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
        points: 2
      }
    ];

    // Mavjud 40 ta test topshirig'ini topish yoki yaratish
    const existingTest = await Assignment.findOne({ 
      title: '📘 XALQARO LOGISTIKA BO\'YICHA 40 TA TEST' 
    });

    const test40Assignment = {
      title: '📘 XALQARO LOGISTIKA BO\'YICHA 40 TA TEST',
      description: 'Xalqaro logistika, transport turlari, hujjatlar va dispecherlik bo\'yicha bilimingizni sinab ko\'ring. Barcha 40 ta savolga javob bering.',
      type: 'quiz',
      lessonId: lessons.length > 0 ? lessons[0]._id : null, // Birinchi darsga bog'lash
      moduleId: null,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 kun keyin
      maxScore: 40, // Har biri 1 ball
      questions: test40Questions,
      createdBy: admin._id,
      isActive: true
    };

    if (existingTest) {
      // Mavjud testni yangilash
      await Assignment.findByIdAndUpdate(existingTest._id, {
        ...test40Assignment,
        _id: existingTest._id // ID ni saqlash
      });
      console.log('✅ 40 ta test topshirig\'i yangilandi!');
      console.log(`   Test ID: ${existingTest._id}`);
      console.log(`   Savollar soni: ${test40Questions.length}`);
      console.log(`   Har bir savol: 1 ball (Jami: ${test40Assignment.maxScore} ball)`);
    } else {
      // Yangi test yaratish
      const createdTest40 = await Assignment.create(test40Assignment);
      console.log('✅ 40 ta test topshirig\'i muvaffaqiyatli yaratildi!');
      console.log(`   Test ID: ${createdTest40._id}`);
      console.log(`   Savollar soni: ${test40Questions.length}`);
      console.log(`   Har bir savol: 1 ball (Jami: ${test40Assignment.maxScore} ball)`);
    }
    
    // Agar darslar bo'lsa, boshqa topshiriqlarni ham yaratish
    if (lessons.length >= 7) {
      const createdAssignments = await Assignment.insertMany(assignments);
      console.log('✅ ' + assignments.length + ' ta topshiriq muvaffaqiyatli yaratildi!');
      createdAssignments.forEach((assignment, index) => {
        console.log(`${index + 1}. ${assignment.title}`);
      });
    } else {
      console.log('⚠️ Qolgan topshiriqlar yaratilmadi (darslar yetarli emas).');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed xatosi:', error);
    process.exit(1);
  }
};

seedAssignments();
