# Logo Fayllari

Bu papkada Logstic Career platformasi uchun logo fayllari mavjud.

## Logo Variantlari

### 1. `logo.svg`
- **Ishlatilishi:** Asosiy logo (light mode)
- **O'lchami:** 200x60px
- **Format:** SVG
- **Ishlatish:** Header, footer, marketing materiallar

### 2. `logo-dark.svg`
- **Ishlatilishi:** Dark mode uchun logo
- **O'lchami:** 200x60px
- **Format:** SVG
- **Ishlatish:** Dark theme'da header, footer

### 3. `logo-icon.svg`
- **Ishlatilishi:** Icon variant (faqat icon, text yo'q)
- **O'lchami:** 64x64px
- **Format:** SVG
- **Ishlatish:** Mobile header, favicon, app icon

### 4. `favicon.svg`
- **Ishlatilishi:** Browser favicon
- **O'lchami:** 32x32px
- **Format:** SVG
- **Ishlatish:** Browser tab icon

## Logo Komponenti

Logo komponenti `src/components/Logo.tsx` da mavjud:

```tsx
import Logo from '@/components/Logo';

// Full logo
<Logo variant="full" />

// Faqat icon
<Logo variant="icon" size="md" />

// Faqat text
<Logo variant="text" size="lg" />

// Dark mode
<Logo variant="full" dark />
```

## Logo Dizayn Elementlari

1. **Truck Icon** - Logistika va transport ramzi
2. **Book Icon** - Ta'lim va o'qitish ramzi
3. **Gradient Colors:**
   - Primary: Blue (#3B82F6 → #1E40AF)
   - Accent: Green (#10B981 → #059669)
4. **Typography:** Inter font family

## O'zgartirish

Logolarni o'zgartirish uchun:
1. SVG fayllarni edit qiling
2. Gradient ranglarni o'zgartiring
3. Icon elementlarini modifikatsiya qiling
4. Text font yoki o'lchamini o'zgartiring

## Browser Support

Barcha zamonaviy browserlar SVG'ni qo'llab-quvvatlaydi:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

