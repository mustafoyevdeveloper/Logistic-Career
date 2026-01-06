# Tezkor Sozlash Qo'llanmasi

## Backend URL
```
https://logistic-career.onrender.com
```

## 1. Vercel'da Environment Variable Qo'shish

### Qadamlar:

1. [Vercel Dashboard](https://vercel.com/dashboard) ga kiring
2. `logistic-career` project'ni tanlang
3. **Settings** > **Environment Variables** ga kiring
4. Yangi variable qo'shing:

   **Key:**
   ```
   VITE_API_BASE_URL
   ```

   **Value:**
   ```
   https://logistic-career.onrender.com/api
   ```

   ⚠️ **Muhim:** URL oxirida `/api` bo'lishi kerak!

5. **Environment** ni tanlang:
   - ✅ **Production**
   - ✅ **Preview**  
   - ✅ **Development** (ixtiyoriy)

6. **"Save"** ni bosing

### Screenshot ko'rinishi:
```
┌─────────────────────────────────────┐
│ Key: VITE_API_BASE_URL              │
│ Value: https://logistic-career...    │
│       onrender.com/api               │
│ Environment: [✓] Production         │
│            [✓] Preview               │
│            [✓] Development          │
│ [Save]                               │
└─────────────────────────────────────┘
```

## 2. Frontend'ni Redeploy Qilish

Environment variable qo'shgandan keyin **mutlaqo redeploy qilish kerak**!

### Variant A: Manual Redeploy (Tezkor)
1. Vercel Dashboard > **Deployments**
2. Eng so'nggi deployment'ni toping
3. **"..."** (three dots) > **"Redeploy"**
4. **"Redeploy"** ni tasdiqlang

### Variant B: Git Push (Avtomatik)
```bash
# Kichik o'zgarish qiling
echo "# Updated" >> README.md
git add .
git commit -m "Update: Trigger redeploy"
git push origin main
```

## 3. Backend CORS Sozlamalari

Backend'da `FRONTEND_URL` to'g'ri sozlanganligini tekshiring:

Render.com Dashboard > Environment Variables:
```
FRONTEND_URL=https://logistic-career.vercel.app
```

Yoki bir nechta URL uchun:
```
FRONTEND_URL=https://logistic-career.vercel.app,http://localhost:8080
```

## 4. Tekshirish

Redeploy bo'lgandan keyin:

1. Browser'da saytni oching: `https://logistic-career.vercel.app`
2. **F12** ni bosing (Console'ni ochish)
3. **Network** tab'ni oching
4. Login qilib ko'ring
5. API so'rovlar endi quyidagiga ketayotganini ko'rasiz:

   ✅ **To'g'ri:**
   ```
   https://logistic-career.onrender.com/api/auth/admin-login
   ```

   ❌ **Noto'g'ri (eski):**
   ```
   http://localhost:5000/api/auth/admin-login
   ```

## 5. Troubleshooting

### Hali ham localhost'ga so'rov ketayapti?

1. ✅ Environment variable to'g'ri qo'shilganligini tekshiring
2. ✅ Redeploy qilinganligini tekshiring
3. ✅ Browser cache'ni tozalang (Ctrl+Shift+Delete)
4. ✅ Hard refresh qiling (Ctrl+F5)
5. ✅ Incognito mode'da tekshiring

### CORS xatosi?

1. Backend'da `FRONTEND_URL` to'g'ri sozlanganligini tekshiring
2. Backend'ni qayta deploy qiling
3. Browser Console'da aniq xatolik xabarini ko'ring

### 404 xatosi?

1. Backend URL to'g'ri ekanligini tekshiring: `https://logistic-career.onrender.com/api/health`
2. Health check endpoint ishlayotganini tekshiring
3. Backend deploy bo'lganligini tekshiring

## 6. Tezkor Tekshirish

Backend ishlayotganini tekshirish:

```bash
# Browser'da yoki terminal'da:
curl https://logistic-career.onrender.com/api/health
```

Javob:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-01-06T21:30:00.000Z"
}
```

## 7. Muhim Eslatmalar

- ✅ Environment variable nomi `VITE_API_BASE_URL` bo'lishi kerak
- ✅ URL oxirida `/api` bo'lishi kerak
- ✅ Environment variable o'zgarganda **mutlaqo redeploy** kerak
- ✅ Backend CORS sozlamalari to'g'ri bo'lishi kerak
- ✅ Browser cache'ni tozalash kerak bo'lishi mumkin

## 8. To'liq URL'lar

**Frontend:**
```
https://logistic-career.vercel.app
```

**Backend:**
```
https://logistic-career.onrender.com
```

**Backend API Base:**
```
https://logistic-career.onrender.com/api
```

