import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import lessonRoutes from './routes/lessonRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import userRoutes from './routes/userRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import groupRoutes from './routes/groupRoutes.js';

// Load env vars
dotenv.config();

// Connect to database (async, lekin server ishga tushishi uchun kutmaymiz)
connectDB().catch((error) => {
  console.error('❌ Database connection failed:', error);
  // Server ishga tushishi mumkin, lekin database xatoliklarini handle qilish kerak
});

const app = express();

// Middleware
// CORS sozlamalari - bir nechta origin'lar uchun
const isProduction = process.env.NODE_ENV === 'production';
const defaultOrigins = [
  'http://localhost:8080',
  'http://localhost:5173',
  'https://logistic-career.vercel.app',
  'https://logistic-career-git-main.vercel.app',
  'https://logistic-career-*.vercel.app', // Vercel preview URLs
];

const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim()).concat(defaultOrigins)
  : defaultOrigins;

// Duplicate'larni olib tashlash
const uniqueOrigins = [...new Set(allowedOrigins)];

console.log('🌐 Allowed CORS origins:', uniqueOrigins);
console.log('🌍 Environment:', isProduction ? 'PRODUCTION' : 'DEVELOPMENT');

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (origin.includes('vercel.app') || origin.includes('vercel.com')) {
      return callback(null, true);
    }

    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'x-device-id'
  ],
}));

app.options('*', cors());
    
    // Production'da BARCHA Vercel URL'larni qo'llab-quvvatlash (preview va production)
    if (isProduction && (origin.includes('vercel.app') || origin.includes('vercel.com'))) {
      console.log('✅ Vercel origin allowed (production):', origin);
      return callback(null, true);
    }
    
    // Development'da ham Vercel URL'larni qo'llab-quvvatlash
    if (origin.includes('vercel.app') || origin.includes('vercel.com')) {
      console.log('✅ Vercel origin allowed:', origin);
      return callback(null, true);
    }
    
    console.log('🔍 Request origin:', origin);
    
    // Agar origin ruxsat berilgan ro'yxatda bo'lsa
    if (uniqueOrigins.includes(origin)) {
      console.log('✅ Origin allowed:', origin);
      callback(null, true);
    } else {
      console.log('❌ Origin not allowed:', origin);
      console.log('📋 Allowed origins:', uniqueOrigins);
      // Production'da xatolikni yengilroq qilish - barcha so'rovlarni ruxsat berish
      if (isProduction) {
        console.log('⚠️ Production mode: Allowing origin anyway');
        callback(null, true);
      } else {
        // Development'da ham yengilroq qilish
        console.log('⚠️ Development mode: Allowing origin anyway');
        callback(null, true);
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Device-ID'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 hours
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/groups', groupRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route topilmadi',
  });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Server'ni ishga tushirish
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:8080'}`);
});

// Xatoliklarni handle qilish
server.on('error', (error) => {
  console.error('❌ Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
  }
});

// Process xatoliklarini handle qilish
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Rejection:', error);
  // Server'ni yopmaslik, faqat log qilish
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  // Server'ni yopmaslik, faqat log qilish
});

