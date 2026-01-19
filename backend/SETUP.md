# Backend Setup Qo'llanmasi

## 1. Environment Variables Sozlash

`.env` fayli yaratildi. Endi quyidagi ma'lumotlarni to'ldiring:

### MongoDB Connection String

Sizga MongoDB connection string kerak. Ikki variant:

#### Variant 1: MongoDB Atlas (Tavsiya etiladi - Cloud)

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) ga kiring
2. Free cluster yarating
3. Database Access'da user yarating
4. Network Access'da IP manzilingizni qo'shing (yoki 0.0.0.0/0 - barcha IP'lar uchun)
5. Connect > Connect your application
6. Connection string ni oling

Misol:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/logistic-career?retryWrites=true&w=majority
```

#### Variant 2: Local MongoDB

Agar local MongoDB o'rnatgan bo'lsangiz:

```bash
# Windows'da MongoDB service ishga tushirilgan bo'lishi kerak
MONGODB_URI=mongodb://localhost:27017/logistic-career
```

### OpenAI API Key

1. [OpenAI Platform](https://platform.openai.com/api-keys) ga kiring
2. API key yarating
3. `.env` faylida `OPENAI_API_KEY` ni to'ldiring

```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 2. .env Faylini To'ldirish

`.env` faylini ochib, quyidagilarni to'ldiring:

```env
# MongoDB - o'z connection string'ingizni kiriting
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/logistic-career?retryWrites=true&w=majority

# OpenAI - o'z API key'ingizni kiriting
OPENAI_API_KEY=sk-your-openai-api-key-here

# JWT Secret - production'da o'zgartiring
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## 3. Database Seed (Darsliklarni yaratish)

`.env` faylini to'ldirgandan keyin:

```bash
npm run seed
```

Bu quyidagilarni yaratadi:
- 3 ta modul
- 12 ta dars
- Barcha darsliklar va mavzular

## 4. Server Ishga Tushirish

```bash
# Development
npm run dev

# Production
npm start
```

## 5. Tekshirish

Server ishga tushgandan keyin:

```bash
# Health check
curl http://localhost:5000/api/health
```

Javob:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-..."
}
```

## Xatoliklar

### "MONGODB_URI topilmadi" xatosi

`.env` faylida `MONGODB_URI` to'g'ri sozlanganligini tekshiring:

```bash
cd backend
cat .env | grep MONGODB_URI
```

### MongoDB connection xatosi

1. MongoDB Atlas'da cluster ishlayotganligini tekshiring
2. Network Access'da IP manzilingiz qo'shilganligini tekshiring
3. Username va password to'g'ri ekanligini tekshiring

### OpenAI API xatosi

1. API key to'g'ri ekanligini tekshiring
2. API key'da pul mavjudligini tekshiring
3. API key faol ekanligini tekshiring

