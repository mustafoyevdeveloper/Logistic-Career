import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Clock, CheckCircle2, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiService } from '@/services/api';
import { toast } from 'sonner';

// 7 kunlik darslar ma'lumotlari
const weekLessons: Record<number, {
  day: number;
  title: string;
  description: string;
  fullContent: string;
  duration: string;
  topics: string[];
}> = {
  1: {
    day: 1,
    title: "Logistika asoslari, tushunchalar va hujjatlar bilan tanishish",
    description: "Logistika nima, dispatcher nima, logistika turlari, asosiy hujjatlar va ularning maqsadlari, transport turlari va ularning xususiyatlari.",
    fullContent: `
      <h2 class="text-2xl font-bold mb-4">Logistika asoslari</h2>
      <p class="mb-4">Logistika - bu mahsulotlar, xizmatlar va ma'lumotlarni manbadan iste'molchigacha samarali va tejamkor tarzda harakatlantirish, saqlash va boshqarish jarayonidir.</p>
      
      <h3 class="text-xl font-semibold mb-3">Dispatcher nima?</h3>
      <p class="mb-4">Dispatcher - bu transport vositalarini, haydovchilarni va yuk tashish jarayonlarini boshqaruvchi mutaxassis. U yuk tashish rejalarini tuzadi, transport vositalarini kuzatadi va mijozlar bilan muloqot qiladi.</p>
      
      <h3 class="text-xl font-semibold mb-3">Logistika turlari</h3>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li>Ichki logistika - mamlakat ichidagi yuk tashish</li>
        <li>Xalqaro logistika - mamlakatlar orasidagi yuk tashish</li>
        <li>Ombor logistikasi - omborlarda saqlash va boshqarish</li>
        <li>Transport logistikasi - transport vositalarini boshqarish</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-3">Asosiy hujjatlar</h3>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li>CMR (Convention relative au contrat de transport international de marchandises par route) - xalqaro avtomobil transporti shartnomasi</li>
        <li>Bill of Lading - dengiz transporti uchun yuk hujjati</li>
        <li>AWB (Air Waybill) - havo transporti uchun yuk hujjati</li>
        <li>Invoice - hisob-faktura</li>
        <li>Packing List - yuk ro'yxati</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-3">Transport turlari</h3>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li>Avtomobil transporti - eng moslashuvchan va tez</li>
        <li>Temir yo'l transporti - og'ir yuklar uchun</li>
        <li>Havo transporti - tezkor va qimmat</li>
        <li>Dengiz transporti - eng arzon, lekin sekin</li>
      </ul>
    `,
    duration: "2 soat",
    topics: [
      "Logistika tushunchasi",
      "Dispatcher vazifalari",
      "Logistika turlari",
      "Asosiy hujjatlar",
      "Transport turlari"
    ]
  },
  2: {
    day: 2,
    title: "Xalqaro logistika va transport turlari",
    description: "Xalqaro logistika asoslari, transport turlari (avtomobil, temir yo'l, havo, dengiz), ularning afzalliklari va kamchiliklari.",
    fullContent: `
      <h2 class="text-2xl font-bold mb-4">Xalqaro logistika</h2>
      <p class="mb-4">Xalqaro logistika - bu turli mamlakatlar orasida yuk va xizmatlarni tashish, saqlash va boshqarish jarayonidir.</p>
      
      <h3 class="text-xl font-semibold mb-3">Avtomobil transporti</h3>
      <p class="mb-2"><strong>Afzalliklari:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li>Moslashuvchanlik va tezlik</li>
        <li>Kichik va o'rta yuklar uchun qulay</li>
        <li>To'g'ridan-to'g'ri yetkazib berish</li>
      </ul>
      <p class="mb-2"><strong>Kamchiliklari:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li>Chegara bojxonalari</li>
        <li>Yoqilg'i xarajatlari</li>
        <li>Cheklangan yuk hajmi</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-3">Temir yo'l transporti</h3>
      <p class="mb-2"><strong>Afzalliklari:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li>Katta yuk hajmlari</li>
        <li>Arzon narx</li>
        <li>Barqaror va xavfsiz</li>
      </ul>
      <p class="mb-2"><strong>Kamchiliklari:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li>Cheklangan marshrutlar</li>
        <li>Sekin tezlik</li>
        <li>Yuklash-tushirish muammolari</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-3">Havo transporti</h3>
      <p class="mb-2"><strong>Afzalliklari:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li>Eng tez transport turi</li>
        <li>Uzoq masofalar uchun qulay</li>
        <li>Xavfsizlik</li>
      </ul>
      <p class="mb-2"><strong>Kamchiliklari:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li>Eng qimmat transport</li>
        <li>Cheklangan yuk hajmi</li>
        <li>Havo sharoitiga bog'liq</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-3">Dengiz transporti</h3>
      <p class="mb-2"><strong>Afzalliklari:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li>Eng arzon transport</li>
        <li>Katta yuk hajmlari</li>
        <li>Uzoq masofalar uchun qulay</li>
      </ul>
      <p class="mb-2"><strong>Kamchiliklari:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li>Eng sekin transport</li>
        <li>Portga bog'liq</li>
        <li>Havo sharoitiga bog'liq</li>
      </ul>
    `,
    duration: "2.5 soat",
    topics: [
      "Xalqaro logistika asoslari",
      "Avtomobil transporti",
      "Temir yo'l transporti",
      "Havo transporti",
      "Dengiz transporti"
    ]
  },
  3: {
    day: 3,
    title: "Yuk tashish hujjatlari va shartnomalar",
    description: "CMR, AWB, Bill of Lading kabi asosiy hujjatlar, shartnoma tuzish, yuk tashish shartlari va javobgarlik masalalari.",
    fullContent: `
      <h2 class="text-2xl font-bold mb-4">Yuk tashish hujjatlari</h2>
      
      <h3 class="text-xl font-semibold mb-3">CMR (Convention relative au contrat de transport international de marchandises par route)</h3>
      <p class="mb-4">CMR - bu xalqaro avtomobil transporti uchun standart shartnoma. U yuk tashish shartlarini, javobgarlikni va to'lovlarni belgilaydi.</p>
      
      <h3 class="text-xl font-semibold mb-3">AWB (Air Waybill)</h3>
      <p class="mb-4">AWB - havo transporti uchun yuk hujjati. Bu hujjat yukning havo orqali tashilishini tasdiqlaydi va yukning manbasi, yo'nalishi va maqsadini ko'rsatadi.</p>
      
      <h3 class="text-xl font-semibold mb-3">Bill of Lading</h3>
      <p class="mb-4">Bill of Lading - dengiz transporti uchun asosiy hujjat. Bu hujjat yukning egalik huquqini ham ko'rsatadi va sotish hujjati sifatida ham ishlatiladi.</p>
      
      <h3 class="text-xl font-semibold mb-3">Shartnoma tuzish</h3>
      <p class="mb-4">Yuk tashish shartnomasi quyidagi ma'lumotlarni o'z ichiga olishi kerak:</p>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li>Yukning tavsifi va og'irligi</li>
        <li>Manba va maqsad manzillari</li>
        <li>Yuk tashish sanasi va muddati</li>
        <li>Narx va to'lov shartlari</li>
        <li>Javobgarlik va sug'urta</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-3">Javobgarlik masalalari</h3>
      <p class="mb-4">Transport kompaniyasi quyidagi holatlarda javobgar bo'lishi mumkin:</p>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li>Yukning yo'qolishi yoki shikastlanishi</li>
        <li>Kechikishlar</li>
        <li>Noto'g'ri manzilga yetkazib berish</li>
        <li>Hujjatlar bilan bog'liq muammolar</li>
      </ul>
    `,
    duration: "3 soat",
    topics: [
      "CMR hujjati",
      "AWB hujjati",
      "Bill of Lading",
      "Shartnoma tuzish",
      "Javobgarlik masalalari"
    ]
  },
  4: {
    day: 4,
    title: "Bo'jxona va rasmiylashtirish",
    description: "Bo'jxona rasmiylashtirish jarayoni, zarur hujjatlar, bojxona to'lovlari va qoidalari, import-export operatsiyalari.",
    fullContent: `
      <h2 class="text-2xl font-bold mb-4">Bo'jxona rasmiylashtirish</h2>
      
      <h3 class="text-xl font-semibold mb-3">Bo'jxona rasmiylashtirish jarayoni</h3>
      <p class="mb-4">Bo'jxona rasmiylashtirish - bu yukning chegara bo'ylab o'tishi uchun zarur bo'lgan rasmiy jarayon. Bu jarayon quyidagi bosqichlarni o'z ichiga oladi:</p>
      <ol class="list-decimal list-inside mb-4 space-y-2">
        <li>Hujjatlarni tayyorlash</li>
        <li>Bo'jxona organlariga ariza berish</li>
        <li>Yukni tekshirish</li>
        <li>To'lovlarni to'lash</li>
        <li>Ruxsat olish</li>
      </ol>
      
      <h3 class="text-xl font-semibold mb-3">Zarur hujjatlar</h3>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li>Invoice (Hisob-faktura)</li>
        <li>Packing List (Yuk ro'yxati)</li>
        <li>Certificate of Origin (Kelib chiqish sertifikati)</li>
        <li>Transport hujjatlari (CMR, AWB, va h.k.)</li>
        <li>Sertifikatlar va ruxsatnomalar</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-3">Bojxona to'lovlari</h3>
      <p class="mb-4">Bojxona to'lovlari quyidagilarni o'z ichiga oladi:</p>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li>Bojxona boj'i - yukning qiymatiga nisbatan</li>
        <li>Qo'shimcha soliqlar</li>
        <li>Bojxona xizmatlari uchun to'lovlar</li>
        <li>Yukni saqlash to'lovlari</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-3">Import-Export operatsiyalari</h3>
      <p class="mb-4">Import - bu yukni boshqa mamlakatdan olib kirish. Export - bu yukni boshqa mamlakatga olib chiqish. Har ikkala operatsiya ham bo'jxona rasmiylashtirishni talab qiladi.</p>
    `,
    duration: "2.5 soat",
    topics: [
      "Bo'jxona rasmiylashtirish jarayoni",
      "Zarur hujjatlar",
      "Bojxona to'lovlari",
      "Import operatsiyalari",
      "Export operatsiyalari"
    ]
  },
  5: {
    day: 5,
    title: "Logistika xarajatlari va narxlash",
    description: "Logistika xarajatlari turlari, narxlash usullari, xarajatlarni hisoblash, rentabellik va foyda koeffitsiyentlari.",
    fullContent: `
      <h2 class="text-2xl font-bold mb-4">Logistika xarajatlari</h2>
      
      <h3 class="text-xl font-semibold mb-3">Xarajatlar turlari</h3>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li><strong>Transport xarajatlari</strong> - yuk tashish uchun to'lovlar</li>
        <li><strong>Ombor xarajatlari</strong> - yukni saqlash uchun to'lovlar</li>
        <li><strong>Bojxona xarajatlari</strong> - bojxona to'lovlari va xizmatlari</li>
        <li><strong>Sug'urta xarajatlari</strong> - yukni sug'urtalash</li>
        <li><strong>Boshqaruv xarajatlari</strong> - logistika boshqaruvi</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-3">Narxlash usullari</h3>
      <p class="mb-4">Logistika xizmatlari uchun narxlash quyidagi usullar bilan amalga oshiriladi:</p>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li><strong>Masofaga asoslangan narxlash</strong> - masofaga qarab narx belgilanadi</li>
        <li><strong>Og'irlikka asoslangan narxlash</strong> - yukning og'irligiga qarab</li>
        <li><strong>Hajmga asoslangan narxlash</strong> - yukning hajmiga qarab</li>
        <li><strong>Qo'shma narxlash</strong> - bir necha omillarni hisobga olgan holda</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-3">Xarajatlarni hisoblash</h3>
      <p class="mb-4">Xarajatlarni hisoblashda quyidagilar hisobga olinadi:</p>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li>Yoqilg'i xarajatlari</li>
        <li>Haydovchi ish haqi</li>
        <li>Transport vositasining amortizatsiyasi</li>
        <li>Yo'l to'lovlari</li>
        <li>Bojxona to'lovlari</li>
        <li>Boshqaruv xarajatlari</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-3">Rentabellik va foyda</h3>
      <p class="mb-4">Rentabellik - bu xizmatdan olingan foyda va xarajatlar nisbati. Foyda koeffitsiyenti quyidagicha hisoblanadi:</p>
      <p class="mb-4"><strong>Foyda = Daromad - Xarajatlar</strong></p>
      <p class="mb-4"><strong>Rentabellik = (Foyda / Daromad) × 100%</strong></p>
    `,
    duration: "3 soat",
    topics: [
      "Xarajatlar turlari",
      "Narxlash usullari",
      "Xarajatlarni hisoblash",
      "Rentabellik",
      "Foyda koeffitsiyentlari"
    ]
  },
  6: {
    day: 6,
    title: "Mijozlar bilan ishlash va muloqot",
    description: "Mijozlar bilan muloqot qilish, shikoyatlar bilan ishlash, xizmat ko'rsatish standartlari, mijozlar bilan munosabatlar.",
    fullContent: `
      <h2 class="text-2xl font-bold mb-4">Mijozlar bilan ishlash</h2>
      
      <h3 class="text-xl font-semibold mb-3">Muloqot qilish</h3>
      <p class="mb-4">Mijozlar bilan samarali muloqot quyidagi prinsiplarga asoslanadi:</p>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li>Vaqtida javob berish</li>
        <li>Aniq va tushunarli ma'lumot berish</li>
        <li>Xushmuomala va professional bo'lish</li>
        <li>Muammolarni hal qilishga intilish</li>
        <li>Mijozning ehtiyojlarini tushunish</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-3">Shikoyatlar bilan ishlash</h3>
      <p class="mb-4">Shikoyatlar bilan ishlashda quyidagi bosqichlar muhim:</p>
      <ol class="list-decimal list-inside mb-4 space-y-2">
        <li>Shikoyatni diqqat bilan tinglash</li>
        <li>Muammoni tushunish va tahlil qilish</li>
        <li>Yechim taklif qilish</li>
        <li>Yechimni amalga oshirish</li>
        <li>Natijani kuzatish va baholash</li>
      </ol>
      
      <h3 class="text-xl font-semibold mb-3">Xizmat ko'rsatish standartlari</h3>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li>Vaqtida javob berish (24 soat ichida)</li>
        <li>Aniq va to'liq ma'lumot berish</li>
        <li>Professional xizmat ko'rsatish</li>
        <li>Muammolarni hal qilish</li>
        <li>Mijozlarni muntazam xabardor qilish</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-3">Mijozlar bilan munosabatlar</h3>
      <p class="mb-4">Uzoq muddatli muvaffaqiyatli munosabatlar uchun:</p>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li>Ishonchli va halollik</li>
        <li>Vaqtida xizmat ko'rsatish</li>
        <li>Sifatli xizmat</li>
        <li>Mijozlarni qadrlash</li>
        <li>Doimiy aloqa</li>
      </ul>
    `,
    duration: "2 soat",
    topics: [
      "Muloqot qilish",
      "Shikoyatlar bilan ishlash",
      "Xizmat ko'rsatish standartlari",
      "Mijozlar bilan munosabatlar",
      "Mijozlarni qadrlash"
    ]
  },
  7: {
    day: 7,
    title: "Logistika tizimlari va texnologiyalar",
    description: "Zamonaviy logistika tizimlari, TMS (Transport Management System), GPS kuzatuv, raqamli logistika va avtomatlashtirish.",
    fullContent: `
      <h2 class="text-2xl font-bold mb-4">Logistika tizimlari va texnologiyalar</h2>
      
      <h3 class="text-xl font-semibold mb-3">TMS (Transport Management System)</h3>
      <p class="mb-4">TMS - bu transport operatsiyalarini boshqarish uchun mo'ljallangan dasturiy tizim. U quyidagi funksiyalarni bajaradi:</p>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li>Yuk tashish rejalarini tuzish</li>
        <li>Transport vositalarini kuzatish</li>
        <li>Xarajatlarni hisoblash</li>
        <li>Hujjatlarni boshqarish</li>
        <li>Hisobotlar tayyorlash</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-3">GPS kuzatuv</h3>
      <p class="mb-4">GPS kuzatuv tizimi transport vositalarining joylashuvini real vaqtda kuzatish imkonini beradi:</p>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li>Transport vositasining aniq joylashuvi</li>
        <li>Marshrutni kuzatish</li>
        <li>Tezlik va vaqtni nazorat qilish</li>
        <li>Xavfsizlikni ta'minlash</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-3">Raqamli logistika</h3>
      <p class="mb-4">Raqamli logistika - bu zamonaviy texnologiyalardan foydalangan holda logistika jarayonlarini avtomatlashtirish:</p>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li>Elektron hujjatlar</li>
        <li>Onlayn buyurtmalar</li>
        <li>Avtomatik hisob-kitoblar</li>
        <li>Ma'lumotlar bazalari</li>
        <li>Bulutli xizmatlar</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-3">Avtomatlashtirish</h3>
      <p class="mb-4">Avtomatlashtirish logistika jarayonlarini yaxshilaydi:</p>
      <ul class="list-disc list-inside mb-4 space-y-2">
        <li>Xatoliklarni kamaytirish</li>
        <li>Vaqtni tejash</li>
        <li>Xarajatlarni kamaytirish</li>
        <li>Samaradorlikni oshirish</li>
        <li>Ma'lumotlarni tez qayta ishlash</li>
      </ul>
    `,
    duration: "2.5 soat",
    topics: [
      "TMS tizimlari",
      "GPS kuzatuv",
      "Raqamli logistika",
      "Avtomatlashtirish",
      "Zamonaviy texnologiyalar"
    ]
  }
};

