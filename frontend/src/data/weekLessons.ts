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
    title: "Xalqaro logistika asoslari",
    description: "Xalqaro logistika nima, nimalarni o'z ichiga oladi va qayerlarda kerak bo'ladi.",
    duration: "",
    topics: {
      "Xalqaro logistika nima?": {
        title: "Xalqaro logistika nima?",
        content: `
          <h2 class="text-2xl font-bold mb-4">Xalqaro logistika nima?</h2>
          <p class="mb-4">Xalqaro logistika — bu tovarlarni bir davlatdan boshqa davlatga yetkazib berish jarayonini rejalashtirish, tashkil etish va nazorat qilish tizimidir.</p>
          <p class="mb-4">Oddiy qilib aytganda, mahsulot ishlab chiqaruvchidan chet eldagi xaridorgacha xavfsiz, tez va arzon yetib borishi uchun qilinadigan barcha ishlar xalqaro logistika hisoblanadi.</p>
          <p class="mb-4">Logistika so'zi yunoncha "logistikos" so'zidan kelib chiqqan bo'lib, "hisob-kitob" yoki "sanash" degan ma'noni anglatadi. Zamonaviy logistika esa kengroq tushuncha bo'lib, u faqat transportni emas, balki butun tarmoqni boshqarishni o'z ichiga oladi.</p>
          <p class="mb-4"><strong>Logistika asosiy maqsadi</strong> - bu mahsulotlarni eng kam xarajat bilan va eng qisqa vaqtda manbadan maqsadgacha yetkazib berishdir.</p>
        `,
        videos: []
      },
      "Xalqaro logistika nimalarni o'z ichiga oladi?": {
        title: "Xalqaro logistika nimalarni o'z ichiga oladi?",
        content: `
          <h2 class="text-2xl font-bold mb-4">Xalqaro logistika nimalarni o'z ichiga oladi?</h2>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>🚢 <strong>Transport:</strong> dengiz, havo, temiryo'l, avtomobil</li>
            <li>📄 <strong>Hujjatlar:</strong> shartnoma, invoice, dekloratsiya, CMR, TIR CARNET, DAZVOL va boshqalar</li>
            <li>🛃 <strong>Bojxona rasmiylashtiruvi</strong></li>
            <li>📦 <strong>Ombor va yuk saqlash</strong></li>
            <li>💰 <strong>Narx va xarajatlarni hisoblash</strong></li>
            <li>🗺️ <strong>Marshrut va yo'nalish tanlash</strong></li>
            <li>⏱️ <strong>Yetkazib berish muddatini nazorat qilish</strong></li>
          </ul>
        `,
        videos: []
      },
      "Xalqaro logistika qayerlarda kerak?": {
        title: "Xalqaro logistika qayerlarda kerak?",
        content: `
          <h2 class="text-2xl font-bold mb-4">Xalqaro logistika qayerlarda kerak?</h2>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Import–eksport qiladigan kompaniyalarda va davlatlarga</li>
            <li>Savdo va ishlab chiqarish korxonalarida</li>
            <li>Logistika kompaniyalarida</li>
          </ul>
        `,
        videos: []
      },
      "Avtomobil transporti": {
        title: "Avtomobil transporti",
        content: `
          <h2 class="text-2xl font-bold mb-4">🚛 Avtomobil transporti</h2>
          <p class="mb-4"><strong>Eng moslashuvchan</strong></p>
          <h3 class="text-xl font-semibold mb-3 mt-6">Afzalliklari:</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Eshikdan eshikkacha (door to door)</li>
            <li>Tez va qulay</li>
          </ul>
          <h3 class="text-xl font-semibold mb-3 mt-6">Kamchiliklari:</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Masofa uzoq bo'lsa qimmat</li>
            <li>Og'ir yukda cheklovlar bor</li>
          </ul>
          <h3 class="text-xl font-semibold mb-3 mt-6">Qachon ishlatiladi?</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Qozog'iston, Rossiya, Turkiya</li>
            <li>MDH, SNG, YEVROPA davlatlari orasida</li>
          </ul>
        `,
        videos: []
      },
      "Temiryo'l transporti": {
        title: "Temiryo'l transporti",
        content: `
          <h2 class="text-2xl font-bold mb-4">🚆 Temiryo'l transporti</h2>
          <p class="mb-4"><strong>Barqaror va ishonchli</strong></p>
          <h3 class="text-xl font-semibold mb-3 mt-6">Afzalliklari:</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Narxi dengiz va avto o'rtasida</li>
            <li>Ob-havoga kam bog'liq</li>
          </ul>
          <h3 class="text-xl font-semibold mb-3 mt-6">Kamchiliklari:</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Har joyga bormaydi</li>
            <li>Terminalga bog'liq</li>
          </ul>
          <h3 class="text-xl font-semibold mb-3 mt-6">Qachon ishlatiladi?</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Xitoy–Markaziy Osiyo–Yevropa</li>
            <li>Og'ir va hajmli yuklar</li>
          </ul>
        `,
        videos: []
      },
      "Havo transporti": {
        title: "Havo transporti",
        content: `
          <h2 class="text-2xl font-bold mb-4">✈️ Havo transporti</h2>
          <p class="mb-4"><strong>Eng tezkor</strong></p>
          <h3 class="text-xl font-semibold mb-3 mt-6">Afzalliklari:</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Juda tez (1–5 kun)</li>
            <li>Qimmatbaho va tez buziladigan yuklar uchun</li>
          </ul>
          <h3 class="text-xl font-semibold mb-3 mt-6">Kamchiliklari:</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Eng qimmat</li>
            <li>Hajm va vazn cheklangan</li>
          </ul>
        `,
        videos: []
      },
      "Tent Fura": {
        title: "Tent Fura",
        content: `
          <h2 class="text-2xl font-bold mb-4">📦 Tent fura (Curtain-side truck / Tautliner) nima?</h2>
          <p class="mb-4">Tent fura — bu odatda yuk tashish uchun ishlatiladigan yuk mashinasi yoki yarim treyler bo'lib, yon tomonlari tent (poliester/PVC mato pardasi) bilan qoplangan bo'ladi. Bu pardalar istalgan vaqtda ochilib yoki yopilib, yukni oson tushirish va joylashtirish imkonini beradi.</p>
          <p class="mb-4">Bu turdagi furalar ko'pincha Tautliner, curtain-side trailer yoki curtainsider deb ham yuritiladi.</p>

          <h3 class="text-xl font-semibold mb-3 mt-6">🚚 Tent furaning afzalliklari</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>✅ <strong>Tez yuklash va tushirish</strong> — yon parda ochilganida forklift orqali ikki tomondan ham yuk olib chiqish mumkin, bu vaqtni sezilarli tezlashtiradi.</li>
            <li>✅ <strong>Ob-havo himoyasi</strong> — parda yomg'ir, chang, shamoldan himoya qiladi.</li>
            <li>✅ <strong>Yukni qulay joylashtirish</strong> — uzun, katta yoki notekis shakldagi yuklarni (masalan, trubalar, taxtalar) oson joylashtirish mumkin.</li>
            <li>✅ <strong>Osonlik va xavfsizlik</strong> — qo'shimcha tarp yoki qoplamalarni qo'lda tashish shart emas; parda tizimi bu jarayonni osonlashtiradi.</li>
          </ul>

          <h3 class="text-xl font-semibold mb-3 mt-6">📍 Qayerda ishlatiladi?</h3>
          <p class="mb-4">Tent furalar deyarli har qanday yuk turiga mos keladi va logistika sohasida keng qo'llaniladi:</p>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Palletlangan tovarlar</li>
            <li>Qurilish materiallari</li>
            <li>Mashina yoki sanoat uskunalari</li>
            <li>Savdo va distribyutorlik tovarlari</li>
            <li>…va boshqa ko'plab yuklar uchun.</li>
          </ul>

          <h3 class="text-xl font-semibold mb-3 mt-6">🔎 Qanday ishlaydi?</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Yon tomondagi pardalar maxsus rels bo'ylab siljiydi — yuklash joyida ularni to'liq ochish mumkin.</li>
            <li>Yuk joylashtirilgach, parda qayta yopilib, maxsus kamar va qopqoqlar bilan mahkamlanadi.</li>
            <li>Bu sistemaning afzalligi — yukni tez, samarali, bir necha qarama-qarshi nuqtadan olish.</li>
          </ul>
          <div class="my-6">
            <img src="/images/Tent.jpg" alt="Tent fura" class="w-full max-w-2xl mx-auto rounded-lg shadow-lg" />
          </div>
        `,
        videos: []
      },
      "Tent Mega": {
        title: "Tent Mega",
        content: `
          <h2 class="text-2xl font-bold mb-4">🚛 Tent Mega nima?</h2>
          <p class="mb-4">Tent Mega fura — bu katta hajmli, yon tomoni parda (tent) bilan qoplangan, uzun yuk tashish uchun mo'ljallangan treyler.</p>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li><strong>Inglizcha:</strong> Mega curtain-side trailer / Mega truck</li>
            <li><strong>Vazifasi:</strong> katta hajmli yuklarni tashish</li>
            <li><strong>Afzalligi:</strong> parda tufayli yukni tez ochish/tushirish va ob‑havo himoyasi</li>
          </ul>

          <h3 class="text-xl font-semibold mb-3 mt-6">📦 Qaysi yuklar uchun ishlatiladi?</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Paletlangan tovarlar</li>
            <li>Meva, sabzavot, qadoqlangan oziq-ovqat</li>
            <li>Sanoat va qurilish buyumlari</li>
            <li>Notekis yoki uzun yuklar</li>
          </ul>

          <h3 class="text-xl font-semibold mb-3 mt-6">✅ Afzalliklari</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Tez yuklash va tushirish (forklift yordamida)</li>
            <li>Katta hajm — ko'p yuk tashlash imkoniyati</li>
            <li>Ob‑havo himoyasi (tent tufayli)</li>
            <li>Xalqaro va ichki transportda keng qo'llaniladi</li>
          </ul>

          <h3 class="text-xl font-semibold mb-3 mt-6">❌ Kamchiliklari</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Boshqa standart furaga nisbatan yoqilg'i ko'proq sarflaydi</li>
            <li>Juda og'ir yuklarda maksimal hajm chegaralangan</li>
            <li>Shahar tor yo'llarida harakat qiyin bo'lishi mumkin</li>
          </ul>
          <div class="my-6">
            <img src="/images/Tent.jpg" alt="Tent Mega fura" class="w-full max-w-2xl mx-auto rounded-lg shadow-lg" />
          </div>
        `,
        videos: []
      },
      "REF fura": {
        title: "REF fura",
        content: `
          <h2 class="text-2xl font-bold mb-4">❄️ REF fura nima?</h2>
          <p class="mb-4">REF fura — bu sovutkich (muzlatkich) o'rnatilgan yuk mashinasi yoki yarim tirkama bo'lib, haroratni doimiy nazorat qilib, tez buziladigan yuklarni tashish uchun ishlatiladi.</p>
          <p class="mb-4"><strong>👉 Inglizcha nomi:</strong> Reefer truck / Refrigerated trailer</p>

          <h3 class="text-xl font-semibold mb-3 mt-6">🌡️ Harorat rejimi</h3>
          <p class="mb-4">REF furalar yuk turiga qarab turli haroratda ishlaydi:</p>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li><strong>+25°C dan 0°C gacha</strong> — meva, sabzavot</li>
            <li><strong>0°C dan –5°C gacha</strong> — sut mahsulotlari</li>
            <li><strong>–18°C dan –25°C gacha</strong> — muzlatilgan go'sht, baliq, muzqaymoq</li>
          </ul>
          <p class="mb-4">⚠️ <strong>Harorat yo'l davomida avtomatik saqlanadi.</strong></p>

          <h3 class="text-xl font-semibold mb-3 mt-6">🧾 REF fura uchun kerakli hujjatlar</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>CMR</li>
            <li>Invoice / Packing list</li>
            <li>Sanitariya sertifikati (ayrim yuklarda)</li>
            <li>TIR carnet (xalqaro bo'lsa)</li>
            <li>Temperature report (ba'zan talab qilinadi)</li>
          </ul>
          <div class="my-6">
            <img src="/images/Ref.jpg" alt="REF fura" class="w-full max-w-2xl mx-auto rounded-lg shadow-lg" />
          </div>
        `,
        videos: []
      },
      "Paravoz fura": {
        title: "Paravoz fura",
        content: `
          <h2 class="text-2xl font-bold mb-4">🚛 Paravoz fura nima?</h2>
          <p class="mb-4">Paravoz fura — bu bir nechta bo'linmalardan iborat, ketma-ket ulanadigan yuk mashinalari tizimi, ya'ni bir fura boshqa fura bilan "qo'shib", katta yuk tashish imkonini beradi.</p>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li><strong>Inglizchasi:</strong> Road train / Truck convoy</li>
            <li><strong>Asosan:</strong> Avstraliya, Rossiya, Kanada va uzoq masofali transportda ishlatiladi.</li>
          </ul>

          <h3 class="text-xl font-semibold mb-3 mt-6">⚙️ Tuzilishi</h3>
          <ol class="list-decimal list-inside mb-4 space-y-2">
            <li><strong>Bosh fura (lokomotiv rolida)</strong> – old qism, yo'lni boshqaradi</li>
            <li><strong>Qo'shma vagonlar/furalar</strong> – orqa furalar yukni tashish uchun ulanadi</li>
            <li><strong>Tormoz va bog'lanish tizimi</strong> – barcha furalar xavfsiz va birga harakatlanadi</li>
          </ol>

          <h3 class="text-xl font-semibold mb-3 mt-6">📦 Afzalliklari</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>✅ Bir martada katta hajmda yuk tashlash</li>
            <li>✅ Yoqilg'i tejamkorligi (bitta bosh mashina ko'p yuk tortadi)</li>
            <li>✅ Masofa tejash — uzoq masofalarda samarali</li>
            <li>✅ Moslashuvchan — turli turdagi yuklar uchun bo'linmalar qo'shilishi mumkin</li>
          </ul>

          <h3 class="text-xl font-semibold mb-3 mt-6">❌ Kamchiliklari</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>❌ Shahar yoki tor yo'llarda ishlash qiyin</li>
            <li>❌ Maxsus tormoz tizimi va haydovchi malakasi talab qilinadi</li>
          </ul>
          <div class="my-6">
            <img src="/images/Paravoz.jpg" alt="Paravoz fura" class="w-full max-w-2xl mx-auto rounded-lg shadow-lg" />
          </div>
        `,
        videos: []
      },
      "Ploshadka fura": {
        title: "Ploshadka fura",
        content: `
          <h2 class="text-2xl font-bold mb-4">🚛 Ploshadka fura nima?</h2>
          <p class="mb-4">Ploshadka fura — bu yonlari yoki tomi bo'lmagan, tekis platforma shaklidagi yuk mashinasi yoki yarim treyler.</p>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li><strong>Inglizchasi:</strong> Flatbed truck / Platform trailer</li>
            <li><strong>Vazifasi:</strong> katta, og'ir yoki notekis shakldagi yuklarni tashish.</li>
          </ul>

          <h3 class="text-xl font-semibold mb-3 mt-6">🚚 Afzalliklari</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>✅ Yuklash va tushirish tez va oson (forklift yoki kran orqali)</li>
            <li>✅ Turli shakldagi yuklarga mos</li>
            <li>✅ Uzoq masofalarda og'ir yuk tashish imkoniyati</li>
          </ul>

          <h3 class="text-xl font-semibold mb-3 mt-6">❌ Kamchiliklari</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>❌ Ob‑havo sharoitidan himoyasiz (yomg'ir, qor, chang)</li>
            <li>❌ Ba'zan yukni xavfsiz bog'lash qiyin bo'lishi mumkin</li>
            <li>❌ Ba'zi hududlarda ruxsat va limitlar talab qilinadi</li>
          </ul>

          <h3 class="text-xl font-semibold mb-3 mt-6">🌍 Qayerda ishlatiladi?</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Qurilish sohasida</li>
            <li>Sanoat va ishlab chiqarishda</li>
            <li>Yirik sanoat yoki qishloq xo'jaligi yuklarini tashishda</li>
          </ul>
          <div class="my-6">
            <img src="/images/" alt="Ploshadka fura" class="w-full max-w-2xl mx-auto rounded-lg shadow-lg" />
          </div>
        `,
        videos: []
      }
    }
  },
  2: {
    day: 2,
    title: "Transport turlari va bizning logistika transport turlari",
    description: "Logistikadagi transport turlari, xalqaro logistikada qanday transport turlari bilan ishlanadi va ularning vazifalari. Tent fura, REF fura, Paravoz, Ploshadka.",
    duration: "",
    topics: {
      "Logistikadagi Transport Turlari": {
        title: "Logistikadagi Transport Turlari",
        content: `
          <h2 class="text-2xl font-bold mb-4">Logistikadagi Transport Turlari</h2>
          <p class="mb-4">Xalqaro logistikada turli transport turlari ishlatiladi. Har bir transport turi o'ziga xos afzalliklar va kamchiliklarni o'z ichiga oladi.</p>
        `,
        videos: []
      },
      "Dengiz transporti": {
        title: "Dengiz transporti",
        content: `
          <h2 class="text-2xl font-bold mb-4">🚢 Dengiz transporti</h2>
          <p class="mb-4"><strong>Eng ko'p ishlatiladi</strong></p>
          <h3 class="text-xl font-semibold mb-3 mt-6">Afzalliklari:</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Eng arzon</li>
            <li>Katta hajmdagi yuklar uchun qulay</li>
          </ul>
          <h3 class="text-xl font-semibold mb-3 mt-6">Kamchiliklari:</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Sekin (20–45 kun)</li>
            <li>Portga bog'liq</li>
          </ul>
          <h3 class="text-xl font-semibold mb-3 mt-6">Qachon ishlatiladi?</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Xitoy, AQSH, Yevropadan katta yuklar</li>
            <li>Konteyner yuklar (FCL, LCL)</li>
          </ul>
        `,
        videos: []
      },
      "Avtomobil transporti (2-kun)": {
        title: "Avtomobil transporti",
        content: `
          <h2 class="text-2xl font-bold mb-4">🚛 Avtomobil transporti</h2>
          <p class="mb-4"><strong>Eng moslashuvchan</strong></p>
          <h3 class="text-xl font-semibold mb-3 mt-6">Afzalliklari:</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Eshikdan eshikkacha (door to door)</li>
            <li>Tez va qulay</li>
          </ul>
        `,
        videos: []
      },
      "Temiryo'l transporti (2-kun)": {
        title: "Temiryo'l transporti",
        content: `
          <h2 class="text-2xl font-bold mb-4">🚆 Temiryo'l transporti</h2>
          <p class="mb-4"><strong>Barqaror va ishonchli</strong></p>
          <h3 class="text-xl font-semibold mb-3 mt-6">Afzalliklari:</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Narxi dengiz va avto o'rtasida</li>
            <li>Ob-havoga kam bog'liq</li>
          </ul>
          <h3 class="text-xl font-semibold mb-3 mt-6">Kamchiliklari:</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Har joyga bormaydi</li>
            <li>Terminalga bog'liq</li>
          </ul>
          <h3 class="text-xl font-semibold mb-3 mt-6">Qachon ishlatiladi?</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Xitoy–Markaziy Osiyo–Yevropa</li>
            <li>Og'ir va hajmli yuklar</li>
          </ul>
        `,
        videos: []
      },
      "Havo transporti (2-kun)": {
        title: "Havo transporti",
        content: `
          <h2 class="text-2xl font-bold mb-4">✈️ Havo transporti</h2>
          <p class="mb-4"><strong>Eng tezkor</strong></p>
          <h3 class="text-xl font-semibold mb-3 mt-6">Afzalliklari:</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Juda tez (1–5 kun)</li>
            <li>Qimmatbaho va tez buziladigan yuklar uchun</li>
          </ul>
          <h3 class="text-xl font-semibold mb-3 mt-6">Kamchiliklari:</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Eng qimmat</li>
            <li>Hajm va vazn cheklangan</li>
          </ul>
          <h3 class="text-xl font-semibold mb-3 mt-6">Qachon ishlatiladi?</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Elektronika, dori-darmon</li>
            <li>Shoshilinch yuklar</li>
          </ul>
        `,
        videos: []
      },
      "Multimodal transport": {
        title: "Multimodal transport",
        content: `
          <h2 class="text-2xl font-bold mb-4">🚚🚢 Multimodal transport</h2>
          <p class="mb-4"><strong>Bir nechta transport aralashmasi</strong></p>
          <p class="mb-4">Masalan: 🚛 + 🚆 + 🚢</p>
          <h3 class="text-xl font-semibold mb-3 mt-6">Afzalliklari:</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Tejamkor</li>
            <li>Murakkab yo'nalishlarda qulay</li>
          </ul>
          <h3 class="text-xl font-semibold mb-3 mt-6">Kamchiligi:</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Rejalashtirish murakkabroq</li>
          </ul>
        `,
        videos: []
      },
      "Bizning Logistika transport turlari": {
        title: "Bizning Logistika transport turlari",
        content: `
          <h2 class="text-2xl font-bold mb-4">Bizning Logistika faqat (TRANSPORT ORQALI) ishlanadi</h2>
          <p class="mb-4">Bizning logistika kompaniyamiz quyidagi transport turlari bilan ishlaydi:</p>
          <ol class="list-decimal list-inside mb-4 space-y-2">
            <li><strong>Tent fura</strong></li>
            <li><strong>REF fura</strong></li>
            <li><strong>Paravoz</strong></li>
            <li><strong>Ploshadka</strong></li>
          </ol>
        `,
        videos: []
      },
      "Tent Fura (2-kun)": {
        title: "Tent Fura",
        content: `
          <h2 class="text-2xl font-bold mb-4">📦 Tent fura (Curtain-side truck / Tautliner) nima?</h2>
          <p class="mb-4">Tent fura — bu odatda yuk tashish uchun ishlatiladigan yuk mashinasi yoki yarim treyler bo'lib, yon tomonlari tent (poliester/PVC mato pardasi) bilan qoplangan bo'ladi. Bu pardalar istalgan vaqtda ochilib yoki yopilib, yukni oson tushirish va joylashtirish imkonini beradi.</p>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li><strong>Struktura:</strong> Qattiq taglik, tom va old devor bo'ladi, yon tomonlari esa yengil, kuchli, ob-havo sharoitiga chidamli pardalar orqali yopiladi.</li>
            <li><strong>Yon pardalar:</strong> Ular traektoriyali rels bo'ylab siljiydi va yukni har ikki tomondan ham tez ochib-yopish imkonini beradi.</li>
          </ul>
          <div class="my-6">
            <img src="/images/Tent.jpg" alt="Tent fura" class="w-full max-w-2xl mx-auto rounded-lg shadow-lg" />
          </div>
        `,
        videos: []
      },
      "Tent Mega (2-kun)": {
        title: "Tent Mega",
        content: `
          <h2 class="text-2xl font-bold mb-4">🚛 Tent Mega nima?</h2>
          <p class="mb-4">Tent Mega fura — bu katta hajmli, yon tomoni parda (tent) bilan qoplangan, uzun yuk tashish uchun mo'ljallangan treyler.</p>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li><strong>Inglizcha:</strong> Mega curtain-side trailer / Mega truck</li>
            <li><strong>Vazifasi:</strong> katta hajmli yuklarni tashish</li>
            <li><strong>Afzalligi:</strong> parda tufayli yukni tez ochish/tushirish va ob‑havo himoyasi</li>
          </ul>

          <h3 class="text-xl font-semibold mb-3 mt-6">📏 Tent Mega hajmlari</h3>
          <p class="mb-4">Odatiy kattaliklar (O'zbekiston va MDH bozorida ishlatiladi):</p>
          <div class="overflow-x-auto mb-4">
            <table class="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr class="bg-gray-100">
                  <th class="border border-gray-300 px-4 py-2 text-left">Hajm</th>
                  <th class="border border-gray-300 px-4 py-2 text-left">Kub metr (m³)</th>
                  <th class="border border-gray-300 px-4 py-2 text-left">Tavsif</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="border border-gray-300 px-4 py-2"><strong>96 kub</strong></td>
                  <td class="border border-gray-300 px-4 py-2">96 m³</td>
                  <td class="border border-gray-300 px-4 py-2">Standart yuklar uchun, o'rtacha uzunlik</td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2"><strong>100 kub</strong></td>
                  <td class="border border-gray-300 px-4 py-2">100 m³</td>
                  <td class="border border-gray-300 px-4 py-2">Biroz kattaroq, uzunroq yuklar uchun</td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2"><strong>105 kub</strong></td>
                  <td class="border border-gray-300 px-4 py-2">105 m³</td>
                  <td class="border border-gray-300 px-4 py-2">Katta va notekis shakldagi yuklarni joylashtirish oson</td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2"><strong>110 kub</strong></td>
                  <td class="border border-gray-300 px-4 py-2">110 m³</td>
                  <td class="border border-gray-300 px-4 py-2">Maksimal mega hajm, katta paletli yuklar va sanoat mahsulotlari uchun</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 class="text-xl font-semibold mb-3 mt-6">⚙️ Xususiyatlari</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li><strong>Yon parda (tent):</strong> yukni har ikki tomondan tushirish imkonini beradi</li>
            <li><strong>Tom yopiq yoki ochiq variant:</strong> yomg'ir va changdan himoya qiladi</li>
            <li><strong>Mega uzunlik:</strong> 13–14 metr gacha (ba'zi modellarda)</li>
            <li><strong>Yuk sig'imi:</strong> 20–24 tonnagacha bo'lishi mumkin (yuk turiga qarab)</li>
          </ul>

          <h3 class="text-xl font-semibold mb-3 mt-6">📦 Qaysi yuklar uchun ishlatiladi?</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Paletlangan tovarlar</li>
            <li>Meva, sabzavot, qadoqlangan oziq-ovqat</li>
            <li>Sanoat va qurilish buyumlari</li>
            <li>Notekis yoki uzun yuklar</li>
          </ul>
          <div class="my-6">
            <img src="/images/Tent.jpg" alt="Tent Mega fura" class="w-full max-w-2xl mx-auto rounded-lg shadow-lg" />
          </div>
        `,
        videos: []
      },
      "REF fura (2-kun)": {
        title: "REF fura",
        content: `
          <h2 class="text-2xl font-bold mb-4">❄️ REF fura nima?</h2>
          <p class="mb-4">REF fura — bu sovutkich (muzlatkich) o'rnatilgan yuk mashinasi yoki yarim tirkama bo'lib, haroratni doimiy nazorat qilib, tez buziladigan yuklarni tashish uchun ishlatiladi.</p>
          <p class="mb-4"><strong>👉 Inglizcha nomi:</strong> Reefer truck / Refrigerated trailer</p>

          <h3 class="text-xl font-semibold mb-3 mt-6">🌡️ Harorat rejimi</h3>
          <p class="mb-4">REF furalar yuk turiga qarab turli haroratda ishlaydi:</p>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li><strong>+25°C dan 0°C gacha</strong> — meva, sabzavot</li>
            <li><strong>0°C dan –5°C gacha</strong> — sut mahsulotlari</li>
            <li><strong>–18°C dan –25°C gacha</strong> — muzlatilgan go'sht, baliq, muzqaymoq</li>
          </ul>
          <p class="mb-4">⚠️ <strong>Harorat yo'l davomida avtomatik saqlanadi.</strong></p>

          <h3 class="text-xl font-semibold mb-3 mt-6">📦 Qanday yuklar tashiladi?</h3>
          <p class="mb-4">REF fura asosan quyidagi yuklar uchun ishlatiladi:</p>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>🥩 Go'sht va parranda mahsulotlari</li>
            <li>🐟 Baliq va dengiz mahsulotlari</li>
            <li>🥛 Sut, yogurt, pishloq</li>
            <li>🍎 Meva va sabzavot</li>
            <li>💊 Dori-darmonlar</li>
            <li>🍫 Shokolad va tez eriydigan mahsulotlar</li>
          </ul>

          <h3 class="text-xl font-semibold mb-3 mt-6">🚚 REF furaning afzalliklari</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>✅ Haroratni aniq saqlaydi</li>
            <li>✅ Yuk buzilmaydi</li>
            <li>✅ Uzoq masofaga mos</li>
            <li>✅ Xalqaro tashuvlarda talab yuqori</li>
            <li>✅ Sanitariya talablariga mos</li>
          </ul>

          <h3 class="text-xl font-semibold mb-3 mt-6">❌ Kamchiliklari</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>❌ Ijarasi oddiy furaga nisbatan qimmatroq</li>
            <li>❌ Yoqilg'i sarfi ko'proq</li>
            <li>❌ Texnik nazorat doimiy bo'lishi kerak</li>
          </ul>

          <h3 class="text-xl font-semibold mb-3 mt-6">🧾 REF fura uchun kerakli hujjatlar</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>CMR</li>
            <li>Invoice / Packing list</li>
            <li>Sanitariya sertifikati (ayrim yuklarda)</li>
            <li>TIR carnet (xalqaro bo'lsa)</li>
            <li>Temperature report (ba'zan talab qilinadi)</li>
          </ul>
          <div class="my-6">
            <img src="/images/Ref.jpg" alt="REF fura" class="w-full max-w-2xl mx-auto rounded-lg shadow-lg" />
          </div>
        `,
        videos: []
      },
      "Paravoz fura (2-kun)": {
        title: "Paravoz fura",
        content: `
          <h2 class="text-2xl font-bold mb-4">🚛 Paravoz fura nima?</h2>
          <p class="mb-4">Paravoz fura — bu bir nechta bo'linmalardan iborat, ketma-ket ulanadigan yuk mashinalari tizimi, ya'ni bir fura boshqa fura bilan "qo'shib", katta yuk tashish imkonini beradi.</p>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li><strong>Inglizchasi:</strong> Road train / Truck convoy</li>
            <li><strong>Asosan:</strong> Avstraliya, Rossiya, Kanada va uzoq masofali transportda ishlatiladi.</li>
          </ul>

          <h3 class="text-xl font-semibold mb-3 mt-6">⚙️ Tuzilishi</h3>
          <ol class="list-decimal list-inside mb-4 space-y-2">
            <li><strong>Bosh fura (lokomotiv rolida)</strong> – old qism, yo'lni boshqaradi</li>
            <li><strong>Qo'shma vagonlar/furalar</strong> – orqa furalar yukni tashish uchun ulanadi</li>
            <li><strong>Tormoz va bog'lanish tizimi</strong> – barcha furalar xavfsiz va birga harakatlanadi</li>
          </ol>

          <h3 class="text-xl font-semibold mb-3 mt-6">📦 Afzalliklari</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>✅ Bir martada katta hajmda yuk tashlash</li>
            <li>✅ Yoqilg'i tejamkorligi (bitta bosh mashina ko'p yuk tortadi)</li>
            <li>✅ Masofa tejash — uzoq masofalarda samarali</li>
            <li>✅ Moslashuvchan — turli turdagi yuklar uchun bo'linmalar qo'shilishi mumkin</li>
          </ul>

          <h3 class="text-xl font-semibold mb-3 mt-6">❌ Kamchiliklari</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>❌ Shahar yoki tor yo'llarda ishlash qiyin</li>
            <li>❌ Maxsus tormoz tizimi va haydovchi malakasi talab qilinadi</li>
            <li>❌ Yo'l va infrastruktura talab qiladi</li>
          </ul>

          <h3 class="text-xl font-semibold mb-3 mt-6">🌍 Qayerda ishlatiladi?</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Uzoq masofali yuk tashish</li>
            <li>Avstraliya, Rossiya, Kanada kabi keng hududlarda</li>
            <li>Qishloq xo'jaligi mahsulotlari, sanoat tovarlari, konteynerlar</li>
          </ul>
          <div class="my-6">
            <img src="/images/Paravoz.jpg" alt="Paravoz fura" class="w-full max-w-2xl mx-auto rounded-lg shadow-lg" />
          </div>
        `,
        videos: []
      },
      "Ploshadka fura (2-kun)": {
        title: "Ploshadka fura",
        content: `
          <h2 class="text-2xl font-bold mb-4">🚛 Ploshadka fura nima?</h2>
          <p class="mb-4">Ploshadka fura — bu yonlari yoki tomi bo'lmagan, tekis platforma shaklidagi yuk mashinasi yoki yarim treyler.</p>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li><strong>Inglizchasi:</strong> Flatbed truck / Platform trailer</li>
            <li><strong>Vazifasi:</strong> katta, og'ir yoki notekis shakldagi yuklarni tashish.</li>
          </ul>

          <h3 class="text-xl font-semibold mb-3 mt-6">⚙️ Tuzilishi</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li><strong>Tekis taglik</strong> – odatda metall yoki yog'och plitalardan iborat</li>
            <li><strong>Yon devor yoki tomi yo'q</strong> – yukni ko'tarish va tushirish oson</li>
            <li><strong>Yukni bog'lash tizimi</strong> – kamarlari, zanjirlari yoki maxsus tutqichlar yordamida xavfsiz bog'lanadi</li>
          </ul>

          <h3 class="text-xl font-semibold mb-3 mt-6">📦 Qaysi yuklar uchun ishlatiladi?</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Qurilish materiallari: trubalar, temir profillar, yog'och taxtalar</li>
            <li>Mashina va texnika uskunalari</li>
            <li>Katta konteynerlar yoki metall buyumlar</li>
            <li>Notekis yoki standart bo'lmagan shakldagi yuklar</li>
          </ul>

          <h3 class="text-xl font-semibold mb-3 mt-6">🚚 Afzalliklari</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>✅ Yuklash va tushirish tez va oson (forklift yoki kran orqali)</li>
            <li>✅ Turli shakldagi yuklarga mos</li>
            <li>✅ Uzoq masofalarda og'ir yuk tashish imkoniyati</li>
          </ul>

          <h3 class="text-xl font-semibold mb-3 mt-6">❌ Kamchiliklari</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>❌ Ob‑havo sharoitidan himoyasiz (yomg'ir, qor, chang)</li>
            <li>❌ Ba'zan yukni xavfsiz bog'lash qiyin bo'lishi mumkin</li>
            <li>❌ Ba'zi hududlarda ruxsat va limitlar talab qilinadi</li>
          </ul>

          <h3 class="text-xl font-semibold mb-3 mt-6">🌍 Qayerda ishlatiladi?</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Qurilish sohasida</li>
            <li>Sanoat va ishlab chiqarishda</li>
            <li>Yirik sanoat yoki qishloq xo'jaligi yuklarini tashishda</li>
          </ul>
        `,
        videos: []
      }
    }
  },
  3: {
    day: 3,
    title: "Hujjatlar",
    description: "CMR (SMR), TIR CARNET, DAZVOL hujjatlari va ularning maqsadlari.",
    duration: "",
    topics: {}
  },
  4: {
    day: 4,
    title: "Dispecherlik va Telegram gruppalar",
    description: "Xalqaro logistika sohasida dispecher bo'lib ishlash, Telegram gruppalariga a'zo bo'lish, yuk ma'lumotlarini olish va shablonlar.",
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
