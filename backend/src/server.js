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
import notificationRoutes from './routes/notificationRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';

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
  'https://www.asliddin-logistic.online',
  'https://asliddin-logistic.online',
];

const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim()).concat(defaultOrigins)
  : defaultOrigins;

// Duplicate'larni olib tashlash
const uniqueOrigins = [...new Set(allowedOrigins)];

console.log('🌐 Allowed CORS origins:', uniqueOrigins);
console.log('🌍 Environment:', isProduction ? 'PRODUCTION' : 'DEVELOPMENT');

// CORS sozlamalari - soddalashtirilgan va barqaror
const corsOptions = {
  origin: function (origin, callback) {
    // Agar origin yo'q bo'lsa (masalan, Postman yoki mobile app), ruxsat berish
    if (!origin) {
      return callback(null, true);
    }
    
    // BARCHA Vercel URL'larni qo'llab-quvvatlash
    if (origin.includes('vercel.app') || origin.includes('vercel.com')) {
      return callback(null, true);
    }
    
    // Ruxsat berilgan origin'lar ro'yxatida bo'lsa
    if (uniqueOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Production'da barcha so'rovlarni ruxsat berish (xavfsizlik uchun)
    if (isProduction) {
      return callback(null, true);
    }
    
    // Development'da ham ruxsat berish
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Device-ID', 'Accept'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 hours
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// OPTIONS request'larini to'g'ri handle qilish
app.options('*', cors(corsOptions));
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
app.use('/api/notifications', notificationRoutes);
app.use('/api/media', mediaRoutes);

// Debug: Route'larni tekshirish
console.log('✅ Routes loaded:');
console.log('  - /api/lessons/day/:day (GET)');
console.log('  - /api/lessons/:id (GET)');

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

