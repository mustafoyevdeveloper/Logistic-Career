# Asliddin Logistic - Veb Sayt Strukturasi

## Umumiy Ma'lumot

**Asliddin Logistic** - bu logistika sohasidagi o'quv markazi uchun yaratilgan AI-asosli ta'lim platformasi. Sayt **full-stack** dastur bo'lib, ikki qismdan iborat:
- **Backend** (Server qismi) - Node.js + Express + MongoDB
- **Frontend** (Foydalanuvchi interfeysi) - React + TypeScript + Vite

---

## 📁 Loyiha Strukturasi

```
Asliddin Logistic/
├── backend/          # Server qismi (Node.js)
├── frontend/         # Foydalanuvchi interfeysi (React)
└── README.md         # Asosiy loyiha hujjati
```

---

## 🔧 Backend Strukturasi

### Asosiy Papkalar va Fayllar

#### 1. **src/server.js** - Serverning asosiy kirish nuqtasi
- Express server'ni ishga tushiradi
- MongoDB'ga ulanadi
- CORS sozlamalarini boshqaradi
- Barcha API route'larini ulaydi
- Port: 5000 (default)

#### 2. **src/config/database.js** - Ma'lumotlar bazasi ulanishi
- MongoDB'ga ulanish funksiyasi
- Xatoliklarni boshqarish
- Production va Development rejimlarini qo'llab-quvvatlaydi

#### 3. **src/models/** - Ma'lumotlar bazasi modellari (9 ta fayl)
- **User.js** - Foydalanuvchilar (student, teacher, admin)
- **Lesson.js** - Darslar
- **LessonModule.js** - Dars modullari
- **Assignment.js** - Topshiriqlar
- **AssignmentSubmission.js** - Topshiriq javoblari
- **ChatMessage.js** - AI chat xabarlari
- **Group.js** - O'quv guruhlari
- **Notification.js** - Bildirishnomalar
- **StudentProgress.js** - O'quvchi progressi

#### 4. **src/controllers/** - Business logic (8 ta fayl)
- **authController.js** - Autentifikatsiya (login, register, logout)
- **userController.js** - Foydalanuvchi boshqaruvi
- **studentController.js** - O'quvchi boshqaruvi
- **lessonController.js** - Darslar boshqaruvi
- **assignmentController.js** - Topshiriqlar boshqaruvi
- **chatController.js** - AI chat boshqaruvi
- **groupController.js** - Guruhlar boshqaruvi
- **notificationController.js** - Bildirishnomalar boshqaruvi

#### 5. **src/routes/** - API endpoint'lar (8 ta fayl)
- **authRoutes.js** - `/api/auth/*` - Autentifikatsiya route'lari
- **userRoutes.js** - `/api/users/*` - Foydalanuvchi route'lari
- **studentRoutes.js** - `/api/students/*` - O'quvchi route'lari
- **lessonRoutes.js** - `/api/lessons/*` - Dars route'lari
- **assignmentRoutes.js** - `/api/assignments/*` - Topshiriq route'lari
- **chatRoutes.js** - `/api/chat/*` - Chat route'lari
- **groupRoutes.js** - `/api/groups/*` - Guruh route'lari
- **notificationRoutes.js** - `/api/notifications/*` - Bildirishnoma route'lari

#### 6. **src/middleware/** - Orqa qatlam funksiyalari
- **auth.js** - Token tekshiruvi va ruxsat berish
- **errorHandler.js** - Xatoliklarni boshqarish
- **validation.js** - Ma'lumotlar validatsiyasi

#### 7. **src/services/** - Tashqi xizmatlar
- **aiService.js** - OpenAI API integratsiyasi (AI chat uchun)

#### 8. **src/utils/** - Yordamchi funksiyalar
- **generateToken.js** - JWT token yaratish

#### 9. **src/scripts/** - Skriptlar
- **seedData.js** - Dastlabki ma'lumotlarni yuklash

