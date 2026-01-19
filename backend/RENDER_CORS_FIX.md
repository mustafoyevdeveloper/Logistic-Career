# Render.com CORS Xatosini Tuzatish

## Muammo

Vercel'ga deploy qilingan frontend'dan Render.com backend'ga so'rov yuborilganda CORS xatosi:

```
Access to fetch at 'https://logistic-career.onrender.com/api/auth/admin-login' 
from origin 'https://logistic-career.vercel.app' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## Yechim

### 1. Render.com Dashboard'ga kiring

1. [Render.com Dashboard](https://dashboard.render.com) ga kiring
2. Backend service'ni tanlang (masalan: `logistic-career` yoki `logistic-career-backend`)

### 2. Environment Variable Qo'shing

**Service > Environment** tab'iga kiring va quyidagi variable'ni qo'shing:

#### FRONTEND_URL (MUHIM!)

```
Key: FRONTEND_URL
Value: https://logistic-career.vercel.app
```

**Yoki bir nechta URL uchun (development va production):**
```
Key: FRONTEND_URL
Value: https://logistic-career.vercel.app,https://logistic-career-git-main.vercel.app
```

### 3. NODE_ENV ni Production qiling

```
Key: NODE_ENV
Value: production
```

### 4. Service'ni Redeploy Qiling

⚠️ **MUHIM:** Environment variable qo'shgandan keyin, service'ni **mutlaqo redeploy qilish kerak**!

1. Render.com Dashboard'da service'ni oching
2. **Manual Deploy** > **"Deploy latest commit"** ni bosing
3. Yoki yangi commit push qiling (avtomatik deploy)

### 5. Tekshirish

Deploy bo'lgandan keyin:

1. **Backend Health Check:**
   ```
   https://logistic-career.onrender.com/api/health
   ```
   
   Browser'da oching va javob ko'rinishi kerak:
   ```json
   {
     "success": true,
     "message": "Server is running",
     "timestamp": "2026-01-06T21:30:00.000Z"
   }
   ```

2. **CORS Test:**
   Browser console'da:
   ```javascript
   fetch('https://logistic-career.onrender.com/api/health', {
     method: 'GET',
     headers: {
       'Content-Type': 'application/json'
     }
   })
   .then(res => res.json())
   .then(data => console.log('✅ CORS ishlayapti:', data))
   .catch(err => console.error('❌ CORS xatosi:', err));
   ```

3. **Frontend'dan Login:**
   - `https://logistic-career.vercel.app/teacher/admin/role` ga kiring
   - Login qilib ko'ring
   - CORS xatosi yo'qolganini tekshiring

## To'liq Environment Variables Ro'yxati

Render.com'da quyidagi variable'lar bo'lishi kerak:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/logistic-career
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
OPENAI_API_KEY=sk-your-openai-api-key-here
FRONTEND_URL=https://logistic-career.vercel.app
```

## Troubleshooting

### Hali ham CORS xatosi?

1. ✅ `FRONTEND_URL` to'g'ri qo'shilganligini tekshiring
2. ✅ `NODE_ENV=production` qo'shilganligini tekshiring
3. ✅ Service redeploy qilinganligini tekshiring (environment variable o'zgarganda **mutlaqo** redeploy kerak!)
4. ✅ Backend log'larni tekshiring (Render.com Dashboard > Logs)
5. ✅ Frontend URL to'g'ri ekanligini tekshiring: `https://logistic-career.vercel.app`

### Backend log'larda ko'rinadigan xatolar:

Render.com Dashboard > Logs'da quyidagilarni ko'rasiz:

```
🌐 Allowed CORS origins: [ 'https://logistic-career.vercel.app', ... ]
🌍 Environment: PRODUCTION
🚀 Server is running on port 5000
✅ Vercel origin allowed (production): https://logistic-career.vercel.app
```

Agar `FRONTEND_URL` ko'rinmasa yoki `Environment: DEVELOPMENT` ko'rsatilsa, environment variable to'g'ri qo'shilmagan.

### Backend ishlamayapti?

1. Render.com Dashboard > Logs'ni tekshiring
2. Environment variables to'g'ri qo'shilganligini tekshiring
3. MongoDB connection string to'g'ri ekanligini tekshiring
4. Service status'ni tekshiring (Running bo'lishi kerak)

## Muhim Eslatmalar

- ✅ `FRONTEND_URL` **mutlaqo** qo'shilishi kerak
- ✅ `NODE_ENV=production` **mutlaqo** qo'shilishi kerak
- ✅ URL'lar to'g'ri bo'lishi kerak (https:// bilan, trailing slash yo'q)
- ✅ Environment variable o'zgarganda **redeploy** kerak (avtomatik emas!)
- ✅ Bir nechta URL uchun vergul bilan ajratish mumkin
- ✅ Vercel preview URL'lar avtomatik qo'llab-quvvatlanadi (production mode'da)

## Tezkor Test

Terminal'da:

```bash
# Health check
curl https://logistic-career.onrender.com/api/health

# CORS test
curl -H "Origin: https://logistic-career.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://logistic-career.onrender.com/api/auth/admin-login \
     -v
```

Javobda `Access-Control-Allow-Origin: https://logistic-career.vercel.app` bo'lishi kerak.

