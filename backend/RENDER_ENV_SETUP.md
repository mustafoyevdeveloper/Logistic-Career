# Render.com Environment Variables Sozlash

## Muammo

CORS xatosi: `No 'Access-Control-Allow-Origin' header is present`

Bu shuni anglatadiki, backend'da `FRONTEND_URL` environment variable to'g'ri sozlanmagan.

## Yechim: Render.com'da Environment Variable Qo'shish

### 1. Render.com Dashboard'ga kiring

1. [Render.com Dashboard](https://dashboard.render.com) ga kiring
2. `logistic-career` (yoki `logistic-career-backend`) service'ni tanlang

### 2. Environment Variables Qo'shish

1. Service'ni oching
2. **Environment** tab'ni tanlang
3. **"Add Environment Variable"** ni bosing
4. Quyidagi variable'larni qo'shing:

#### FRONTEND_URL (MUHIM!)

**Key:**
```
FRONTEND_URL
```

**Value:**
```
https://logistic-career.vercel.app
```

Yoki bir nechta URL uchun (development va production):
```
https://logistic-career.vercel.app,http://localhost:8080
```

#### Boshqa Kerakli Variable'lar

Agar hali qo'shilmagan bo'lsa:

**MONGODB_URI:**
```
Key: MONGODB_URI
Value: mongodb+srv://username:password@cluster.mongodb.net/logistic-career?retryWrites=true&w=majority
```

**JWT_SECRET:**
```
Key: JWT_SECRET
Value: your-super-secret-jwt-key-change-this-in-production
```

**JWT_EXPIRE:**
```
Key: JWT_EXPIRE
Value: 7d
```

**OPENAI_API_KEY:**
```
Key: OPENAI_API_KEY
Value: sk-your-openai-api-key-here
```

**NODE_ENV:**
```
Key: NODE_ENV
Value: production
```

**PORT:**
```
Key: PORT
Value: 5000
```

### 3. Service'ni Redeploy Qilish

Environment variable qo'shgandan keyin, service'ni qayta deploy qilish kerak:

1. **Manual Deploy** > **"Deploy latest commit"** ni bosing
2. Yoki yangi commit push qiling (avtomatik deploy)

### 4. Tekshirish

Deploy bo'lgandan keyin:

1. Browser'da backend health check'ni oching:
   ```
   https://logistic-career.onrender.com/api/health
   ```

2. Javob:
   ```json
   {
     "success": true,
     "message": "Server is running",
     "timestamp": "2026-01-06T21:30:00.000Z"
   }
   ```

3. Frontend'dan login qilib ko'ring
4. CORS xatosi yo'qolganini tekshiring

## Troubleshooting

### Hali ham CORS xatosi?

1. ✅ `FRONTEND_URL` to'g'ri qo'shilganligini tekshiring
2. ✅ Service redeploy qilinganligini tekshiring
3. ✅ Backend log'larni tekshiring (Render.com Dashboard > Logs)
4. ✅ Frontend URL to'g'ri ekanligini tekshiring: `https://logistic-career.vercel.app`

### 500 Internal Server Error?

1. Backend log'larni tekshiring (Render.com Dashboard > Logs)
2. Environment variables to'g'ri qo'shilganligini tekshiring
3. MongoDB connection string to'g'ri ekanligini tekshiring
4. Database ulanganligini tekshiring

### Backend ishlamayapti?

1. Render.com Dashboard > Logs'ni tekshiring
2. Environment variables to'g'ri qo'shilganligini tekshiring
3. Service status'ni tekshiring (Running bo'lishi kerak)

## Muhim Eslatmalar

- ✅ `FRONTEND_URL` **mutlaqo** qo'shilishi kerak
- ✅ URL'lar to'g'ri bo'lishi kerak (https:// bilan)
- ✅ Environment variable o'zgarganda **redeploy** kerak
- ✅ Bir nechta URL uchun vergul bilan ajratish mumkin

## To'liq Environment Variables Ro'yxati

Render.com'da quyidagi variable'lar bo'lishi kerak:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
OPENAI_API_KEY=sk-...
FRONTEND_URL=https://logistic-career.vercel.app
```

## Tezkor Tekshirish

Backend ishlayotganini tekshirish:

```bash
curl https://logistic-career.onrender.com/api/health
```

CORS sozlamalarini tekshirish:

```bash
curl -H "Origin: https://logistic-career.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://logistic-career.onrender.com/api/auth/admin-login
```

Javobda `Access-Control-Allow-Origin` header bo'lishi kerak.

