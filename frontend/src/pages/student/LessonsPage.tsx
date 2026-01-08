import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { apiService } from '@/services/api';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Lock, Clock } from 'lucide-react';

// 7 kunlik darslar ma'lumotlari
const weekLessons = [
  {
    day: 1,
    title: "Logistika asoslari, tushunchalar va hujjatlar bilan tanishish",
    description: "Logistika nima, dispatcher nima, logistika turlari, asosiy hujjatlar va ularning maqsadlari, transport turlari va ularning xususiyatlari."
  },
  {
    day: 2,
    title: "Xalqaro logistika va transport turlari",
    description: "Xalqaro logistika asoslari, transport turlari (avtomobil, temir yo'l, havo, dengiz), ularning afzalliklari va kamchiliklari."
  },
  {
    day: 3,
    title: "Yuk tashish hujjatlari va shartnomalar",
    description: "CMR, AWB, Bill of Lading kabi asosiy hujjatlar, shartnoma tuzish, yuk tashish shartlari va javobgarlik masalalari."
  },
  {
    day: 4,
    title: "Bo'jxona va rasmiylashtirish",
    description: "Bo'jxona rasmiylashtirish jarayoni, zarur hujjatlar, bojxona to'lovlari va qoidalari, import-export operatsiyalari."
  },
  {
    day: 5,
    title: "Logistika xarajatlari va narxlash",
    description: "Logistika xarajatlari turlari, narxlash usullari, xarajatlarni hisoblash, rentabellik va foyda koeffitsiyentlari."
  },
  {
    day: 6,
    title: "Mijozlar bilan ishlash va muloqot",
    description: "Mijozlar bilan muloqot qilish, shikoyatlar bilan ishlash, xizmat ko'rsatish standartlari, mijozlar bilan munosabatlar."
  },
  {
    day: 7,
    title: "Logistika tizimlari va texnologiyalar",
    description: "Zamonaviy logistika tizimlari, TMS (Transport Management System), GPS kuzatuv, raqamli logistika va avtomatlashtirish."
  }
];

interface LessonStatus {
  day: number;
  isUnlocked: boolean;
  unlockTime: string | null;
  timeRemaining: number | null;
}

