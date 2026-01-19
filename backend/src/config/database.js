import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// ES modules uchun __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env faylini backend papkasidan yuklash
dotenv.config({ path: join(__dirname, '../../.env') });

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('❌ Xatolik: MONGODB_URI topilmadi!');
      console.error('📝 Iltimos, .env faylini yarating va MONGODB_URI ni to\'ldiring.');
      console.error('📄 Misol: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/logistic-career');
      // Production'da server'ni yopmaslik, faqat xatolikni log qilish
      if (process.env.NODE_ENV === 'production') {
        console.error('⚠️ Production mode: Server ishga tushmoqda, lekin database ulanmadi');
        return;
      }
      process.exit(1);
    }

    console.log('🔄 MongoDB ga ulanishga harakat qilmoqda...');
    console.log(`📡 Connection string: ${process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@')}`); // Parolni yashirish

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000, // 30 soniya timeout (DNS uchun ko'proq vaqt)
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000, // Connection timeout
      retryWrites: true,
      w: 'majority',
      maxPoolSize: 10, // Connection pool size
      minPoolSize: 1,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Database connection xatoliklarini handle qilish
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected. Reconnecting...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    
    // Xatolik turlarini aniqlash va tavsiyalar berish
    if (error.message.includes('ECONNREFUSED') || error.message.includes('querySrv')) {
      console.error('\n💡 Yechim tavsiyalari:');
      console.error('1. MongoDB Atlas Network Access sozlamalarini tekshiring');
      console.error('2. IP manzilingizni whitelist\'ga qo\'shing (yoki 0.0.0.0/0)');
      console.error('3. Internet ulanishini tekshiring');
      console.error('4. MongoDB Atlas cluster ishlamoqda ekanligini tekshiring');
    } else if (error.message.includes('authentication failed')) {
      console.error('\n💡 Yechim tavsiyalari:');
      console.error('1. MongoDB Atlas Database Access\'da user va parolni tekshiring');
      console.error('2. Connection string\'dagi username va password to\'g\'ri ekanligini tekshiring');
    } else if (error.message.includes('timeout')) {
      console.error('\n💡 Yechim tavsiyalari:');
      console.error('1. Internet ulanishini tekshiring');
      console.error('2. Firewall sozlamalarini tekshiring');
      console.error('3. MongoDB Atlas cluster ishlamoqda ekanligini tekshiring');
    }
    
    // Production'da server'ni yopmaslik, faqat xatolikni log qilish
    if (process.env.NODE_ENV === 'production') {
      console.error('⚠️ Production mode: Server ishga tushmoqda, lekin database ulanmadi');
      return;
    }
    process.exit(1);
  }
};

export default connectDB;

