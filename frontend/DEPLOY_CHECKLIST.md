# Vercel Deploy Checklist

## Pre-Deploy Checklist

### ✅ 1. Code Tayyorligi
- [ ] Barcha o'zgarishlar commit qilingan
- [ ] Build local'da muvaffaqiyatli ishlaydi (`npm run build`)
- [ ] Xatoliklar yo'q (lint, type check)
- [ ] Testlar o'tdi (agar mavjud bo'lsa)

### ✅ 2. Environment Variables
- [ ] `VITE_API_BASE_URL` - Backend API URL
- [ ] `VITE_FRONTEND_URL` - Frontend URL (ixtiyoriy)

### ✅ 3. Configuration Files
- [ ] `vercel.json` mavjud va to'g'ri sozlangan
- [ ] `package.json` build script mavjud
- [ ] `.vercelignore` mavjud (ixtiyoriy)

### ✅ 4. Backend Tayyorligi
- [ ] Backend production'da deploy qilingan
- [ ] Backend CORS sozlamalari to'g'ri
- [ ] Backend API URL ishlayapti

## Deploy Qadamlar

### 1. GitHub'ga Push
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Vercel'ga Project Qo'shish

**Variant A: Dashboard orqali**
1. [Vercel Dashboard](https://vercel.com/dashboard) ga kiring
2. "Add New..." > "Project"
3. Repository'ni tanlang
4. Settings:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

**Variant B: CLI orqali**
```bash
cd frontend
npm i -g vercel
vercel login
vercel
```

### 3. Environment Variables Qo'shish

Vercel Dashboard > Project Settings > Environment Variables:

```
VITE_API_BASE_URL = https://your-backend-api.com/api
VITE_FRONTEND_URL = https://your-app.vercel.app
```

### 4. Deploy

Avtomatik: GitHub'ga push qilganda deploy bo'ladi
Manual: `vercel --prod`

## Post-Deploy Checklist

### ✅ 5. Tekshirish
- [ ] Sayt yuklanmoqdami?
- [ ] Barcha route'lar ishlayaptimi?
- [ ] API so'rovlar muvaffaqiyatli?
- [ ] Console'da xatoliklar yo'qmi?
- [ ] Mobile responsive ishlayaptimi?

### ✅ 6. Performance
- [ ] Lighthouse score yaxshi (90+)
- [ ] Images optimize qilingan
- [ ] Bundle size maqbul

### ✅ 7. Security
- [ ] HTTPS ishlayapti
- [ ] Environment variables xavfsiz
- [ ] API keys expose qilinmagan

## Troubleshooting

### Build xatosi
```bash
# Local'da test qiling
cd frontend
npm run build

# Xatolikni tuzatib qayta deploy qiling
```

### 404 xatosi (routing)
- `vercel.json` faylida `rewrites` mavjudligini tekshiring
- Barcha route'lar `index.html` ga redirect qilinishi kerak

### API so'rovlar ishlamayapti
- `VITE_API_BASE_URL` to'g'ri sozlanganligini tekshiring
- Backend CORS sozlamalarini tekshiring
- Network tab'da so'rovlarni tekshiring

### Environment Variables ishlamayapti
- Vercel Dashboard'da qo'shilganligini tekshiring
- Production environment uchun qo'shilganligini tekshiring
- Redeploy qiling

## Foydali Komandalar

```bash
# Local build test
npm run build
npm run preview

# Vercel CLI
vercel login
vercel dev          # Local development with Vercel
vercel              # Deploy to preview
vercel --prod       # Deploy to production
vercel logs         # View logs
vercel env ls       # List environment variables
vercel env add      # Add environment variable
```

## Support

- [Vercel Docs](https://vercel.com/docs)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
- [Vercel Support](https://vercel.com/support)