export default function LessonsPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [lessonsStatus, setLessonsStatus] = useState<LessonStatus[]>([]);
  const [longPressTimers, setLongPressTimers] = useState<Record<number, NodeJS.Timeout | null>>({});
  const longPressStartTime = useRef<Record<number, number>>({});

  // Darslar holatini yuklash
  useEffect(() => {
    loadLessonsStatus();
    
    // Har sekundda countdown yangilash
    const interval = setInterval(() => {
      setLessonsStatus(prev => prev.map(lesson => {
        if (lesson.timeRemaining && lesson.timeRemaining > 0) {
          const newTimeRemaining = lesson.timeRemaining - 1000;
          if (newTimeRemaining <= 0) {
            // Vaqt tugadi, dars ochildi
            return {
              ...lesson,
              isUnlocked: true,
              timeRemaining: null,
            };
          }
          return {
            ...lesson,
            timeRemaining: newTimeRemaining,
          };
        }
        return lesson;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const loadLessonsStatus = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getStudentLessons();
      if (response.success && response.data) {
        setLessonsStatus(response.data.lessons);
      }
    } catch (error: any) {
      toast.error(error.message || 'Darslar holatini yuklashda xatolik');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLessonClick = (day: number) => {
    // 1-dars har doim ochiq
    if (day === 1) {
      navigate(`/student/lessons/${day}`);
      return;
    }
    
    const lesson = lessonsStatus.find(l => l.day === day);
    if (lesson && lesson.isUnlocked) {
      navigate(`/student/lessons/${day}`);
    }
  };

  // Countdown formatlash (soat:daqiqa formatida, masalan "8:24, 8:23...")
  const formatTimeRemaining = (ms: number | null): string => {
    if (!ms || ms <= 0) return '';
    
    const totalMinutes = Math.floor(ms / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  // Long press boshlash (2-10 sekund)
  const handleLongPressStart = (day: number) => {
    const lesson = lessonsStatus.find(l => l.day === day);
    if (!lesson || lesson.isUnlocked) return; // Faqat yopiq darslar uchun

    longPressStartTime.current[day] = Date.now();
    
    // 2 sekunddan keyin tekshirish
    const timer = setTimeout(async () => {
      const pressDuration = Date.now() - longPressStartTime.current[day];
      // 2-10 sekund orasida bo'lsa, darsni ochish
      if (pressDuration >= 2000 && pressDuration <= 10000) {
        try {
          await apiService.unlockLessonSecret(day);
          toast.success(`${day}-dars muvaffaqiyatli ochildi!`);
          loadLessonsStatus(); // Holatni yangilash
        } catch (error: any) {
          toast.error(error.message || 'Darsni ochishda xatolik');
        }
      }
    }, 2000);

    setLongPressTimers(prev => ({ ...prev, [day]: timer }));
  };

  // Long press tugatish
  const handleLongPressEnd = (day: number) => {
    if (longPressTimers[day]) {
      clearTimeout(longPressTimers[day]);
      setLongPressTimers(prev => ({ ...prev, [day]: null }));
    }
    delete longPressStartTime.current[day];
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Darsliklar</h1>
        <p className="text-muted-foreground">
          Xalqaro logistikani bosqichma-bosqich o'rganing
        </p>
      </div>

      {/* Lessons List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Yuklanmoqda...</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {weekLessons.map((lesson) => {
            const status = lessonsStatus.find(s => s.day === lesson.day);
            // 1-dars har doim ochiq bo'lishi kerak
            const isUnlocked = lesson.day === 1 ? true : (status?.isUnlocked ?? false);
            const timeRemaining = status?.timeRemaining ?? null;

            return (
              <div
                key={lesson.day}
                className={cn(
                  "bg-card rounded-xl border shadow-card transition-all duration-200 overflow-hidden",
                  isUnlocked 
                    ? "border-border hover:shadow-card-hover" 
                    : "border-border/50 opacity-75"
                )}
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Day Section */}
                  <div className={cn(
                    "px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-center sm:justify-start min-w-[120px] sm:min-w-[140px]",
                    isUnlocked ? "bg-primary/10" : "bg-muted/50"
                  )}>
                    <div className="flex items-center gap-2">
                      {!isUnlocked && <Lock className="w-5 h-5 text-muted-foreground" />}
                      <h2 className={cn(
                        "text-xl sm:text-2xl font-bold",
                        isUnlocked ? "text-primary" : "text-muted-foreground"
                      )}>
                        {lesson.day}-Kun
                      </h2>
                    </div>
                  </div>

                  {/* Lesson Info */}
                  <div className="flex-1 px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm sm:text-base text-muted-foreground line-clamp-2 sm:line-clamp-3">
                        {lesson.description}
                      </p>
                      {!isUnlocked && timeRemaining && (
                        <div className="flex items-center gap-2 mt-2 text-sm text-warning font-medium">
                          <Clock className="w-4 h-4" />
                          <span>{formatTimeRemaining(timeRemaining)} soat qoldi</span>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={() => handleLessonClick(lesson.day)}
                      onMouseDown={() => handleLongPressStart(lesson.day)}
                      onMouseUp={() => handleLongPressEnd(lesson.day)}
                      onMouseLeave={() => handleLongPressEnd(lesson.day)}
                      onTouchStart={() => handleLongPressStart(lesson.day)}
                      onTouchEnd={() => handleLongPressEnd(lesson.day)}
                      variant={isUnlocked ? "gradient" : "outline"}
                      size="sm"
                      disabled={!isUnlocked}
                      className="shrink-0 w-full sm:w-auto"
                    >
                      {isUnlocked ? "Darsni boshlash" : "Yopiq"}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
