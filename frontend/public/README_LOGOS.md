# Logo Fayllari

Bu papkada Asliddin Logistic platformasi uchun logo fayli mavjud.

## Logo Fayli

### `favicon.jpg`
- **Ishlatilishi:** Asosiy logo va favicon
- **Format:** JPEG
- **Ishlatish:** 
  - Browser favicon (tab icon)
  - Header logo (barcha sahifalarda)
  - Mobile header icon
  - Apple touch icon
  - Open Graph va Twitter meta tag'larida

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
```

## O'zgartirish

Logoni o'zgartirish uchun:
1. `favicon.jpg` faylini yangi rasm bilan almashtiring
2. Rasm o'lchami va formatini tekshiring
3. Browser cache'ni tozalang (Ctrl+Shift+R yoki Cmd+Shift+R)

## Browser Support

Barcha zamonaviy browserlar JPEG formatini qo'llab-quvvatlaydi:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

