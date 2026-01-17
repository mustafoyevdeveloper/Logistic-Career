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
    topics: {}
  },
  2: {
    day: 2,
    title: "Transport turlari va bizning logistika transport turlari",
    description: "Logistikadagi transport turlari, xalqaro logistikada qanday transport turlari bilan ishlanadi va ularning vazifalari. Tent fura, REF fura, Paravoz, Ploshadka.",
    duration: "",
    topics: {}
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