export default function LessonDetailPage() {
  const { day } = useParams<{ day: string }>();
  const navigate = useNavigate();
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  
  const dayNumber = day ? parseInt(day, 10) : null;
  const lesson = dayNumber && weekLessons[dayNumber];

  // Dars holatini tekshirish (qulflangan bo'lsa kirishga ruxsat berilmasligi kerak)
  useEffect(() => {
    const checkLessonAccess = async () => {
      if (!dayNumber) {
        setIsCheckingAccess(false);
        return;
      }

      // 1-dars har doim ochiq
      if (dayNumber === 1) {
        setHasAccess(true);
        setIsCheckingAccess(false);
        return;
      }

      try {
        // Dars holatini olish
        const response = await apiService.getStudentLessons();
        if (response.success && response.data) {
          const lessonStatus = response.data.lessons.find((l: any) => l.day === dayNumber);
          if (lessonStatus && lessonStatus.isUnlocked) {
            setHasAccess(true);
          } else {
            // Dars qulflangan
            toast.error('Bu dars hali ochilmagan');
            navigate('/student/lessons');
          }
        }
      } catch (error: any) {
        toast.error(error.message || 'Dars holatini tekshirishda xatolik');
        navigate('/student/lessons');
      } finally {
        setIsCheckingAccess(false);
      }
    };

    checkLessonAccess();
  }, [dayNumber, navigate]);

  // Darsga kirilganda progress yangilash
  useEffect(() => {
    if (dayNumber && hasAccess) {
      // Dars progress'ini yangilash (keyingi dars ochilish vaqtini hisoblash uchun)
      apiService.request(`/lessons/day/${dayNumber}/progress`, {
        method: 'PUT',
        body: JSON.stringify({ timeSpent: 0 }),
      }).catch(() => {
        // Xatolikni e'tiborsiz qoldirish
      });
    }
  }, [dayNumber, hasAccess]);

  if (isCheckingAccess) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Tekshirilmoqda...</p>
        </div>
      </div>
    );
  }

  if (!lesson || !hasAccess) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center py-12">
          <Lock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">
            {!lesson ? 'Dars topilmadi' : 'Bu dars hali ochilmagan'}
          </p>
          <Button onClick={() => navigate('/student/lessons')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Darsliklarga qaytish
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          onClick={() => navigate('/student/lessons')}
          variant="ghost"
          size="sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Orqaga
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            {lesson.day}-Kun: {lesson.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {lesson.duration}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              {lesson.topics.length} mavzu
            </span>
          </div>
        </div>
      </div>

      {/* Topics */}
      <div className="bg-card rounded-xl p-4 sm:p-6 border border-border">
        <h2 className="text-lg font-semibold text-foreground mb-3">Dars mavzulari:</h2>
        <div className="flex flex-wrap gap-2">
          {lesson.topics.map((topic, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-card rounded-xl p-4 sm:p-6 border border-border">
        <div
          className="prose prose-sm sm:prose-base max-w-none text-foreground"
          dangerouslySetInnerHTML={{ __html: lesson.fullContent }}
        />
      </div>

      {/* Navigation */}
      
      {/* <div className="flex items-center justify-between gap-4">
        <Button
          onClick={() => {
            if (dayNumber > 1) {
              navigate(`/student/lessons/${dayNumber - 1}`);
            } else {
              navigate('/student/lessons');
            }
          }}
          variant="outline"
          disabled={dayNumber === 1}
          className='text-white hover:text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 gradient-primary text-primary-foreground shadow-lg hover:shadow-glow active:scale-[0.98]'
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Oldingi dars
        </Button>

        <Button
          onClick={() => {
            if (dayNumber < 7) {
              navigate(`/student/lessons/${dayNumber + 1}`);
            }
          }}
          variant="gradient"
          disabled={dayNumber === 7}
        >
          Keyingi dars
          <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
        </Button>
      </div> */}
    </div>
  );
}

