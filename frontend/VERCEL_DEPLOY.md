# Vercel'ga Deploy Qilish Qo'llanmasi

## 1. Vercel Account Yaratish

1. [Vercel](https://vercel.com) ga kiring
2. GitHub, GitLab yoki Bitbucket bilan ro'yxatdan o'ting
3. Account yaratishni yakunlang

## 2. Repository'ni GitHub'ga Push Qilish

Agar repository GitHub'da bo'lmasa:

```bash
# Git repository'ni yaratish (agar yo'q bo'lsa)
cd frontend
git init
git add .
git commit -m "Initial commit"

# GitHub'da yangi repository yaratish, keyin:
git remote add origin https://github.com/yourusername/logistic-career.git
git push -u origin main
```

## 3. Vercel'ga Project Qo'shish

### Variant 1: Vercel Dashboard orqali

1. [Vercel Dashboard](https://vercel.com/dashboard) ga kiring
2. "Add New..." > "Project" ni bosing
3. GitHub repository'ni tanlang
4. Project Settings:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend` (agar root'da bo'lmasa)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

### Variant 2: Vercel CLI orqali

```bash
# Vercel CLI o'rnatish
npm i -g vercel

# Frontend papkasiga o'tish
cd frontend

# Deploy qilish
vercel

# Production deploy
vercel --prod
```

## 4. Environment Variables Sozlash

Vercel Dashboard'da yoki CLI orqali environment variables qo'shing:

### Vercel Dashboard orqali:

1. Project Settings > Environment Variables
2. Quyidagi o'zgaruvchilarni qo'shing:

```
VITE_API_BASE_URL=https://your-backend-api.com/api
VITE_FRONTEND_URL=https://your-vercel-app.vercel.app
```

### CLI orqali:

```bash
cd frontend
vercel env add VITE_API_BASE_URL
# Qiymat: https://your-backend-api.com/api

vercel env add VITE_FRONTEND_URL
# Qiymat: https://your-vercel-app.vercel.app
```

## 5. Build Settings

Vercel avtomatik ravishda quyidagilarni aniqlaydi:
- **Framework:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

Agar avtomatik aniqlanmasa, `vercel.json` fayli mavjud va to'g'ri sozlangan.

## 6. Deploy Qilish

### Avtomatik Deploy (GitHub Integration)

Har safar `main` branch'ga push qilsangiz, avtomatik deploy bo'ladi.

### Manual Deploy

```bash
cd frontend
vercel --prod
```

## 7. Custom Domain Qo'shish (ixtiyoriy)

1. Vercel Dashboard > Project Settings > Domains
2. "Add Domain" ni bosing
3. Domain nomini kiriting (masalan: `logistic-career.com`)
4. DNS sozlamalarini domain provider'da qiling

## 8. Environment Variables (Production)

Production uchun quyidagi o'zgaruvchilar kerak:

```env
# Backend API URL (production)
VITE_API_BASE_URL=https://your-backend-api.vercel.app/api
# yoki
VITE_API_BASE_URL=https://api.yourdomain.com/api

# Frontend URL (production)
VITE_FRONTEND_URL=https://your-frontend.vercel.app
```

## 9. Tekshirish

Deploy qilingandan keyin:

1. Vercel Dashboard'dan URL ni oling
2. Browser'da ochib tekshiring
3. Console'da xatoliklar bor-yo'qligini tekshiring
4. API so'rovlar ishlayotganligini tekshiring

## 10. Troubleshooting

### Build xatosi

```bash
# Local'da build qilib tekshiring
cd frontend
npm run build

# Agar xatolik bo'lsa, tuzatib qayta deploy qiling
```

### API so'rovlar ishlamayapti

1. `VITE_API_BASE_URL` to'g'ri sozlanganligini tekshiring
2. Backend CORS sozlamalarini tekshiring
3. Backend production'da ishlayotganligini tekshiring

### Routing xatosi (404)

`vercel.json` faylida `rewrites` mavjudligini tekshiring. Barcha route'lar `index.html` ga redirect qilinishi kerak.

### Environment Variables ishlamayapti

1. Vercel Dashboard'da environment variables qo'shilganligini tekshiring
2. Production environment uchun qo'shilganligini tekshiring
3. Redeploy qiling (environment variables o'zgarganda)

## 11. CI/CD Pipeline

GitHub Actions yoki boshqa CI/CD ishlatmoqchi bo'lsangiz:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./frontend
```

## 12. Performance Optimization

Vercel avtomatik ravishda quyidagilarni qiladi:
- CDN caching
- Image optimization
- Automatic HTTPS
- Edge Network

Qo'shimcha optimizatsiya:
- Lazy loading
- Code splitting
- Image optimization

## Foydali Linklar

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

