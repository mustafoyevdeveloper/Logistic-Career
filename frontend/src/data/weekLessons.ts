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
      "Avtomobil transporti": {
        title: "Avtomobil transporti",
        content: `
          <h2 class="text-2xl font-bold mb-4">🚛 Avtomobil transporti</h2>
          <p class="mb-4"><strong>Eng moslashuvchan</strong></p>
          <h3 class="text-xl font-semibold mb-3 mt-6">Afzalliklari:</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Eshikdan eshikkacha (door to door)</li>
            <li>Tez va qulay</li>
            <li>Qozog'iston, Rossiya, MDH, SNG va Yevropa davlatlari orasida ishlaydi.</li>
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
      "Tent Fura": {
        title: "Tent Fura",
        content: `
          <h2 class="text-2xl font-bold mb-4">📦 Tent fura (Curtain-side truck / Tautliner) nima?</h2>
          <p class="mb-4">Tent fura — bu odatda yuk tashish uchun ishlatiladigan yuk mashinasi yoki yarim treyler bo'lib, yon tomonlari tent (poliester/PVC mato pardasi) bilan qoplangan bo'ladi. Bu pardalar istalgan vaqtda ochilib yoki yopilib, yukni oson tushirish va joylashtirish imkonini beradi.</p>
          <p class="mb-4">Bu turdagi furalar ko'pincha Tautliner, curtain-side trailer yoki curtainsider deb ham yuritiladi.</p>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li><strong>Struktura:</strong> Qattiq taglik, tom va old devor bo'ladi, yon tomonlari esa yengil, kuchli, ob-havo sharoitiga chidamli pardalar orqali yopiladi.</li>
            <li><strong>Yon pardalar:</strong> Ular traektoriyali rels bo'ylab siljiydi va yukni har ikki tomondan ham tez ochib-yopish imkonini beradi.</li>
          </ul>
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
          <h3 class="text-xl font-semibold mb-3 mt-6">✅ Afzalliklari</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Tez yuklash va tushirish (forklift yordamida)</li>
            <li>Katta hajm — ko‘p yuk tashlash imkoniyati</li>
            <li>Ob-havo himoyasi (tent tufayli)</li>
            <li>Xalqaro va ichki transportda keng qo‘llaniladi</li>
          </ul>

          <h3 class="text-xl font-semibold mb-3 mt-6">❌ Kamchiliklari</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Boshqa standart furaga nisbatan yoqilg‘i ko‘proq sarflaydi</li>
            <li>Juda og‘ir yuklarda maksimal hajm chegaralangan</li>
            <li>Shahar tor yo‘llarida harakat qiyin bo‘lishi mumkin</li>
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
      "Ploshadka fura": {
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
          <div class="my-6">
            <img src="/images/Plashadka.jpg" alt="Ploshadka fura" class="w-full max-w-2xl mx-auto rounded-lg shadow-lg" />
          </div>
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
    topics: {
      "SMR (CMR) nima?": {
        title: "SMR (CMR) nima?",
        content: `
          <h2 class="text-2xl font-bold mb-4">SMR NIMA?</h2>
          <p class="mb-4">Logistikada SMR deb aytilayotgani ko'pincha CMR (СMR) hujjati nazarda tutiladi. Odamlar talaffuzda SMR deb yuborishadi.</p>
          
          <h3 class="text-xl font-semibold mb-3 mt-6">CMR (SMR) qanday hujjat?</h3>
          <p class="mb-4">CMR — bu xalqaro avtomobil yuk tashish yuk xati (transport hujjati).</p>

          <h3 class="text-xl font-semibold mb-3 mt-6">Qachon kerak bo'ladi?</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Yuk bir davlatdan boshqa davlatga avtomobil orqali olib o'tilsa</li>
            <li>Haydovchi, ekspeditor va bojxona uchun majburiy hujjat</li>
          </ul>

          <h3 class="text-xl font-semibold mb-3 mt-6">CMR (SMR) da nimalar yoziladi?</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>🚚 Yuboruvchi (Sender)</li>
            <li>📦 Qabul qiluvchi (Consignee)</li>
            <li>🏭 Yuk nomi va miqdori</li>
            <li>⚖️ Og'irligi</li>
            <li>🌍 Yuklash va tushirish manzili</li>
            <li>🚛 Mashina va haydovchi ma'lumoti</li>
            <li>✍️ Tomonlarning imzolari</li>
          </ul>

          <h3 class="text-xl font-semibold mb-3 mt-6">Kimlar uchun muhim?</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Logist</li>
            <li>Haydovchi</li>
            <li>Ekspeditor</li>
            <li>Bojxona organlari</li>
          </ul>
          <div class="my-6">
            <img src="/images/SMR Dokument.jpg" alt="CMR (SMR) hujjati" class="w-full max-w-2xl mx-auto rounded-lg shadow-lg" />
          </div>
        `,
        videos: []
      },
      "TIR CARNET nima?": {
        title: "TIR CARNET nima?",
        content: `
          <h2 class="text-2xl font-bold mb-4">🚛 TIR Carnet nima?</h2>
          <p class="mb-4">TIR Carnet — bu xalqaro tranzit bojxona hujjati, yuk mashinasi bir nechta davlat orqali bojxona to'lovisiz o'tishi uchun ishlatiladi.</p>
          
          <h3 class="text-xl font-semibold mb-3 mt-6">🔑 Oddiy qilib aytganda:</h3>
          <p class="mb-4">TIR Carnet bo'lsa 👉 yuk har bir chegarada ochilmaydi, bojxona faqat plomba va hujjatni tekshiradi.</p>

          <h3 class="text-xl font-semibold mb-3 mt-6">📌 Qachon kerak bo'ladi?</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Yuk 2 yoki undan ko'p davlatdan o'tsa</li>
            <li>Avtomobil transportida</li>
            <li>Yopiq kuzov / plombalanadigan mashinada</li>
          </ul>

          <h3 class="text-xl font-semibold mb-3 mt-6">📄 TIR Carnet ichida nima bo'ladi?</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Yuboruvchi va qabul qiluvchi</li>
            <li>Yuk tavsifi</li>
            <li>Marshrut (qaysi davlatlardan o'tadi)</li>
            <li>Bojxona muhrlari (plomba)</li>
          </ul>

          <h3 class="text-xl font-semibold mb-3 mt-6">👤 Kim foydalanadi?</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Xalqaro haydovchi</li>
            <li>Transport kompaniya</li>
            <li>Logist</li>
            <li>Ekspeditor</li>
          </ul>

          <h3 class="text-xl font-semibold mb-3 mt-6">✅ Afzalliklari:</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>⏱ Chegarada tez o'tadi</li>
            <li>💰 Garov yoki boj to'lovi yo'q</li>
            <li>📉 Xarajat kamroq</li>
          </ul>

          <h3 class="text-xl font-semibold mb-3 mt-6">❌ Qachon ishlatilmaydi?</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Ichki (bir davlat ichida) yuklarda</li>
            <li>Temiryo'l yoki avia yukda</li>
            <li>Ochiq kuzovda (plomba bo'lmasa)</li>
          </ul>
          <div class="my-6">
            <img src="/images/Tir Carnet Foto.jpg" alt="TIR CARNET hujjati" class="w-full max-w-2xl mx-auto rounded-lg shadow-lg" />
          </div>
        `,
        videos: []
      },
      "DAZVOL (Dozvol) nima?": {
        title: "DAZVOL (Dozvol) nima?",
        content: `
          <h2 class="text-2xl font-bold mb-4">DAZVOL NIMA?</h2>
          <p class="mb-4">Dazvol (to'g'risi: Dozvol / Permit) — bu yuk mashinasiga beriladigan ruxsatnoma, ya'ni chet davlat hududiga kirish va u yerda yuk tashish uchun hujjat.</p>
          
          <h3 class="text-xl font-semibold mb-3 mt-6">📌 Oddiy qilib aytganda:</h3>
          <p class="mb-4">Dazvol bo'lmasa 👉 yuk mashinasi chet davlatga kira olmaydi yoki u yerda yuk tashiy olmaydi.</p>

          <h3 class="text-xl font-semibold mb-3 mt-6">🧾 Dozvol (Dazvol) nimalarni o'z ichiga oladi?</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Qaysi davlat uchun berilgani</li>
            <li>Bir martalik yoki ko'p martalik</li>
            <li>Mashina raqami</li>
            <li>Yuk turi</li>
            <li>Amal qilish muddati</li>
          </ul>

          <h3 class="text-xl font-semibold mb-3 mt-6">🌍 Qaysi hollarda kerak bo'ladi?</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Xalqaro avtomobil yuk tashishda</li>
            <li>Tranzit yoki ikki tomonlama tashishda</li>
            <li>O'zbekiston ↔ boshqa davlatlar o'rtasida</li>
          </ul>

          <h3 class="text-xl font-semibold mb-3 mt-6">❌ Qachon kerak emas?</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>TIR Carnet o'rnini bosa olmaydi</li>
            <li>Ichki (O'zbekiston ichida) tashishda</li>
            <li>Ba'zi kvotasiz davlatlarda (kam hollarda)</li>
          </ul>
          <div class="my-6">
            <img src="/images/Dazvol Dokument.jpg" alt="DAZVOL hujjati" class="w-full max-w-2xl mx-auto rounded-lg shadow-lg" />
          </div>
        `,
        videos: []
      },
      "Hujjatlar jadvali": {
        title: "Hujjatlar jadvali",
        content: `
          <h2 class="text-2xl font-bold mb-4">📋 Xalqaro logistika hujjatlari (sodda jadval)</h2>
          <div class="overflow-x-auto mb-4">
            <table class="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr class="bg-gray-100">
                  <th class="border border-gray-300 px-4 py-2 text-left">Hujjat nomi</th>
                  <th class="border border-gray-300 px-4 py-2 text-left">Nima uchun kerak</th>
                  <th class="border border-gray-300 px-4 py-2 text-left">Qachon ishlatiladi</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="border border-gray-300 px-4 py-2"><strong>CMR (SMR)</strong></td>
                  <td class="border border-gray-300 px-4 py-2">Yuk tashish hujjati (kimdan → kimga)</td>
                  <td class="border border-gray-300 px-4 py-2">Xalqaro avtomobil yukida</td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2"><strong>TIR Carnet</strong></td>
                  <td class="border border-gray-300 px-4 py-2">Bojxona chegaralaridan tez o'tish</td>
                  <td class="border border-gray-300 px-4 py-2">Bir nechta davlatdan o'tganda</td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2"><strong>Dazvol (Dozvol)</strong></td>
                  <td class="border border-gray-300 px-4 py-2">Davlatga kirish uchun ruxsat</td>
                  <td class="border border-gray-300 px-4 py-2">Chet davlat hududida yuk tashishda</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 class="text-xl font-semibold mb-3 mt-6">🔑 Juda qisqa eslab qolish uchun:</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li><strong>CMR</strong> — yukning pasporti 📄</li>
            <li><strong>TIR</strong> — bojxona uchun qulaylik 🛃</li>
            <li><strong>Dazvol</strong> — yo'lga ruxsat 🚦</li>
          </ul>

          <h3 class="text-xl font-semibold mb-3 mt-6">📸 Hujjatlar rasmlari:</h3>
          
          <div class="my-6">
            <h4 class="text-lg font-semibold mb-2">CMR (SMR) — yukning pasporti 📄</h4>
            <img src="/images/SMR Dokument.jpg" alt="CMR (SMR) hujjati" class="w-full max-w-2xl mx-auto rounded-lg shadow-lg" />
          </div>

          <div class="my-6">
            <h4 class="text-lg font-semibold mb-2">TIR CARNET — bojxona uchun qulaylik 🛃</h4>
            <img src="/images/Tir Carnet Foto.jpg" alt="TIR CARNET hujjati" class="w-full max-w-2xl mx-auto rounded-lg shadow-lg" />
          </div>

          <div class="my-6">
            <h4 class="text-lg font-semibold mb-2">DAZVOL — yo'lga ruxsat 🚦</h4>
            <img src="/images/Dazvol Dokument.jpg" alt="DAZVOL hujjati" class="w-full max-w-2xl mx-auto rounded-lg shadow-lg" />
          </div>
        `,
        videos: []
      }
    }
  },
  4: {
    day: 4,
    title: "Dispecherlik va Telegram gruppalar",
    description: "Xalqaro logistika sohasida dispecher bo'lib ishlash, Telegram gruppalariga a'zo bo'lish, yuk ma'lumotlarini olish va shablonlar.",
    duration: "",
    topics: {
      "Dispecherlik nima?": {
        title: "Dispecherlik nima?",
        content: `
          <h2 class="text-2xl font-bold mb-4">XALQARO LOGISTIKA sohasida biz dispecher bo'lib o'z ish faoliyatimizni yuritamiz</h2>
          <p class="mb-4">Dispecher — bu logistika kompaniyasida yuk tashish jarayonlarini boshqaruvchi, haydovchilar va mijozlar o'rtasida aloqadorlikni ta'minlovchi mutaxassis.</p>
          <p class="mb-4">Dispecherning asosiy vazifalari:</p>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Yuklarni topish va tashlashni tashkil etish</li>
            <li>Haydovchilar bilan aloqa o'rnatish</li>
            <li>Marshrutlarni rejalashtirish</li>
            <li>Yuk tashish jarayonini kuzatish va nazorat qilish</li>
            <li>Mijozlar bilan muloqot qilish</li>
          </ul>
        `,
        videos: []
      },
      "Telegram gruppalar": {
        title: "Telegram gruppalar",
        content: `
          <h2 class="text-2xl font-bold mb-4">Telegram gruppalarga a'zo bo'ling:</h2>
          <p class="mb-4">Quyidagi Telegram gruppalarga a'zo bo'ling va yuklar haqida ma'lumot oling:</p>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li><strong>Logistica 1:</strong> <a href="https://t.me/addlist/tzmLfyj7VCliOTdi" target="_blank" class="text-blue-600 hover:underline">https://t.me/addlist/tzmLfyj7VCliOTdi</a></li>
            <li><strong>Logistica 2:</strong> <a href="https://t.me/addlist/l36MEtBdB7k4NWJi" target="_blank" class="text-blue-600 hover:underline">https://t.me/addlist/l36MEtBdB7k4NWJi</a></li>
            <li><strong>Logistica 3:</strong> <a href="https://t.me/addlist/GlMyk38n8Z5iMTEy" target="_blank" class="text-blue-600 hover:underline">https://t.me/addlist/GlMyk38n8Z5iMTEy</a></li>
            <li><strong>Logistica 4:</strong> <a href="https://t.me/addlist/MObaLmaV4H1jYmIy" target="_blank" class="text-blue-600 hover:underline">https://t.me/addlist/MObaLmaV4H1jYmIy</a></li>
          </ul>
        `,
        videos: []
      },
      "Telegram gruppalarda ishlash": {
        title: "Telegram gruppalarda ishlash",
        content: `
          <h2 class="text-2xl font-bold mb-4">Telegram gruppalarda qanday ishlash kerak?</h2>
          <p class="mb-4"><strong>Muhim:</strong> Siz obuna bo'lgan telegram gruppalarga faqat yuk tashlanadi menda mashina bor deb emas, ya'ni A nuqtadan B nuqtada biror bir mahsulot yoki yuk bor deb.</p>
          
          <h3 class="text-xl font-semibold mb-3 mt-6">Bu gruppalar ichida kimlar bor?</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Logistlar</li>
            <li>Dispecherlar</li>
            <li>Mashinalar bor (haydovchilar)</li>
          </ul>

          <h3 class="text-xl font-semibold mb-3 mt-6">Qanday ishlaymiz?</h3>
          <p class="mb-4">Biz shu gruppalardan yuklar gaplashib olamiz va shu gruppalardan olgan yuklarimizni shablon ko'rinishiga keltirib tarqatamiz.</p>
        `,
        videos: []
      },
      "Yuk ma'lumotlarini olish shablon": {
        title: "Yuk ma'lumotlarini olish shablon",
        content: `
          <h2 class="text-2xl font-bold mb-4">Yukni ma'lumotlarini olish uchun shablon:</h2>
          <div class="w-full max-w-6xl mx-auto mb-6">
            <div>
              <audio 
                controls 
                controlsList="nodownload"
                class="w-full"
                style="outline: none;"
              >
                <source src="/dars-3.ogg" type="audio/ogg" />
                <source src="/dars-3.ogg" type="audio/mpeg" />
                <source src="/dars-3.ogg" type="audio/wav" />
                Sizning brauzeringiz audio elementini qo'llab-quvvatlamaydi.
              </audio>
            </div>
          </div>
          <p class="mb-4">Yuk haqida ma'lumot olish uchun quyidagi ma'lumotlarni so'rash kerak:</p>
          <ol class="list-decimal list-inside mb-4 space-y-2">
            <li><strong>Qayerdan qayerga</strong> — yuklash va tushirish manzillari</li>
            <li><strong>Yukning nimaligi</strong> — yukning nomi va tavsifi</li>
            <li><strong>Yukning tonnasi (og'irligi)</strong> — yukning vazni</li>
            <li><strong>Yukning narxi</strong> — to'lov shakli (Перечисление, Наличи, Комбо)</li>
            <li><strong>Qanday mashina kerak ekanligi</strong> — Tent, REF, Paravoz, Ploshadka</li>
            <li><strong>Qachon yuklanishi</strong> — yuklash sanasi</li>
            <li><strong>Zatamojka va Rastamojka joylari</strong> — bojxona joylari</li>
            <li><strong>Hujjatlari</strong> — SMR, TIR CARNET, DAZVOL</li>
          </ol>

          <h3 class="text-xl font-semibold mb-3 mt-6">📋 To'lov shakllari:</h3>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li><strong>Перечисление</strong> — Avtomashina bank shotiga pul ko'chirib berish</li>
            <li><strong>Наличи</strong> — Pulni naxt ko'rinishda berish</li>
            <li><strong>Комбо</strong> — Pulning qanchadir qismi narx, qanchadir qismi esa bank shotiga pul ko'chirib berish (Перечисление)</li>
          </ul>
        `,
        videos: []
      },
      "Yuk shablon misoli": {
        title: "Yuk shablon misoli",
        content: `
          <h2 class="text-2xl font-bold mb-4">Yuk shablon misoli:</h2>
          <div class="bg-gray-100 p-6 rounded-lg mb-4">
            <p class="mb-2"><strong>🇷🇺 Саратов, Россия → 🇺🇿 Ташкент, Узбекистан</strong></p>
            <p class="mb-2"><strong>🚚 Тент</strong></p>
            <p class="mb-2"><strong>⚖️ Вес:</strong> 22 Т</p>
            <p class="mb-2"><strong>📦 Груз:</strong> Гранула</p>
            <p class="mb-2"><strong>🗓 Дата:</strong> Груз готов</p>
            <p class="mb-2"><strong>☎️ Телефон:</strong> 974009279</p>
          </div>

          <h3 class="text-xl font-semibold mb-3 mt-6">Yana bir misol:</h3>
          <div class="bg-gray-100 p-6 rounded-lg mb-4">
            <p class="mb-2"><strong>(🇺🇿) Ангрен - Пятигорск (🇷🇺)</strong></p>
            <p class="mb-2"><strong>Растаможка:</strong> Астрахань</p>
            <p class="mb-2"><strong>🚚 ТЕНТ 1</strong></p>
          </div>

          <h3 class="text-xl font-semibold mb-3 mt-6">Yana bir misol:</h3>
          <div class="bg-gray-100 p-6 rounded-lg mb-4">
            <p class="mb-2"><strong>📦 Товар:</strong> кафель</p>
            <p class="mb-2"><strong>⚖️ Тоннаж:</strong> 22 тонна</p>
            <p class="mb-2"><strong>💵 Оплата:</strong> 🔥</p>
            <p class="mb-2"><strong>⏰ Груз готов</strong></p>
            <p class="mb-2"><strong>☎️ 974009279</strong></p>
          </div>

          <p class="mb-4"><strong>Eslatma:</strong> Bu yozib olingan shablonga qarab yukning barcha ma'lumotlari olinadi.</p>
        `,
        videos: []
      }
    }
  },
  5: {
    day: 5,
    title: "Xarajatlari va narxlash",
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
    topics: {
      "Foydali resurslar va aloqa kanallari": {
        title: "Foydali resurslar va aloqa kanallari",
        content: `
          <h2 class="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">📱 Telegram Kanallari va Telefon Raqamlari</h2>
          <p class="text-lg mb-8 text-center text-gray-700">Logistika sohasida ishlash uchun foydali Telegram kanallari va aloqa raqamlari</p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <!-- Telegram Channel 1 -->
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.599 1.201-.984 1.23-.419.029-1.139-.211-1.599-.411-.621-.266-1.17-.411-1.893-.656-.798-.293-1.25-.456-2.016-.734-1.03-.375-1.816-.58-1.765-1.225.03-.344.45-.697 1.239-1.055 4.782-2.241 7.968-3.323 9.516-3.99 1.56-.68 3.003-.999 4.356-.999.45 0 .9.03 1.35.09l.36.03c.39.06.75.15 1.11.24.36.09.72.21 1.05.36.33.15.63.33.9.54.27.21.51.45.72.72.21.27.39.57.54.9.15.33.27.69.36 1.05.09.36.18.72.24 1.11.06.39.09.78.09 1.17 0 .39-.03.78-.09 1.17-.06.39-.15.75-.24 1.11-.09.36-.21.72-.36 1.05-.15.33-.33.63-.54.9-.21.27-.45.51-.72.72-.27.21-.57.39-.9.54-.33.15-.69.27-1.05.36-.36.09-.72.18-1.11.24-.39.06-.78.09-1.17.09-.39 0-.78-.03-1.17-.09-.39-.06-.75-.15-1.11-.24-.36-.09-.72-.21-1.05-.36-.33-.15-.63-.33-.9-.54-.27-.21-.51-.45-.72-.72-.21-.27-.39-.57-.54-.9-.15-.33-.27-.69-.36-1.05-.09-.36-.18-.72-.24-1.11-.06-.39-.09-.78-.09-1.17z"/>
                  </svg>
                </div>
                <h3 class="text-lg font-bold text-gray-800">Sarbontrak Gruz</h3>
              </div>
              <a href="https://t.me/sarbontrakgruz" target="_blank" class="block w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors duration-200">
                📲 Kanalga o'tish
              </a>
            </div>

            <!-- Telegram Channel 2 -->
            <div class="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.599 1.201-.984 1.23-.419.029-1.139-.211-1.599-.411-.621-.266-1.17-.411-1.893-.656-.798-.293-1.25-.456-2.016-.734-1.03-.375-1.816-.58-1.765-1.225.03-.344.45-.697 1.239-1.055 4.782-2.241 7.968-3.323 9.516-3.99 1.56-.68 3.003-.999 4.356-.999.45 0 .9.03 1.35.09l.36.03c.39.06.75.15 1.11.24.36.09.72.21 1.05.36.33.15.63.33.9.54.27.21.51.45.72.72.21.27.39.57.54.9.15.33.27.69.36 1.05.09.36.18.72.24 1.11.06.39.09.78.09 1.17 0 .39-.03.78-.09 1.17-.06.39-.15.75-.24 1.11-.09.36-.21.72-.36 1.05-.15.33-.33.63-.54.9-.21.27-.45.51-.72.72-.27.21-.57.39-.9.54-.33.15-.69.27-1.05.36-.36.09-.72.18-1.11.24-.39.06-.78.09-1.17.09-.39 0-.78-.03-1.17-.09-.39-.06-.75-.15-1.11-.24-.36-.09-.72-.21-1.05-.36-.33-.15-.63-.33-.9-.54-.27-.21-.51-.45-.72-.72-.21-.27-.39-.57-.54-.9-.15-.33-.27-.69-.36-1.05-.09-.36-.18-.72-.24-1.11-.06-.39-.09-.78-.09-1.17z"/>
                  </svg>
                </div>
                <h3 class="text-lg font-bold text-gray-800">Lorry Yuk Markazi</h3>
              </div>
              <a href="https://t.me/lorry_yuk_markazi" target="_blank" class="block w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors duration-200">
                📲 Kanalga o'tish
              </a>
            </div>

            <!-- Telegram Channel 3 -->
            <div class="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.599 1.201-.984 1.23-.419.029-1.139-.211-1.599-.411-.621-.266-1.17-.411-1.893-.656-.798-.293-1.25-.456-2.016-.734-1.03-.375-1.816-.58-1.765-1.225.03-.344.45-.697 1.239-1.055 4.782-2.241 7.968-3.323 9.516-3.99 1.56-.68 3.003-.999 4.356-.999.45 0 .9.03 1.35.09l.36.03c.39.06.75.15 1.11.24.36.09.72.21 1.05.36.33.15.63.33.9.54.27.21.51.45.72.72.21.27.39.57.54.9.15.33.27.69.36 1.05.09.36.18.72.24 1.11.06.39.09.78.09 1.17 0 .39-.03.78-.09 1.17-.06.39-.15.75-.24 1.11-.09.36-.21.72-.36 1.05-.15.33-.33.63-.54.9-.21.27-.45.51-.72.72-.27.21-.57.39-.9.54-.33.15-.69.27-1.05.36-.36.09-.72.18-1.11.24-.39.06-.78.09-1.17.09-.39 0-.78-.03-1.17-.09-.39-.06-.75-.15-1.11-.24-.36-.09-.72-.21-1.05-.36-.33-.15-.63-.33-.9-.54-.27-.21-.51-.45-.72-.72-.21-.27-.39-.57-.54-.9-.15-.33-.27-.69-.36-1.05-.09-.36-.18-.72-.24-1.11-.06-.39-.09-.78-.09-1.17z"/>
                  </svg>
                </div>
                <h3 class="text-lg font-bold text-gray-800">BW Trade Group</h3>
              </div>
              <a href="https://t.me/bwtradegroup" target="_blank" class="block w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors duration-200">
                📲 Kanalga o'tish
              </a>
            </div>

            <!-- Telegram Channel 4 -->
            <div class="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-300 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.599 1.201-.984 1.23-.419.029-1.139-.211-1.599-.411-.621-.266-1.17-.411-1.893-.656-.798-.293-1.25-.456-2.016-.734-1.03-.375-1.816-.58-1.765-1.225.03-.344.45-.697 1.239-1.055 4.782-2.241 7.968-3.323 9.516-3.99 1.56-.68 3.003-.999 4.356-.999.45 0 .9.03 1.35.09l.36.03c.39.06.75.15 1.11.24.36.09.72.21 1.05.36.33.15.63.33.9.54.27.21.51.45.72.72.21.27.39.57.54.9.15.33.27.69.36 1.05.09.36.18.72.24 1.11.06.39.09.78.09 1.17 0 .39-.03.78-.09 1.17-.06.39-.15.75-.24 1.11-.09.36-.21.72-.36 1.05-.15.33-.33.63-.54.9-.21.27-.45.51-.72.72-.27.21-.57.39-.9.54-.33.15-.69.27-1.05.36-.36.09-.72.18-1.11.24-.39.06-.78.09-1.17.09-.39 0-.78-.03-1.17-.09-.39-.06-.75-.15-1.11-.24-.36-.09-.72-.21-1.05-.36-.33-.15-.63-.33-.9-.54-.27-.21-.51-.45-.72-.72-.21-.27-.39-.57-.54-.9-.15-.33-.27-.69-.36-1.05-.09-.36-.18-.72-.24-1.11-.06-.39-.09-.78-.09-1.17z"/>
                  </svg>
                </div>
                <h3 class="text-lg font-bold text-gray-800">Adi Trans</h3>
              </div>
              <a href="https://t.me/adi_trans" target="_blank" class="block w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors duration-200">
                📲 Kanalga o'tish
              </a>
            </div>

            <!-- Telegram Channel 5 -->
            <div class="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mr-3">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.599 1.201-.984 1.23-.419.029-1.139-.211-1.599-.411-.621-.266-1.17-.411-1.893-.656-.798-.293-1.25-.456-2.016-.734-1.03-.375-1.816-.58-1.765-1.225.03-.344.45-.697 1.239-1.055 4.782-2.241 7.968-3.323 9.516-3.99 1.56-.68 3.003-.999 4.356-.999.45 0 .9.03 1.35.09l.36.03c.39.06.75.15 1.11.24.36.09.72.21 1.05.36.33.15.63.33.9.54.27.21.51.45.72.72.21.27.39.57.54.9.15.33.27.69.36 1.05.09.36.18.72.24 1.11.06.39.09.78.09 1.17 0 .39-.03.78-.09 1.17-.06.39-.15.75-.24 1.11-.09.36-.21.72-.36 1.05-.15.33-.33.63-.54.9-.21.27-.45.51-.72.72-.27.21-.57.39-.9.54-.33.15-.69.27-1.05.36-.36.09-.72.18-1.11.24-.39.06-.78.09-1.17.09-.39 0-.78-.03-1.17-.09-.39-.06-.75-.15-1.11-.24-.36-.09-.72-.21-1.05-.36-.33-.15-.63-.33-.9-.54-.27-.21-.51-.45-.72-.72-.21-.27-.39-.57-.54-.9-.15-.33-.27-.69-.36-1.05-.09-.36-.18-.72-.24-1.11-.06-.39-.09-.78-.09-1.17z"/>
                  </svg>
                </div>
                <h3 class="text-lg font-bold text-gray-800">Dilyautl</h3>
              </div>
              <a href="https://t.me/dilyautl" target="_blank" class="block w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors duration-200">
                📲 Kanalga o'tish
              </a>
            </div>

            <!-- Telegram Channel 6 -->
            <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 border-2 border-indigo-300 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mr-3">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.599 1.201-.984 1.23-.419.029-1.139-.211-1.599-.411-.621-.266-1.17-.411-1.893-.656-.798-.293-1.25-.456-2.016-.734-1.03-.375-1.816-.58-1.765-1.225.03-.344.45-.697 1.239-1.055 4.782-2.241 7.968-3.323 9.516-3.99 1.56-.68 3.003-.999 4.356-.999.45 0 .9.03 1.35.09l.36.03c.39.06.75.15 1.11.24.36.09.72.21 1.05.36.33.15.63.33.9.54.27.21.51.45.72.72.21.27.39.57.54.9.15.33.27.69.36 1.05.09.36.18.72.24 1.11.06.39.09.78.09 1.17 0 .39-.03.78-.09 1.17-.06.39-.15.75-.24 1.11-.09.36-.21.72-.36 1.05-.15.33-.33.63-.54.9-.21.27-.45.51-.72.72-.27.21-.57.39-.9.54-.33.15-.69.27-1.05.36-.36.09-.72.18-1.11.24-.39.06-.78.09-1.17.09-.39 0-.78-.03-1.17-.09-.39-.06-.75-.15-1.11-.24-.36-.09-.72-.21-1.05-.36-.33-.15-.63-.33-.9-.54-.27-.21-.51-.45-.72-.72-.21-.27-.39-.57-.54-.9-.15-.33-.27-.69-.36-1.05-.09-.36-.18-.72-.24-1.11-.06-.39-.09-.78-.09-1.17z"/>
                  </svg>
                </div>
                <h3 class="text-lg font-bold text-gray-800">Pepsi Logistika</h3>
              </div>
              <a href="https://t.me/pepsi_logistika" target="_blank" class="block w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors duration-200">
                📲 Kanalga o'tish
              </a>
            </div>

            <!-- Telegram Channel 7 -->
            <div class="bg-gradient-to-br from-pink-50 to-pink-100 border-2 border-pink-300 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mr-3">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.599 1.201-.984 1.23-.419.029-1.139-.211-1.599-.411-.621-.266-1.17-.411-1.893-.656-.798-.293-1.25-.456-2.016-.734-1.03-.375-1.816-.58-1.765-1.225.03-.344.45-.697 1.239-1.055 4.782-2.241 7.968-3.323 9.516-3.99 1.56-.68 3.003-.999 4.356-.999.45 0 .9.03 1.35.09l.36.03c.39.06.75.15 1.11.24.36.09.72.21 1.05.36.33.15.63.33.9.54.27.21.51.45.72.72.21.27.39.57.54.9.15.33.27.69.36 1.05.09.36.18.72.24 1.11.06.39.09.78.09 1.17 0 .39-.03.78-.09 1.17-.06.39-.15.75-.24 1.11-.09.36-.21.72-.36 1.05-.15.33-.33.63-.54.9-.21.27-.45.51-.72.72-.27.21-.57.39-.9.54-.33.15-.69.27-1.05.36-.36.09-.72.18-1.11.24-.39.06-.78.09-1.17.09-.39 0-.78-.03-1.17-.09-.39-.06-.75-.15-1.11-.24-.36-.09-.72-.21-1.05-.36-.33-.15-.63-.33-.9-.54-.27-.21-.51-.45-.72-.72-.21-.27-.39-.57-.54-.9-.15-.33-.27-.69-.36-1.05-.09-.36-.18-.72-.24-1.11-.06-.39-.09-.78-.09-1.17z"/>
                  </svg>
                </div>
                <h3 class="text-lg font-bold text-gray-800">Pepsi Co</h3>
              </div>
              <a href="https://t.me/Pepsi_cooo" target="_blank" class="block w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors duration-200">
                📲 Kanalga o'tish
              </a>
            </div>

            <!-- Telegram Channel 8 -->
            <div class="bg-gradient-to-br from-teal-50 to-teal-100 border-2 border-teal-300 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center mr-3">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.599 1.201-.984 1.23-.419.029-1.139-.211-1.599-.411-.621-.266-1.17-.411-1.893-.656-.798-.293-1.25-.456-2.016-.734-1.03-.375-1.816-.58-1.765-1.225.03-.344.45-.697 1.239-1.055 4.782-2.241 7.968-3.323 9.516-3.99 1.56-.68 3.003-.999 4.356-.999.45 0 .9.03 1.35.09l.36.03c.39.06.75.15 1.11.24.36.09.72.21 1.05.36.33.15.63.33.9.54.27.21.51.45.72.72.21.27.39.57.54.9.15.33.27.69.36 1.05.09.36.18.72.24 1.11.06.39.09.78.09 1.17 0 .39-.03.78-.09 1.17-.06.39-.15.75-.24 1.11-.09.36-.21.72-.36 1.05-.15.33-.33.63-.54.9-.21.27-.45.51-.72.72-.27.21-.57.39-.9.54-.33.15-.69.27-1.05.36-.36.09-.72.18-1.11.24-.39.06-.78.09-1.17.09-.39 0-.78-.03-1.17-.09-.39-.06-.75-.15-1.11-.24-.36-.09-.72-.21-1.05-.36-.33-.15-.63-.33-.9-.54-.27-.21-.51-.45-.72-.72-.21-.27-.39-.57-.54-.9-.15-.33-.27-.69-.36-1.05-.09-.36-.18-.72-.24-1.11-.06-.39-.09-.78-.09-1.17z"/>
                  </svg>
                </div>
                <h3 class="text-lg font-bold text-gray-800">Loyal Freight</h3>
              </div>
              <a href="https://t.me/loyalfreight" target="_blank" class="block w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors duration-200">
                📲 Kanalga o'tish
              </a>
            </div>

            <!-- Telegram Channel 9 -->
            <div class="bg-gradient-to-br from-cyan-50 to-cyan-100 border-2 border-cyan-300 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center mr-3">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.599 1.201-.984 1.23-.419.029-1.139-.211-1.599-.411-.621-.266-1.17-.411-1.893-.656-.798-.293-1.25-.456-2.016-.734-1.03-.375-1.816-.58-1.765-1.225.03-.344.45-.697 1.239-1.055 4.782-2.241 7.968-3.323 9.516-3.99 1.56-.68 3.003-.999 4.356-.999.45 0 .9.03 1.35.09l.36.03c.39.06.75.15 1.11.24.36.09.72.21 1.05.36.33.15.63.33.9.54.27.21.51.45.72.72.21.27.39.57.54.9.15.33.27.69.36 1.05.09.36.18.72.24 1.11.06.39.09.78.09 1.17 0 .39-.03.78-.09 1.17-.06.39-.15.75-.24 1.11-.09.36-.21.72-.36 1.05-.15.33-.33.63-.54.9-.21.27-.45.51-.72.72-.27.21-.57.39-.9.54-.33.15-.69.27-1.05.36-.36.09-.72.18-1.11.24-.39.06-.78.09-1.17.09-.39 0-.78-.03-1.17-.09-.39-.06-.75-.15-1.11-.24-.36-.09-.72-.21-1.05-.36-.33-.15-.63-.33-.9-.54-.27-.21-.51-.45-.72-.72-.21-.27-.39-.57-.54-.9-.15-.33-.27-.69-.36-1.05-.09-.36-.18-.72-.24-1.11-.06-.39-.09-.78-.09-1.17z"/>
                  </svg>
                </div>
                <h3 class="text-lg font-bold text-gray-800">Telegram Guruh</h3>
              </div>
              <a href="https://t.me/+U9Myk-mKr3ZmZGQy" target="_blank" class="block w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors duration-200">
                📲 Guruhga o'tish
              </a>
            </div>
          </div>

          <!-- O'qituvchi va O'quvchilar Chat Guruhi -->
          <div class="mt-8 mb-8">
            <h3 class="text-2xl font-bold mb-6 text-center text-gray-800 flex items-center justify-center">
              <span class="mr-3">💬</span>
              O'qituvchi va O'quvchilar Chat Guruhi
            </h3>
            <div class="max-w-2xl mx-auto">
              <div class="bg-gradient-to-br from-violet-50 to-violet-100 border-2 border-violet-300 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div class="flex items-center mb-4">
                  <div class="w-16 h-16 bg-violet-500 rounded-full flex items-center justify-center mr-4">
                    <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.599 1.201-.984 1.23-.419.029-1.139-.211-1.599-.411-.621-.266-1.17-.411-1.893-.656-.798-.293-1.25-.456-2.016-.734-1.03-.375-1.816-.58-1.765-1.225.03-.344.45-.697 1.239-1.055 4.782-2.241 7.968-3.323 9.516-3.99 1.56-.68 3.003-.999 4.356-.999.45 0 .9.03 1.35.09l.36.03c.39.06.75.15 1.11.24.36.09.72.21 1.05.36.33.15.63.33.9.54.27.21.51.45.72.72.21.27.39.57.54.9.15.33.27.69.36 1.05.09.36.18.72.24 1.11.06.39.09.78.09 1.17 0 .39-.03.78-.09 1.17-.06.39-.15.75-.24 1.11-.09.36-.21.72-.36 1.05-.15.33-.33.63-.54.9-.21.27-.45.51-.72.72-.27.21-.57.39-.9.54-.33.15-.69.27-1.05.36-.36.09-.72.18-1.11.24-.39.06-.78.09-1.17.09-.39 0-.78-.03-1.17-.09-.39-.06-.75-.15-1.11-.24-.36-.09-.72-.21-1.05-.36-.33-.15-.63-.33-.9-.54-.27-.21-.51-.45-.72-.72-.21-.27-.39-.57-.54-.9-.15-.33-.27-.69-.36-1.05-.09-.36-.18-.72-.24-1.11-.06-.39-.09-.78-.09-1.17z"/>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <h3 class="text-xl font-bold text-gray-800 mb-2">Logistica yuk jamoa</h3>
                    <p class="text-sm text-gray-600 mb-3">O'qituvchi va o'quvchilar o'rtasida dars o'tkazish, savol-javob qilish va muloqot qilish uchun maxsus guruh</p>
                  </div>
                </div>
                <a href="https://t.me/+yD8u10aLol43ODcy" target="_blank" class="block w-full bg-violet-500 hover:bg-violet-600 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors duration-200 text-lg">
                  💬 Guruhga qo'shilish
                </a>
              </div>
            </div>
          </div>

          <!-- Telefon Raqamlari -->
          <div class="mt-12 mb-8">
            <h3 class="text-2xl font-bold mb-6 text-center text-gray-800 flex items-center justify-center">
              <span class="mr-3">📞</span>
              Telefon Raqamlari
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div class="bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-300 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center mr-4">
                      <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm text-gray-600 mb-1">Telefon</p>
                      <a href="tel:+998331422221" class="text-xl font-bold text-gray-800 hover:text-emerald-600 transition-colors">
                        +998 33 142 22 21
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-300 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center mr-4">
                      <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm text-gray-600 mb-1">Telefon</p>
                      <a href="tel:+998881474100" class="text-xl font-bold text-gray-800 hover:text-amber-600 transition-colors">
                        +998 88 147 41 00
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mt-8">
            <p class="text-gray-700 leading-relaxed">
              <strong class="text-blue-700">💡 Eslatma:</strong> Yuqoridagi barcha kanallar va telefon raqamlari logistika sohasida ishlash uchun foydali resurslar hisoblanadi. 
              Ular orqali yuklar, transportlar va boshqa muhim ma'lumotlar bilan tanishishingiz mumkin.
            </p>
          </div>
        `,
        videos: []
      }
    }
  }
};
