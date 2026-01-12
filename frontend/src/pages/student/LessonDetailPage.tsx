import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiService } from '@/services/api';
import { toast } from 'sonner';

// Player.js type declaration
declare global {
  interface Window {
    PlayerJS?: new (options: {
      id: string;
      file: string;
      width?: string;
      height?: string;
    }) => {
      api: (method: string) => void;
    };
    Playerjs?: new (options: {
      id: string;
      file: string;
      width?: string;
      height?: string;
    }) => {
      api: (method: string) => void;
    };
  }
}

// Mavzu ma'lumotlari interfeysi
interface TopicContent {
  title: string;
  content: string;
  videos: string[]; // Video URL'lar ro'yxati
}

// Player.js instance type
interface PlayerInstance {
  api: (method: string) => void;
}

// 7 kunlik darslar ma'lumotlari
const weekLessons: Record<number, {
  day: number;
  title: string;
  description: string;
  duration: string;
  topics: Record<string, TopicContent>;
}> = {
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
          "https://pub-e29856519e414c75bfcf296d0dc7f3ad.r2.dev/Kino/1762382269471-Interstellar.mp4", // Misol video URL
          "https://pub-e29856519e414c75bfcf296d0dc7f3ad.r2.dev/Kino/1764166949478-tor-4-1080p-ozbek-tilida-asilmedia.net.mp4" // Ikkinchi video
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
          "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        ]
      }
    }
  },
  // Boshqa kunlar uchun ham shunga o'xshash struktura...
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

// Video player komponenti (player.js bilan)
const VideoPlayer = ({ videoUrl, index }: { videoUrl: string; index: number }) => {
  const playerRef = useRef<HTMLDivElement>(null);
  const playerInstanceRef = useRef<PlayerInstance | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!playerRef.current || !videoUrl) return;

    setIsLoading(true);

    // player.js script'ni yuklash
    const loadPlayerJS = () => {
      // Agar PlayerJS yoki Playerjs allaqachon yuklangan bo'lsa
      if (window.PlayerJS || window.Playerjs) {
        initializePlayer();
        return;
      }

      // Script allaqachon yuklanmoqda bo'lsa, kutish
      const existingScript = document.querySelector('script[src="/player/playerjs.js"]');
      if (existingScript) {
        existingScript.addEventListener('load', initializePlayer);
        return;
      }

      // Yangi script yaratish va yuklash
      const script = document.createElement('script');
      script.src = '/player/playerjs.js';
      script.async = true;
      script.onload = () => {
        // player.js yuklangandan keyin bir oz kutish
        setTimeout(() => {
          initializePlayer();
        }, 100);
      };
      script.onerror = () => {
        console.error('player.js yuklanmadi');
        setIsLoading(false);
        // player.js yuklanmasa, oddiy HTML5 video player ko'rsatish
        if (playerRef.current) {
          playerRef.current.innerHTML = `
            <video controls class="w-full h-full" style="border-radius: 2px">
              <source src="${videoUrl}" type="video/mp4">
              Sizning brauzeringiz video elementini qo'llab-quvvatlamaydi.
            </video>
          `;
        }
      };
      document.body.appendChild(script);
    };

    const initializePlayer = () => {
      if (!playerRef.current) return;

      // PlayerJS yoki Playerjs yuklanganligini tekshirish
      const PlayerConstructor = window.PlayerJS || window.Playerjs;
      if (!PlayerConstructor) {
        console.error('player.js yuklanmagan');
        setIsLoading(false);
        // Fallback: oddiy HTML5 video player
        if (playerRef.current) {
          playerRef.current.innerHTML = `
            <video controls class="w-full h-full" style="border-radius: 2px;">
              <source src="${videoUrl}" type="video/mp4">
              Sizning brauzeringiz video elementini qo'llab-quvvatlamaydi.
            </video>
          `;
        }
        return;
      }

      // Eski player'ni tozalash
      if (playerInstanceRef.current) {
        try {
          if (typeof playerInstanceRef.current.api === 'function') {
            playerInstanceRef.current.api('destroy');
          }
        } catch (e) {
          // Xatolikni e'tiborsiz qoldirish
        }
        playerInstanceRef.current = null;
      }

      // Yangi player yaratish
      try {
        const playerId = `player-${Date.now()}-${index}`;
        
        // Container'ni tozalash
        if (playerRef.current) {
          playerRef.current.innerHTML = `<div id="${playerId}"></div>`;
          
          // DOM yangilanishini kutish
          setTimeout(() => {
            if (!playerRef.current) return;

            try {
              // player.js'ni ishga tushirish
              const PlayerConstructor = window.PlayerJS || window.Playerjs;
              if (PlayerConstructor) {
                playerInstanceRef.current = new PlayerConstructor({
                  id: playerId,
                  file: videoUrl,
                  width: '100%',
                  height: '100%'
                });
              }

              setIsLoading(false);
            } catch (error) {
              console.error('player.js yaratishda xatolik:', error);
              setIsLoading(false);
              // Fallback: oddiy HTML5 video player
              if (playerRef.current) {
                playerRef.current.innerHTML = `
                  <video controls class="w-full h-full" style="border-radius: 8px;">
                    <source src="${videoUrl}" type="video/mp4">
                    Sizning brauzeringiz video elementini qo'llab-quvvatlamaydi.
                  </video>
                `;
              }
            }
          }, 150);
        }
      } catch (error) {
        console.error('player.js xatosi:', error);
        setIsLoading(false);
        // Fallback: oddiy HTML5 video player
        if (playerRef.current) {
          playerRef.current.innerHTML = `
            <video controls class="w-full h-full" style="border-radius: 8px;">
              <source src="${videoUrl}" type="video/mp4">
              Sizning brauzeringiz video elementini qo'llab-quvvatlamaydi.
            </video>
          `;
        }
      }
    };

    loadPlayerJS();

    // Cleanup
    return () => {
      if (playerInstanceRef.current) {
        try {
          if (typeof playerInstanceRef.current.api === 'function') {
            playerInstanceRef.current.api('destroy');
          }
        } catch (e) {
          // Xatolikni e'tiborsiz qoldirish
        }
        playerInstanceRef.current = null;
      }
    };
  }, [videoUrl, index]);

  return (
    <div className="w-full aspect-video bg-black overflow-hidden mb-4 relative" style={{ borderRadius: 0 }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <div ref={playerRef} className="w-full h-full" />
    </div>
  );
};

