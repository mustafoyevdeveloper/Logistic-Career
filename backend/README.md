# Logistika O'quv Markazi Backend API

Bu loyiha logistika o'quv markazi uchun AI-asosli ta'lim platformasining backend qismidir.

## Texnologiyalar

- **Node.js** + **Express.js** - Server framework
- **MongoDB** + **Mongoose** - Database
- **JWT** - Autentifikatsiya
- **OpenAI API** - AI chat va baholash
- **Cloudflare** - CDN va hosting

## O'rnatish

### 1. Dependencies o'rnatish

```bash
cd backend
npm install
```

### 2. Environment variables

`.env.example` faylini `.env` ga ko'chiring va ma'lumotlarni to'ldiring:

```bash
cp .env.example .env
```

`.env` faylini ochib, quyidagi ma'lumotlarni to'ldiring:

```env
PORT=5000
NODE_ENV=development

# MongoDB (Cloudflare + MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/logistic-career?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Frontend
FRONTEND_URL=http://localhost:8080
```

### 3. Server ishga tushirish

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

## API Endpoints

### Autentifikatsiya

- `POST /api/auth/register` - Ro'yxatdan o'tish
- `POST /api/auth/login` - Kirish
- `GET /api/auth/me` - Joriy foydalanuvchi
- `PUT /api/auth/profile` - Profil yangilash
- `PUT /api/auth/password` - Parol o'zgartirish

### Darsliklar

- `GET /api/lessons/modules` - Barcha modullar
- `GET /api/lessons/:id` - Bitta dars
- `POST /api/lessons/:id/complete` - Darsni tugatish
- `PUT /api/lessons/:id/progress` - Progress yangilash

### AI Chat

- `POST /api/chat/session` - Chat sessiyasi yaratish
- `POST /api/chat/message` - Xabar yuborish
- `GET /api/chat/history` - Chat tarixi
- `GET /api/chat/students/:studentId` - O'quvchi chatlari (Teacher)
- `PUT /api/chat/:messageId/feedback` - Izoh qoldirish (Teacher)

### Topshiriqlar

- `GET /api/assignments` - Barcha topshiriqlar
- `GET /api/assignments/:id` - Bitta topshiriq
- `POST /api/assignments` - Topshiriq yaratish (Teacher)
- `POST /api/assignments/:id/submit` - Topshiriq yuborish (Student)
- `PUT /api/assignments/:id/grade` - Baholash (Teacher)
- `GET /api/assignments/student/:studentId` - O'quvchi topshiriqlari (Teacher)
- `GET /api/assignments/:id/submissions` - Yuborilmalar (Teacher)

### Foydalanuvchilar

- `GET /api/users/students` - Barcha o'quvchilar (Teacher)
- `GET /api/users/students/:id` - Bitta o'quvchi (Teacher)
- `GET /api/users/groups` - Guruhlar (Teacher)

## Database Models

### User
- email, password, firstName, lastName
- role (student/teacher)
- group, progress, currentLevel

### Lesson
- title, description, duration, level
- moduleId, order, topics

### LessonModule
- title, description, order

### StudentProgress
- studentId, lessonId, moduleId
- completed, score, timeSpent

### ChatMessage
- studentId, lessonId, role, content
- sessionId, aiModel, tokens

### Assignment
- title, description, type, dueDate
- questions, createdBy

### AssignmentSubmission
- assignmentId, studentId, answers
- status, score, feedback

## Autentifikatsiya

Barcha protected route'lar uchun header'da token yuborish kerak:

```
Authorization: Bearer <token>
```

## Xatoliklar

API quyidagi formatda javob qaytaradi:

```json
{
  "success": false,
  "message": "Xatolik xabari"
}
```

## Development

- Server: `http://localhost:5000`
- API Base: `http://localhost:5000/api`
- Health Check: `http://localhost:5000/api/health`

## Production Deployment

1. MongoDB Atlas'da database yarating
2. Cloudflare'da domain sozlang
3. Environment variables'ni production qiymatlariga o'zgartiring
4. Server'ni deploy qiling (Vercel, Railway, yoki boshqa platforma)

