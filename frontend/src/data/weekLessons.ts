export interface LessonTopic {
  title: string;
  content: string;
  videos: string[];
}

export interface WeekLesson {
  day: number;
  title: string;
  description: string;
  duration: string;
  topics: Record<string, LessonTopic>;
}

// 7 kunlik darslar ma'lumotlari (talaba va o'qituvchi uchun umumiy)
export const weekLessons: Record<number, WeekLesson> = {
  1: {
    day: 1,
    title: "Logistika asoslari, tushunchalar va hujjatlar bilan tanishish",
    description: "Logistika nima, dispatcher nima, logistika turlari, asosiy hujjatlar va ularning maqsadlari, transport turlari va ularning xususiyatlari.",
    duration: "",
    topics: {
      "Logistika tushunchasi": {
        title: "Logistika tushunchasi",
        content: `
          <h2 class="text-2xl font-bold mb-4">Logistika asoslari</h2>
          <p class="mb-4">Logistika - bu mahsulotlar, xizmatlar va ma'lumotlarni manbadan iste'molchigacha samarali va tejamkor tarzda harakatlantirish, saqlash va boshqarish jarayonidir.</p>
          <p class="mb-4">Logistika so'zi yunoncha "logistikos" so'zidan kelib chiqqan bo'lib, "hisob-kitob" yoki "sanash" degan ma'noni anglatadi. Zamonaviy logistika esa kengroq tushuncha bo'lib, u faqat transportni emas, balki butun tarmoqni boshqarishni o'z ichiga oladi.</p>
          <p class="mb-4">Logistika asosiy maqsadi - bu mahsulotlarni eng kam xarajat bilan va eng qisqa vaqtda manbadan maqsadgacha yetkazib berishdir.</p>
        `,
        videos: [
          "https://pub-e29856519e414c75bfcf296d0dc7f3ad.r2.dev/Kino/1762382269471-Interstellar.mp4",
          "https://pub-e29856519e414c75bfcf296d0dc7f3ad.r2.dev/Kino/1764166949478-tor-4-1080p-ozbek-tilida-asilmedia.net.mp4"
        ]
      },
      "Dispatcher vazifalari": {
        title: "Dispatcher vazifalari",
        content: `
          <h2 class="text-2xl font-bold mb-4">Dispatcher nima?</h2>
          <p class="mb-4">Dispatcher - bu transport vositalarini, haydovchilarni va yuk tashish jarayonlarini boshqaruvchi mutaxassis. U yuk tashish rejalarini tuzadi, transport vositalarini kuzatadi va mijozlar bilan muloqot qiladi.</p>
          <h3 class="text-xl font-semibold mb-3">Dispatcherning asosiy vazifalari:</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Yuk tashish rejalarini tuzish va optimallashtirish</li>
            <li>Transport vositalarini va haydovchilarni boshqarish</li>
            <li>Mijozlar bilan muloqot qilish va buyurtmalarni qabul qilish</li>
            <li>Yuk tashish jarayonini kuzatish va nazorat qilish</li>
            <li>Muammolarni hal qilish va yechimlar topish</li>
            <li>Hujjatlarni tayyorlash va rasmiylashtirish</li>
            <li>Xarajatlarni hisoblash va narxlarni belgilash</li>
          </ul>
          <p class="mb-4">Dispatcher - bu logistika sohasidagi eng muhim kasb bo'lib, u butun transport jarayonini boshqaradi va samarali ishlashini ta'minlaydi.</p>
        `,
        videos: [
          "https://pub-e29856519e414c75bfcf296d0dc7f3ad.r2.dev/Kino/1762382269471-Interstellar.mp4"
        ]
      },
      "Logistika turlari": {
        title: "Logistika turlari",
        content: `
          <h2 class="text-2xl font-bold mb-4">Logistika turlari</h2>
          <p class="mb-4">Logistika turli xil sohalarga bo'linadi va har biri o'ziga xos xususiyatlarga ega:</p>
          <h3 class="text-xl font-semibold mb-3">1. Ichki logistika</h3>
          <p class="mb-4">Ichki logistika - mamlakat ichidagi yuk tashish va boshqarish jarayonidir. Bu turdagi logistika ichki bozor uchun mo'ljallangan va milliy qonun-qoidalarga bo'ysunadi.</p>
          <h3 class="text-xl font-semibold mb-3">2. Xalqaro logistika</h3>
          <p class="mb-4">Xalqaro logistika - mamlakatlar orasidagi yuk tashish va boshqarish jarayonidir. Bu turdagi logistika xalqaro qonun-qoidalarga bo'ysunadi va bojxona rasmiylashtirishni talab qiladi.</p>
          <h3 class="text-xl font-semibold mb-3">3. Ombor logistikasi</h3>
          <p class="mb-4">Ombor logistikasi - omborlarda saqlash va boshqarish jarayonidir. Bu turdagi logistika yuklarni saqlash, inventarizatsiya va boshqarishni o'z ichiga oladi.</p>
          <h3 class="text-xl font-semibold mb-3">4. Transport logistikasi</h3>
          <p class="mb-4">Transport logistikasi - transport vositalarini boshqarish jarayonidir. Bu turdagi logistika transport vositalarini tanlash, marshrutlarni tuzish va optimallashtirishni o'z ichiga oladi.</p>
        `,
        videos: [
          "https://pub-e29856519e414c75bfcf296d0dc7f3ad.r2.dev/Kino/1762382269471-Interstellar.mp4"
        ]
      },
      "Asosiy hujjatlar": {
        title: "Asosiy hujjatlar",
        content: `
          <h2 class="text-2xl font-bold mb-4">Asosiy hujjatlar</h2>
          <p class="mb-4">Logistika sohasida turli xil hujjatlar ishlatiladi va har biri o'ziga xos maqsadga ega:</p>
          <h3 class="text-xl font-semibold mb-3">CMR (Convention relative au contrat de transport international de marchandises par route)</h3>
          <p class="mb-4">CMR - xalqaro avtomobil transporti uchun standart shartnoma. U yuk tashish shartlarini, javobgarlikni va to'lovlarni belgilaydi. Bu hujjat xalqaro avtomobil transporti uchun majburiydir.</p>
          <h3 class="text-xl font-semibold mb-3">Bill of Lading</h3>
          <p class="mb-4">Bill of Lading - dengiz transporti uchun yuk hujjati. Bu hujjat yukning egalik huquqini ham ko'rsatadi va sotish hujjati sifatida ham ishlatiladi.</p>
          <h3 class="text-xl font-semibold mb-3">AWB (Air Waybill)</h3>
          <p class="mb-4">AWB - havo transporti uchun yuk hujjati. Bu hujjat yukning havo orqali tashilishini tasdiqlaydi va yukning manbasi, yo'nalishi va maqsadini ko'rsatadi.</p>
          <h3 class="text-xl font-semibold mb-3">Invoice (Hisob-faktura)</h3>
          <p class="mb-4">Invoice - bu yukning narxi va to'lov shartlarini ko'rsatadigan hujjat. Bu hujjat bojxona rasmiylashtirishda ham ishlatiladi.</p>
          <h3 class="text-xl font-semibold mb-3">Packing List (Yuk ro'yxati)</h3>
          <p class="mb-4">Packing List - bu yukning tarkibini va miqdorini ko'rsatadigan hujjat. Bu hujjat yukni tekshirish va inventarizatsiya qilishda ishlatiladi.</p>
        `,
        videos: [
          "https://pub-e29856519e414c75bfcf296d0dc7f3ad.r2.dev/Kino/1762382269471-Interstellar.mp4"
        ]
      },
      "Transport turlari": {
        title: "Transport turlari",
        content: `
          <h2 class="text-2xl font-bold mb-4">Transport turlari</h2>
          <p class="mb-4">Transport turlari yukning xususiyatlariga va maqsadiga qarab tanlanadi:</p>
          <h3 class="text-xl font-semibold mb-3">Avtomobil transporti</h3>
          <p class="mb-4">Avtomobil transporti - eng moslashuvchan va tez transport turi. U kichik va o'rta yuklar uchun qulay va to'g'ridan-to'g'ri yetkazib berish imkonini beradi. Afzalliklari: moslashuvchanlik, tezlik, qulaylik. Kamchiliklari: chegara bojxonalari, yoqilg'i xarajatlari, cheklangan yuk hajmi.</p>
          <h3 class="text-xl font-semibold mb-3">Temir yo'l transporti</h3>
          <p class="mb-4">Temir yo'l transporti - og'ir yuklar uchun eng qulay transport turi. U katta yuk hajmlarini tashish imkonini beradi va arzon narxga ega. Afzalliklari: katta yuk hajmlari, arzon narx, barqarorlik. Kamchiliklari: cheklangan marshrutlar, sekin tezlik, yuklash-tushirish muammolari.</p>
          <h3 class="text-xl font-semibold mb-3">Havo transporti</h3>
          <p class="mb-4">Havo transporti - eng tez transport turi. U uzoq masofalar uchun qulay va xavfsiz. Afzalliklari: eng tez transport, uzoq masofalar, xavfsizlik. Kamchiliklari: eng qimmat transport, cheklangan yuk hajmi, havo sharoitiga bog'liq.</p>
          <h3 class="text-xl font-semibold mb-3">Dengiz transporti</h3>
          <p class="mb-4">Dengiz transporti - eng arzon transport turi. U katta yuk hajmlarini tashish imkonini beradi va uzoq masofalar uchun qulay. Afzalliklari: eng arzon transport, katta yuk hajmlari, uzoq masofalar. Kamchiliklari: eng sekin transport, portga bog'liq, havo sharoitiga bog'liq.</p>
        `,
        videos: [
          "https://pub-e29856519e414c75bfcf296d0dc7f3ad.r2.dev/Kino/1762382269471-Interstellar.mp4"
        ]
      }
    }
  },
  2: {
    day: 2,
    title: "Xalqaro logistika va transport turlari",
    description: "Xalqaro logistika asoslari, transport turlari (avtomobil, temir yo'l, havo, dengiz), ularning afzalliklari va kamchiliklari.",
    duration: "",
    topics: {
      "Xalqaro logistika asoslari": {
        title: "Xalqaro logistika asoslari",
        content: `<p>Xalqaro logistika - bu turli mamlakatlar orasida yuk va xizmatlarni tashish, saqlash va boshqarish jarayonidir.</p>`,
        videos: []
      }
    }
  },
  3: {
    day: 3,
    title: "Yuk tashish hujjatlari va shartnomalar",
    description: "CMR, AWB, Bill of Lading kabi asosiy hujjatlar, shartnoma tuzish, yuk tashish shartlari va javobgarlik masalalari.",
    duration: "",
    topics: {}
  },
  4: {
    day: 4,
    title: "Bo'jxona va rasmiylashtirish",
    description: "Bo'jxona rasmiylashtirish jarayoni, zarur hujjatlar, bojxona to'lovlari va qoidalari, import-export operatsiyalari.",
    duration: "",
    topics: {}
  },
  5: {
    day: 5,
    title: "Logistika xarajatlari va narxlash",
    description: "Logistika xarajatlari turlari, narxlash usullari, xarajatlarni hisoblash, rentabellik va foyda koeffitsiyentlari.",
    duration: "",
    topics: {}
  },
  6: {
    day: 6,
    title: "Mijozlar bilan ishlash va muloqot",
    description: "Mijozlar bilan muloqot qilish, shikoyatlar bilan ishlash, xizmat ko'rsatish standartlari, mijozlar bilan munosabatlar.",
    duration: "",
    topics: {}
  },
  7: {
    day: 7,
    title: "Logistika tizimlari va texnologiyalar",
    description: "Zamonaviy logistika tizimlari, TMS (Transport Management System), GPS kuzatuv, raqamli logistika va avtomatlashtirish.",
    duration: "",
    topics: {}
  }
};