### Backend Texnologiyalari
- **Express.js** - Web framework
- **MongoDB + Mongoose** - Ma'lumotlar bazasi
- **JWT** (jsonwebtoken) - Autentifikatsiya
- **bcryptjs** - Parol hash qilish
- **OpenAI** - AI chat funksiyasi
- **CORS** - Cross-origin so'rovlar
- **dotenv** - Environment variables

---

## 🎨 Frontend Strukturasi

### Asosiy Papkalar va Fayllar

#### 1. **src/main.tsx** - Dasturning kirish nuqtasi
- React ilovasini DOM'ga render qiladi

#### 2. **src/App.tsx** - Asosiy komponent
- React Router sozlamalari
- Route'lar tuzilishi
- Protected route'lar (himoyalangan sahifalar)
- Auth context provider

#### 3. **src/pages/** - Sahifalar (19 ta fayl)

**Umumiy sahifalar:**
- **LandingPage.tsx** - Bosh sahifa
- **LoginPage.tsx** - Kirish sahifasi
- **NotFound.tsx** - 404 sahifa

**O'quvchi sahifalari (student/):**
- **StudentDashboard.tsx** - O'quvchi boshqaruv paneli
- **LessonsPage.tsx** - Darslar ro'yxati
- **LessonDetailPage.tsx** - Dars tafsilotlari
- **AIChatPage.tsx** - AI chat sahifasi
- **AssignmentsPage.tsx** - Topshiriqlar sahifasi
- **ProfilePage.tsx** - Profil sahifasi

**O'qituvchi sahifalari (teacher/):**
- **TeacherDashboard.tsx** - O'qituvchi boshqaruv paneli
- **LessonsPage.tsx** - Darslar boshqaruvi
- **LessonDetailPage.tsx** - Dars tafsilotlari
- **StudentsPage.tsx** - O'quvchilar ro'yxati
- **GroupsPage.tsx** - Guruhlar boshqaruvi
- **AssignmentsPage.tsx** - Topshiriqlar boshqaruvi
- **ProfilePage.tsx** - Profil sahifasi
- **SettingsPage.tsx** - Sozlamalar sahifasi

#### 4. **src/components/** - Qayta ishlatiladigan komponentlar (54 ta fayl)

**Asosiy komponentlar:**
- **layout/DashboardLayout.tsx** - Dashboard layout
- **Logo.tsx** - Logo komponenti
- **NavLink.tsx** - Navigatsiya linki
- **CreateStudentDialog.tsx** - O'quvchi yaratish dialogi
- **StudentBlockedMessage.tsx** - Bloklangan o'quvchi xabari

**UI komponentlari (ui/):**
- **button.tsx** - Tugma
- **input.tsx** - Input maydoni
- **card.tsx** - Karta
- **dialog.tsx** - Dialog oyna
- **table.tsx** - Jadval
- **form.tsx** - Forma
- **toast.tsx** - Xabar ko'rsatish
- va boshqa 40+ komponent (shadcn/ui kutubxonasi)

#### 5. **src/contexts/** - Context API
- **AuthContext.tsx** - Autentifikatsiya holati boshqaruvi

