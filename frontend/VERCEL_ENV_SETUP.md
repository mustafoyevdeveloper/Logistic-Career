# Vercel Environment Variables Sozlash

## Muammo

Frontend hali ham `http://localhost:5000` ga so'rov yubormoqda. Bu shuni anglatadiki, `VITE_API_BASE_URL` environment variable Vercel'da sozlanmagan.

## Yechim: Vercel'da Environment Variable Qo'shish

### 1. Vercel Dashboard'ga kiring

1. [Vercel Dashboard](https://vercel.com/dashboard) ga kiring
2. `logistic-career` project'ni tanlang

### 2. Environment Variables Qo'shish

1. Project Settings > **Environment Variables** bo'limiga kiring
2. Quyidagi variable'ni qo'shing:

   **Key:**
   ```
   VITE_API_BASE_URL
   ```

   **Value:**
   ```
   https://your-backend-url.onrender.com/api
   ```
   
   Masalan, agar backend Render.com'da deploy qilingan bo'lsa:
   ```
   https://logistic-career-backend.onrender.com/api
   ```

3. **Environment** ni tanlang:
   - ✅ Production
   - ✅ Preview
   - ✅ Development (ixtiyoriy)

4. **"Save"** ni bosing

### 3. Frontend'ni Redeploy Qilish

Environment variable qo'shgandan keyin, frontend'ni qayta deploy qilish kerak:

**Variant A: Manual Redeploy**
1. Vercel Dashboard > Deployments
2. Eng so'nggi deployment'ni toping
3. "..." (three dots) > **"Redeploy"** ni bosing
4. "Redeploy" ni tasdiqlang

**Variant B: Git Push orqali**
```bash
# Kichik o'zgarish qiling (masalan, README.md ga qator qo'shing)
git add .
git commit -m "Trigger redeploy for environment variables"
git push origin main
```

### 4. Tekshirish

Redeploy bo'lgandan keyin:

1. Browser'da saytni oching: `https://logistic-career.vercel.app`
2. Browser Console'ni oching (F12)
3. Network tab'ni oching
4. Login qilib ko'ring
5. API so'rovlar endi backend URL'ga ketayotganini tekshiring

**To'g'ri:** `https://your-backend-url.onrender.com/api/auth/admin-login`
**Noto'g'ri:** `http://localhost:5000/api/auth/admin-login`

## Troubleshooting

### Environment Variable ishlamayapti

1. **Variable nomini tekshiring:**
   - To'g'ri: `VITE_API_BASE_URL`
   - Noto'g'ri: `API_BASE_URL`, `REACT_APP_API_URL`, va boshqalar

2. **Value'ni tekshiring:**
   - URL `https://` bilan boshlanishi kerak
   - URL oxirida `/api` bo'lishi kerak
   - Masalan: `https://logistic-career-backend.onrender.com/api`

3. **Redeploy qiling:**
   - Environment variable o'zgarganda, avtomatik redeploy bo'lmaydi
   - Manual redeploy qilish kerak

4. **Build log'ni tekshiring:**
   - Vercel Dashboard > Deployments > Latest deployment > Build Logs
   - `VITE_API_BASE_URL` ko'rinayotganini tekshiring

### Hali ham localhost'ga so'rov ketayapti

1. Browser cache'ni tozalang (Ctrl+Shift+Delete)
2. Hard refresh qiling (Ctrl+F5)
3. Incognito mode'da tekshiring
4. Vercel'da environment variable to'g'ri qo'shilganligini qayta tekshiring

## Backend URL'ni Olish

Agar backend hali deploy qilinmagan bo'lsa:

1. Backend'ni Render.com'da deploy qiling
2. Deploy bo'lgandan keyin URL ni oling (masalan: `https://logistic-career-backend.onrender.com`)
3. Bu URL'ni `VITE_API_BASE_URL` ga qo'shing: `https://logistic-career-backend.onrender.com/api`

## Qo'shimcha Ma'lumot

- Vite environment variables `VITE_` prefiksi bilan boshlanishi kerak
- Environment variables build vaqtida inject qilinadi
- O'zgarishlar uchun redeploy kerak
- Development uchun `.env` fayl ishlatiladi
- Production uchun Vercel Dashboard'da sozlash kerak

