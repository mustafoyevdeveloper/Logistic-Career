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

    // Modul 1: Asosiy bilimlar
    const module1 = await LessonModule.create({
      title: 'Asosiy bilimlar',
      description: '0 darajadan boshlang\'ich darajaga',
      order: 1,
    });

    await Lesson.create([
      {
        title: 'Logistika nima?',
        description: 'Logistika tushunchasi, tarixi va zamonaviy ahamiyati haqida umumiy ma\'lumot.',
        duration: '25 daqiqa',
        level: 'beginner',
        order: 1,
        moduleId: module1._id,
        topics: ['Logistika tarixi', 'Asosiy tushunchalar', 'Logistika turlari'],
      },
      {
        title: 'Xalqaro logistika tushunchasi',
        description: 'Xalqaro savdo va logistika bog\'liqligi, global ta\'minot zanjirlari.',
        duration: '30 daqiqa',
        level: 'beginner',
        order: 2,
        moduleId: module1._id,
        topics: ['Global savdo', 'Import/Eksport', 'Bojxona jarayonlari'],
      },
      {
        title: 'Transport turlari',
        description: 'Truck, Rail, Sea, Air - har bir transport turining afzalliklari va kamchiliklari.',
        duration: '35 daqiqa',
        level: 'beginner',
        order: 3,
        moduleId: module1._id,
        topics: ['Avtomobil transporti', 'Temir yo\'l', 'Dengiz transporti', 'Havo transporti'],
      },
      {
        title: 'Logistik zanjir (Supply Chain)',
        description: 'Ta\'minot zanjiri tushunchasi va uning komponentlari.',
        duration: '40 daqiqa',
        level: 'beginner',
        order: 4,
        moduleId: module1._id,
        topics: ['Supply Chain', 'Inventar boshqaruvi', 'Yetkazib berish'],
      },
    ]);

    // Modul 2: Amaliy logistika
    const module2 = await LessonModule.create({
      title: 'Amaliy logistika',
      description: 'Real logistik jarayonlar bilan ishlash',
      order: 2,
    });

    await Lesson.create([
      {
        title: 'Buyurtma qabul qilish',
        description: 'Mijozlardan buyurtma qabul qilish va qayta ishlash jarayoni.',
        duration: '30 daqiqa',
        level: 'intermediate',
        order: 1,
        moduleId: module2._id,
        topics: ['Order management', 'Mijoz bilan munosabat', 'Hujjatlashtirish'],
      },
      {
        title: 'Yuk ma\'lumotlari bilan ishlash',
        description: 'Yuk turlari, o\'lchamlari va xususiyatlari bilan ishlash.',
        duration: '35 daqiqa',
        level: 'intermediate',
        order: 2,
        moduleId: module2._id,
        topics: ['Freight classes', 'Dimensions', 'Weight calculations'],
      },
      {
        title: 'Marshrut rejalashtirish',
        description: 'Optimal marshrut tanlash va vaqt rejalashtirish.',
        duration: '40 daqiqa',
        level: 'intermediate',
        order: 3,
        moduleId: module2._id,
        topics: ['Route optimization', 'ETA hisoblash', 'Fuel efficiency'],
      },
      {
        title: 'Broker, Shipper, Carrier',
        description: 'Logistika ishtirokchilarining roli va vazifalar.',
        duration: '35 daqiqa',
        level: 'intermediate',
        order: 4,
        moduleId: module2._id,
        topics: ['Freight broker', 'Shipper', 'Carrier', 'Consignee'],
      },
    ]);

    // Modul 3: Dispetcherlik darajasi
    const module3 = await LessonModule.create({
      title: 'Dispetcherlik darajasi',
      description: 'Professional dispetcher bo\'lish yo\'li',
      order: 3,
    });

    await Lesson.create([
      {
        title: 'Load board bilan ishlash',
        description: 'DAT, Truckstop va boshqa load boardlardan foydalanish.',
        duration: '45 daqiqa',
        level: 'advanced',
        order: 1,
        moduleId: module3._id,
        topics: ['DAT', 'Truckstop', 'Load posting', 'Searching loads'],
      },
      {
        title: 'Carrier bilan muzokara',
        description: 'Professional muzokara usullari va rate kelishuvi.',
        duration: '50 daqiqa',
        level: 'advanced',
        order: 2,
        moduleId: module3._id,
        topics: ['Negotiation skills', 'Rate confirmation', 'Carrier vetting'],
      },
      {
        title: 'Rate Confirmation',
        description: 'Rate confirmation hujjatini to\'g\'ri tuzish va yuborish.',
        duration: '35 daqiqa',
        level: 'advanced',
        order: 3,
        moduleId: module3._id,
        topics: ['RC template', 'Terms and conditions', 'Accessorials'],
      },
      {
        title: 'Tracking va Problem Solving',
        description: 'Yuklarni kuzatish va muammolarni hal qilish.',
        duration: '45 daqiqa',
        level: 'advanced',
        order: 4,
        moduleId: module3._id,
        topics: ['GPS tracking', 'Check calls', 'Claims handling', 'Problem resolution'],
      },
    ]);

    console.log('✅ Seed data muvaffaqiyatli yaratildi!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed xatosi:', error);
    process.exit(1);
  }
};

seedModules();

