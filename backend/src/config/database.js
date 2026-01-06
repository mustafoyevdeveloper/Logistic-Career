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
      console.error('📝 Iltimos, backend/.env faylini yarating va MONGODB_URI ni to\'ldiring.');
      console.error('📄 Misol: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/logistic-career');
      process.exit(1);
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

