import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectDB from '../config/database.js';
import LessonModule from '../models/LessonModule.js';
import Lesson from '../models/Lesson.js';

// ES modules uchun __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env faylini backend papkasidan yuklash
dotenv.config({ path: join(__dirname, '../../.env') });

const seedModules = async () => {
  try {
    await connectDB();

    // Eski ma'lumotlarni tozalash
    await LessonModule.deleteMany({});
    await Lesson.deleteMany({});

    // Bitta modul: 7 kunlik darslar kursi
    const mainModule = await LessonModule.create({
      title: 'Logistika kursi',
      description: '7 kunlik logistika asoslari kursi',
      order: 1,
    });

    // 7 ta dars yaratish (order 1 dan 7 gacha)
    await Lesson.create([
      {
        title: 'Logistika asoslari, tushunchalar va hujjatlar bilan tanishish',
        description: 'Logistika nima, dispatcher nima, logistika turlari, asosiy hujjatlar va ularning maqsadlari, transport turlari va ularning xususiyatlari.',
        duration: '2 soat',
        level: 'beginner',
        order: 1,
        moduleId: mainModule._id,
        topics: ['Logistika tushunchasi', 'Dispatcher vazifalari', 'Logistika turlari', 'Asosiy hujjatlar', 'Transport turlari'],
      },
      {
        title: 'Xalqaro logistika va transport turlari',
        description: 'Xalqaro logistika asoslari, transport turlari (avtomobil, temir yo\'l, havo, dengiz), ularning afzalliklari va kamchiliklari.',
        duration: '2 soat',
        level: 'beginner',
        order: 2,
        moduleId: mainModule._id,
        topics: ['Xalqaro logistika', 'Avtomobil transporti', 'Temir yo\'l transporti', 'Havo transporti', 'Dengiz transporti'],
      },
      {
        title: 'Yuk tashish hujjatlari va shartnomalar',
        description: 'CMR, AWB, Bill of Lading kabi asosiy hujjatlar, shartnoma tuzish, yuk tashish shartlari va javobgarlik masalalari.',
        duration: '2 soat',
        level: 'intermediate',
        order: 3,
        moduleId: mainModule._id,
        topics: ['CMR', 'AWB', 'Bill of Lading', 'Shartnomalar', 'Javobgarlik'],
      },
      {
        title: 'Bo\'jxona va rasmiylashtirish',
        description: 'Bo\'jxona rasmiylashtirish jarayoni, zarur hujjatlar, bojxona to\'lovlari va qoidalari, import-export operatsiyalari.',
        duration: '2 soat',
        level: 'intermediate',
        order: 4,
        moduleId: mainModule._id,
        topics: ['Bo\'jxona rasmiylashtirish', 'Zarur hujjatlar', 'Bojxona to\'lovlari', 'Import-export'],
      },
      {
        title: 'Logistika xarajatlari va narxlash',
        description: 'Logistika xarajatlari turlari, narxlash usullari, xarajatlarni hisoblash, rentabellik va foyda koeffitsiyentlari.',
        duration: '2 soat',
        level: 'intermediate',
        order: 5,
        moduleId: mainModule._id,
        topics: ['Xarajatlar turlari', 'Narxlash usullari', 'Xarajatlarni hisoblash', 'Rentabellik'],
      },
      {
        title: 'Mijozlar bilan ishlash va muloqot',
        description: 'Mijozlar bilan muloqot qilish, shikoyatlar bilan ishlash, xizmat ko\'rsatish standartlari, mijozlar bilan munosabatlar.',
        duration: '2 soat',
        level: 'advanced',
        order: 6,
        moduleId: mainModule._id,
        topics: ['Mijozlar bilan muloqot', 'Shikoyatlar bilan ishlash', 'Xizmat standartlari', 'Munosabatlar'],
      },
      {
        title: 'Logistika tizimlari va texnologiyalar',
        description: 'Zamonaviy logistika tizimlari, TMS (Transport Management System), GPS kuzatuv, raqamli logistika va avtomatlashtirish.',
        duration: '2 soat',
        level: 'advanced',
        order: 7,
        moduleId: mainModule._id,
        topics: ['Logistika tizimlari', 'TMS', 'GPS kuzatuv', 'Raqamli logistika', 'Avtomatlashtirish'],
      },
    ]);

    console.log('✅ Seed data muvaffaqiyatli yaratildi!');
    console.log(`✅ ${(await Lesson.countDocuments({}))} ta dars yaratildi`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed xatosi:', error);
    process.exit(1);
  }
};

seedModules();

