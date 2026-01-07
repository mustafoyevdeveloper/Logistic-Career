import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { apiService } from '@/services/api';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

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

export default function LessonsPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLessonClick = (day: number) => {
    navigate(`/student/lessons/${day}`);
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
          {weekLessons.map((lesson) => (
            <div
              key={lesson.day}
              className="bg-card rounded-xl border border-border shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Day Section */}
                <div className="bg-primary/10 px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-center sm:justify-start min-w-[120px] sm:min-w-[140px]">
                  <h2 className="text-xl sm:text-2xl font-bold text-primary">
                    {lesson.day}-Kun
                  </h2>
                </div>

                {/* Lesson Info */}
                <div className="flex-1 px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base text-muted-foreground line-clamp-2 sm:line-clamp-3">
                      {lesson.description}
                    </p>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => handleLessonClick(lesson.day)}
                    variant="gradient"
                    size="sm"
                    className="shrink-0 w-full sm:w-auto"
                  >
                    Darsni boshlash
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
