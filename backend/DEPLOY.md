# Backend Deploy Qo'llanmasi

## Muammo

Frontend Vercel'da deploy qilingan (`https://logistic-career.vercel.app`), lekin backend hali localhost'da (`http://localhost:5000`). Vercel'dan localhost'ga ulanish **mumkin emas**.

## Yechim: Backend'ni Deploy Qilish

Backend'ni quyidagi platformalardan birida deploy qiling:

### 1. Render.com (Tavsiya etiladi - Free tier mavjud)

**Variant A: render.yaml fayli orqali (Tavsiya etiladi)**

1. [Render.com](https://render.com) ga kiring va ro'yxatdan o'ting
2. "New +" > "Blueprint" ni bosing
3. GitHub repository'ni ulang
4. Render.com avtomatik ravishda `render.yaml` faylini topadi va sozlamalarni yuklaydi
5. Environment Variables qo'shing (MONGODB_URI, JWT_SECRET, OPENAI_API_KEY)
6. "Apply" ni bosing

**Variant B: Manual sozlash**

1. [Render.com](https://render.com) ga kiring va ro'yxatdan o'ting
2. "New +" > "Web Service" ni bosing
3. GitHub repository'ni ulang
4. Sozlamalar:
   - **Name:** `logistic-career-backend`
   - **Environment:** `Node`
   - **Root Directory:** `backend` ⚠️ **MUHIM: Root Directory `backend` bo'lishi kerak**
   - **Build Command:** `npm install` (yoki bo'sh qoldirish mumkin)
   - **Start Command:** `npm start`

5. Environment Variables qo'shing:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-jwt-secret
   JWT_EXPIRE=7d
   OPENAI_API_KEY=your-openai-api-key
   FRONTEND_URL=https://logistic-career.vercel.app
   ```

6. "Create Web Service" ni bosing
7. Deploy bo'lgandan keyin URL ni oling (masalan: `https://logistic-career-backend.onrender.com`)

### 2. Railway.app (Tavsiya etiladi - Free tier mavjud)

1. [Railway.app](https://railway.app) ga kiring
2. "New Project" > "Deploy from GitHub repo"
3. Repository'ni tanlang
4. Service yaratish:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

5. Environment Variables qo'shing (yuxoridagi kabi)
6. Deploy bo'lgandan keyin URL ni oling

### 3. Vercel (Backend uchun ham ishlaydi)

1. Vercel Dashboard'da yangi project yarating
2. Repository'ni ulang
3. Sozlamalar:
   - **Framework Preset:** Other
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Output Directory:** (bo'sh qoldiring)

4. Environment Variables qo'shing
5. Deploy qiling

### 4. Heroku (Classic, lekin hali ishlaydi)

1. [Heroku](https://heroku.com) ga kiring
2. "New" > "Create new app"
3. GitHub repository'ni ulang
4. Settings > Config Vars:
   - Barcha environment variables qo'shing

5. Deploy > Manual Deploy > Deploy Branch

## Backend Deploy Qilingandan Keyin

### 1. Frontend'da Environment Variable Qo'shish

Vercel Dashboard > Project Settings > Environment Variables:

```
VITE_API_BASE_URL=https://your-backend-url.com/api
```

Masalan:
```
VITE_API_BASE_URL=https://logistic-career-backend.onrender.com/api
```

### 2. Backend CORS Sozlamalari

Backend'da `FRONTEND_URL` environment variable'ni to'g'ri sozlang:

```env
FRONTEND_URL=https://logistic-career.vercel.app
```

Yoki bir nechta URL uchun:
```env
FRONTEND_URL=https://logistic-career.vercel.app,http://localhost:8080
```

### 3. Redeploy Frontend

Vercel Dashboard'da "Redeploy" ni bosing yoki GitHub'ga yangi commit push qiling.

## Tekshirish

1. Backend health check: `https://your-backend-url.com/api/health`
2. Frontend'dan API so'rov yuborish
3. Browser Console'da xatoliklar yo'qligini tekshirish

## Troubleshooting

### CORS xatosi
- Backend'da `FRONTEND_URL` to'g'ri sozlanganligini tekshiring
- Backend'ni qayta deploy qiling

### 404 xatosi
- Backend URL to'g'ri ekanligini tekshiring
- API endpoint'lar to'g'ri ishlayotganligini tekshiring

### Environment Variables ishlamayapti
- Vercel'da environment variables qo'shilganligini tekshiring
- Production environment uchun qo'shilganligini tekshiring
- Redeploy qiling