#### 6. **src/services/** - API xizmatlari
- **api.ts** - Backend API bilan aloqa funksiyalari
  - Fallback mexanizmi (bir nechta backend URL'lar)
  - Avtomatik backend topish
  - Token boshqaruvi
  - Device ID tracking

#### 7. **src/hooks/** - Custom React hook'lar
- Device ID boshqaruvi

#### 8. **src/types/** - TypeScript tiplari
- **index.ts** - Barcha interface va type'lar

#### 9. **src/utils/** - Yordamchi funksiyalar
- Device ID yaratish va saqlash

#### 10. **src/data/** - Statik ma'lumotlar
- Dastlabki ma'lumotlar

### Frontend Texnologiyalari
- **React 18** - UI kutubxonasi
- **TypeScript** - Type-safe dasturlash
- **Vite** - Build tool va dev server
- **React Router** - Routing
- **TanStack Query** - Server state boshqaruvi
- **shadcn/ui** - UI komponentlar kutubxonasi
- **Tailwind CSS** - CSS framework
- **Radix UI** - Accessible komponentlar
- **React Hook Form** - Form boshqaruvi
- **Zod** - Schema validatsiyasi
- **Sonner** - Toast notifications

---

## 🔐 Autentifikatsiya va Ruxsatlar

### Foydalanuvchi Rollari
1. **Student** (O'quvchi)
   - Darslarni ko'rish va o'rganish
   - AI chat'dan foydalanish
   - Topshiriqlarni bajarish
   - Progress kuzatish

2. **Teacher** (O'qituvchi)
   - O'quvchilarni boshqarish
   - Darslar yaratish va tahrirlash
   - Topshiriqlar yaratish
   - Guruhlar boshqaruvi
   - O'quvchilar statistikasini ko'rish

3. **Admin** (Administrator)
   - Barcha teacher funksiyalari
   - Qo'shimcha admin funksiyalari

### Xavfsizlik Mexanizmlari
- JWT token autentifikatsiyasi
- Parol hash qilish (bcrypt)
- Device ID tracking (o'quvchilar uchun)
- CORS sozlamalari
- Protected routes
- Role-based access control

---

## 📊 Ma'lumotlar Bazasi Strukturasi

### Asosiy Collection'lar (MongoDB)

1. **users** - Foydalanuvchilar
   - Email, parol, ism, familiya
   - Role (student/teacher/admin)
   - Progress, level
   - Device tracking (student uchun)
   - Stats (statistikalar)

2. **lessons** - Darslar
   - Sarlavha, tavsif, davomiylik
   - Level (boshlang'ich/o'rta/yuqori)
   - Modulga bog'lanish
   - Tartib raqami

3. **lessonmodules** - Dars modullari
   - Modul nomi va tavsifi
   - Darslar ro'yxati

4. **assignments** - Topshiriqlar
   - Sarlavha, tavsif
   - Turi (quiz/practical/scenario)
   - Savollar ro'yxati
   - Muddati

5. **assignmentsubmissions** - Topshiriq javoblari
   - O'quvchi javoblari
   - Ball
   - AI baholash natijalari

6. **chatmessages** - Chat xabarlari
   - Foydalanuvchi va AI xabarlari
   - Timestamp

7. **groups** - O'quv guruhlari
   - Guruh nomi va tavsifi

8. **notifications** - Bildirishnomalar
   - Xabar matni
   - O'qilgan/yo'q holati

9. **studentprogress** - O'quvchi progressi
   - Darsni yakunlash holati
   - Ball
   - Oxirgi kirish vaqti

---

## 🛣️ API Endpoint'lar

### Autentifikatsiya (`/api/auth`)
- `POST /register` - Ro'yxatdan o'tish
- `POST /login` - Kirish (student)
- `POST /admin-login` - Admin/Teacher kirish
- `GET /me` - Joriy foydalanuvchi ma'lumotlari
- `POST /logout` - Chiqish
- `POST /create-student` - O'quvchi yaratish (teacher/admin)

### Darslar (`/api/lessons`)
- `GET /modules` - Barcha modullar
- `GET /student/lessons` - O'quvchi darslari
- `GET /:id` - Dars tafsilotlari
- `POST /:id/complete` - Darsni yakunlash
- `PUT /day/:day/progress` - Progress yangilash
- `POST /day/:day/unlock` - Darsni ochish

### Topshiriqlar (`/api/assignments`)
- `GET /` - Topshiriqlar ro'yxati
- `POST /` - Topshiriq yaratish
- `GET /:id` - Topshiriq tafsilotlari
- `POST /:id/submit` - Topshiriqni yuborish

### Chat (`/api/chat`)
- `POST /` - AI ga xabar yuborish
- `GET /` - Chat tarixi

### O'quvchilar (`/api/students`)
- `GET /` - O'quvchilar ro'yxati
- `PUT /:id/suspend` - O'quvchini bloklash/blokdan olib tashlash
- `DELETE /:id` - O'quvchini o'chirish
- `PUT /:id` - O'quvchi ma'lumotlarini yangilash

### Guruhlar (`/api/groups`)
- `GET /` - Guruhlar ro'yxati
- `POST /` - Guruh yaratish
- `PUT /:id` - Guruhni yangilash
- `DELETE /:id` - Guruhni o'chirish

### Bildirishnomalar (`/api/notifications`)
- `GET /` - Bildirishnomalar ro'yxati
- `PUT /:id/read` - O'qilgan deb belgilash
- `PUT /read-all` - Hammasini o'qilgan deb belgilash

---

## 🎯 Asosiy Funksiyalar

### O'quvchilar uchun:
1. ✅ Darslarni kunlik tartibda ochish (7 kunlik dastur)
2. ✅ Darslarni o'rganish va progress kuzatish
3. ✅ AI chat'dan foydalanish (savollar berish)
4. ✅ Topshiriqlarni bajarish va yuborish
5. ✅ Shaxsiy profil va statistikalar
6. ✅ Device tracking (bir qurilmada kirish)

### O'qituvchilar uchun:
1. ✅ O'quvchilarni boshqarish (yaratish, tahrirlash, bloklash)
2. ✅ Guruhlar yaratish va boshqarish
3. ✅ Darslar va modullarni ko'rish
4. ✅ Topshiriqlar yaratish va baholash
5. ✅ O'quvchilar statistikasini ko'rish
6. ✅ Bildirishnomalar yuborish
7. ✅ Sozlamalar boshqaruvi

### AI Funksiyalari:
1. ✅ OpenAI integratsiyasi
2. ✅ Chat bot (o'quvchilar savollariga javob berish)
3. ✅ Topshiriqlarni avtomatik baholash (AI grading)

---

## 🚀 Deployment

### Backend Deployment
- **Platform**: Render.com
- **URL**: https://logistic-career.onrender.com
- **Port**: 5000
- **Database**: MongoDB Atlas

### Frontend Deployment
- **Platform**: Vercel
- **URL**: https://logistic-career.vercel.app
- **Build tool**: Vite
- **Environment**: Production

### Environment Variables

**Backend (.env):**
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT token secret
- `OPENAI_API_KEY` - OpenAI API kaliti
- `PORT` - Server porti
- `FRONTEND_URL` - Frontend URL'lar (CORS uchun)

**Frontend (.env):**
- `VITE_API_BASE_URL` - Backend API URL'i

---

## 📝 Qo'shimcha Ma'lumotlar

### CORS Sozlamalari
- Bir nechta frontend URL'lar qo'llab-quvvatlanadi
- Vercel preview URL'lar avtomatik qo'llab-quvvatlanadi
- Development va Production rejimlari

### Fallback Mexanizmi
- Frontend bir nechta backend URL'larni sinab ko'radi
- Agar bir backend ishlamasa, boshqasiga o'tadi
- Ishlayotgan backend URL localStorage'da saqlanadi

### Device Tracking
- Har bir o'quvchi bir qurilmada kirishi mumkin
- Device ID localStorage'da saqlanadi
- Backend'da device ma'lumotlari kuzatiladi

---

## 🔄 Ishlash Jarayoni

1. **Foydalanuvchi kirish** → Login sahifasi
2. **Autentifikatsiya** → JWT token olish
3. **Dashboard** → Role'ga qarab sahifa ochiladi
4. **Darslar/Topshiriqlar** → Ma'lumotlar API orqali yuklanadi
5. **AI Chat** → OpenAI API orqali javob olinadi
6. **Progress** → Real-time yangilanadi

---

## 📚 Texnologik Stack Xulosasi

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- OpenAI API

**Frontend:**
- React 18 + TypeScript
- Vite
- React Router
- TanStack Query
- shadcn/ui + Tailwind CSS

**Deployment:**
- Backend: Render.com
- Frontend: Vercel
- Database: MongoDB Atlas

---

Bu sayt **logistika o'quv markazi** uchun to'liq funksional ta'lim platformasi bo'lib, o'quvchilar va o'qituvchilar uchun barcha zarur funksiyalarni ta'minlaydi.
