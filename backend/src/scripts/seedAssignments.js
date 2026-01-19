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
    
    if (lessons.length < 7) {
      console.log('⚠️ Kamida 7 ta dars bo\'lishi kerak. Hozirgi darslar soni:', lessons.length);
      process.exit(1);
    }

    // Eski topshiriqlarni o'chirish (ixtiyoriy)
    // await Assignment.deleteMany({});

    // 7 kun uchun 7 ta topshiriq yaratish
    const assignments = [
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
    ];

    // Topshiriqlarni yaratish
    const createdAssignments = await Assignment.insertMany(assignments);

    console.log('✅ 7 ta topshiriq muvaffaqiyatli yaratildi!');
    createdAssignments.forEach((assignment, index) => {
      console.log(`${index + 1}. ${assignment.title}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed xatosi:', error);
    process.exit(1);
  }
};

seedAssignments();
