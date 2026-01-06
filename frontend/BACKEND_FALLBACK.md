# Backend Fallback Mexanizmi

## Qanday Ishlaydi?

Frontend endi avtomatik ravishda bir nechta backend URL'larni sinab ko'radi va ishlayotganini topadi:

1. **Birinchi urinish:** Environment variable'dan URL (`VITE_API_BASE_URL`)
2. **Ikkinchi urinish:** Production backend (Render.com): `https://logistic-career.onrender.com/api`
3. **Uchinchi urinish:** Local development: `http://localhost:5000/api`

## Avtomatik O'zgarish

- Agar birinchi backend ishlamasa, avtomatik ikkinchisiga o'tadi
- Ishlayotgan backend URL localStorage'da saqlanadi (session davomida)
- Har bir so'rovda avtomatik tekshiriladi

## Qanday Ishlaydi?

### 1. Birinchi So'rov

```javascript
// Avval joriy URL'ni sinab ko'radi
POST https://logistic-career.onrender.com/api/auth/admin-login
```

### 2. Agar Xatolik Bo'lsa

```javascript
// Barcha backend URL'larni sinab ko'radi
1. https://logistic-career.onrender.com/api/health
2. http://localhost:5000/api/health
```

### 3. Ishlayotgan Backend Topilganda

```javascript
// Ishlayotgan URL'ni saqlaydi va keyingi so'rovlar uchun ishlatadi
localStorage.setItem('logistic_career_api_url', 'https://logistic-career.onrender.com/api')
```

## Xatoliklar

### Network Xatoliklar
- `Failed to fetch`
- `NetworkError`
- `CORS policy`
- `TypeError`

Bu xatoliklar bo'lganda, avtomatik boshqa backend'ga o'tadi.

### Backend Xatoliklar (400, 401, 403, 404)
Bu xatoliklar backend ishlayotganini ko'rsatadi, lekin so'rov noto'g'ri.
Fallback ishlamaydi, chunki backend ishlayapti.

## Development Mode

Development mode'da console'da log'lar ko'rsatiladi:

```
⚠️ Backend ishlamayapti: https://logistic-career.onrender.com/api, boshqa backend'ni sinab ko'ryapman...
✅ Yangi backend topildi: http://localhost:5000/api
```

## Production Mode

Production mode'da log'lar yashiriladi (foydalanuvchi uchun ko'rinmaydi).

## Manual Sozlash

Agar manual ravishda backend URL'ni o'zgartirmoqchi bo'lsangiz:

```javascript
import { apiService } from '@/services/api';

// Joriy backend URL'ni olish
console.log(apiService.getCurrentBackendUrl());

// Barcha mavjud backend URL'larni olish
console.log(apiService.getAvailableBackendUrls());
```

## Environment Variables

Vercel'da `VITE_API_BASE_URL` ni sozlash ixtiyoriy, chunki fallback mexanizmi mavjud.

Agar sozlasangiz:
```
VITE_API_BASE_URL=https://logistic-career.onrender.com/api
```

Bu URL birinchi urinish bo'ladi.

## Foydalanish

Hech qanday qo'shimcha kod yozish shart emas! Barcha API so'rovlar avtomatik fallback mexanizmidan foydalanadi.

```javascript
// Oddiy API so'rov - fallback avtomatik ishlaydi
await apiService.login(email, password, 'student');
await apiService.adminLogin(email, password);
await apiService.getStudents();
```

## Tekshirish

Browser Console'da (F12) quyidagilarni ko'rasiz:

**Ishlayotgan backend:**
```
✅ Yangi backend topildi: https://logistic-career.onrender.com/api
```

**Barcha backend'lar ishlamayapti:**
```
❌ Barcha backend URL'lar ishlamayapti: [...]
```