export default function LessonDetailPage() {
  const { day } = useParams<{ day: string }>();
  const navigate = useNavigate();
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  
  const dayNumber = day ? parseInt(day, 10) : null;
  const lesson = dayNumber && weekLessons[dayNumber];

  // Dars holatini tekshirish
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
        // Birinchi mavzuni tanlash
        if (lesson && Object.keys(lesson.topics).length > 0) {
          setSelectedTopic(Object.keys(lesson.topics)[0]);
        }
        return;
      }

      try {
        const response = await apiService.getStudentLessons();
        if (response.success && response.data) {
          interface LessonStatus {
            day: number;
            isUnlocked: boolean;
          }
          const lessonStatus = (response.data.lessons as LessonStatus[]).find((l) => l.day === dayNumber);
          if (lessonStatus && lessonStatus.isUnlocked) {
            setHasAccess(true);
            // Birinchi mavzuni tanlash
            if (lesson && Object.keys(lesson.topics).length > 0) {
              setSelectedTopic(Object.keys(lesson.topics)[0]);
            }
          } else {
            toast.error('Bu dars hali ochilmagan');
            navigate('/student/lessons');
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Dars holatini tekshirishda xatolik';
        toast.error(errorMessage);
        navigate('/student/lessons');
      } finally {
        setIsCheckingAccess(false);
      }
    };

    checkLessonAccess();
  }, [dayNumber, navigate, lesson]);

  // Darsga kirilganda progress yangilash
  useEffect(() => {
    if (dayNumber && hasAccess) {
      apiService.request(`/lessons/day/${dayNumber}/progress`, {
        method: 'PUT',
        body: JSON.stringify({ timeSpent: 0 }),
      }).catch(() => {
        // Xatolikni e'tiborsiz qoldirish
      });
    }
  }, [dayNumber, hasAccess]);

  // Birinchi mavzuni avtomatik tanlash
  useEffect(() => {
    if (lesson && Object.keys(lesson.topics).length > 0 && !selectedTopic) {
      setSelectedTopic(Object.keys(lesson.topics)[0]);
    }
  }, [lesson, selectedTopic]);

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

  const topicKeys = Object.keys(lesson.topics);
  const currentTopic = selectedTopic && lesson.topics[selectedTopic] 
    ? lesson.topics[selectedTopic] 
    : null;

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
        </div>
      </div>

      {/* Topics */}
      {topicKeys.length > 0 && (
        <div className="bg-card rounded-xl p-4 sm:p-6 border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-3">Dars mavzulari:</h2>
          <div className="flex flex-wrap gap-2">
            {topicKeys.map((topicKey) => (
              <button
                key={topicKey}
                onClick={() => setSelectedTopic(topicKey)}
                className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium transition-all",
                  selectedTopic === topicKey
                    ? "bg-primary text-primary-foreground"
                    : "bg-primary/10 text-primary hover:bg-primary/20"
                )}
              >
                {topicKey}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content - Ikki ustunli layout */}
      {currentTopic && (
        <>
          <style>{`
            .custom-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: rgba(148, 163, 184, 0.5) transparent;
            }
            .custom-scrollbar::-webkit-scrollbar {
              width: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
              border-radius: 5px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(148, 163, 184, 0.5);
              border-radius: 5px;
              border: 2px solid transparent;
              background-clip: padding-box;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(148, 163, 184, 0.7);
              background-clip: padding-box;
            }
          `}</style>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chap ustun - Matn (scroll qilinadigan) */}
            <div className="bg-card rounded-xl p-4 sm:p-6 border border-border flex flex-col h-100vh">
              <div 
                className="flex-1 overflow-y-auto pr-2 custom-scrollbar"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(148, 163, 184, 0.5) transparent',
                  minHeight: 0
                }}
              >
                <div
                  className="prose prose-sm sm:prose-base max-w-none text-foreground"
                  dangerouslySetInnerHTML={{ __html: currentTopic.content }}
                />
              </div>
            </div>

            {/* O'ng ustun - Videolar (scroll qilinadigan) */}
            <div className="bg-card rounded-xl p-2 sm:p-2 border border-border flex flex-col h-100vh">
              <h3 className="text-lg font-semibold text-foreground pl-2 pt-2 mb-4">Video darsliklar</h3>
              <div 
                className="flex-1 overflow-y-auto custom-scrollbar"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(148, 163, 184, 0.5) transparent',
                  minHeight: 0
                }}
              >
                {currentTopic.videos && currentTopic.videos.length > 0 ? (
                  currentTopic.videos.map((videoUrl, index) => (
                    <VideoPlayer key={index} videoUrl={videoUrl} index={index} />
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground min-h-[200px]">
                    <p>Bu mavzu uchun video mavjud emas</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Agar mavzular bo'sh bo'lsa */}
      {topicKeys.length === 0 && (
        <div className="bg-card rounded-xl p-4 sm:p-6 border border-border text-center py-12">
          <p className="text-muted-foreground">Bu dars uchun mavzular hali qo'shilmagan</p>
        </div>
      )}
    </div>
  );
}
