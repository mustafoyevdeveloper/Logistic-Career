import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { 
  BookOpen, 
  Target, 
  Users, 
  CheckCircle2,
  ArrowRight,
  Clock,
  GraduationCap,
  Award,
  Zap,
  Download
} from 'lucide-react';

const APK_URL = '/AsligginLogistic.apk';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Logo variant="icon" size="md" />
              <span className="text-xl font-bold text-foreground">Asliddin Logistic</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link to="/login?role=student">
                <Button variant="gradient" size="sm">
                  Kirish
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="gradient-hero relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
              Xalqaro logistikani<br />
              <span className="text-accent">professional</span> darajada<br />
              o'rganing
            </h1>
            <p className="text-lg sm:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              0 darajadan dispetcherlik darajasigacha AI yordamida bosqichma-bosqich o'qing
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href={APK_URL} download="AsligginLogistic.apk">
                <Button variant="outline" size="lg" className="border-primary-foreground/40 text-black hover:bg-white/80 hover:text-black hover:border-primary-foreground/60">
                  <Download className="w-5 h-5 mr-2" />
                  Ilovani yuklab oling
                </Button>
              </a>
              <Link to="/login?role=student">
                <Button variant="hero" size="lg" className="bg-accent hover:bg-accent/90 text-white">
                  Darslarni boshlash
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-12">
              Kurs haqida
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              <div className="bg-card rounded-xl p-6 border border-border shadow-card hover:shadow-card-hover transition-shadow">
                <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Bosqichma-bosqich darsliklar</h3>
                <p className="text-muted-foreground">
                  Har bir mavzu batafsil va tushunarli tarzda tushuntiriladi
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border shadow-card hover:shadow-card-hover transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">AI yordamida o'qitish</h3>
                <p className="text-muted-foreground">
                  Sun'iy intellekt yordamida shaxsiy yondashuv va yordam
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border shadow-card hover:shadow-card-hover transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-success" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Professional dispetcherlik</h3>
                <p className="text-muted-foreground">
                  Haqiqiy loyihalar va amaliy vazifalar bilan o'rganing
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border shadow-card hover:shadow-card-hover transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-6 h-6 text-warning" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Sertifikat olish imkoniyati</h3>
                <p className="text-muted-foreground">
                  Kursni muvaffaqiyatli yakunlaganingizdan keyin sertifikat oling
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border shadow-card hover:shadow-card-hover transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-info/10 flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-info" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Qulay vaqt</h3>
                <p className="text-muted-foreground">
                  O'zingizga qulay vaqtda o'rganing, istalgan joydan kirish
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border shadow-card hover:shadow-card-hover transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Tezkor natija</h3>
                <p className="text-muted-foreground">
                  Qisqa vaqtda logistika sohasida professional bo'ling
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Info Section */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl p-8 sm:p-12 border border-border shadow-card">
              <div className="text-center mb-8">
                <GraduationCap className="w-16 h-16 text-primary mx-auto mb-4" />
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  Kurs haqida batafsil
                </h2>
              </div>

              <div className="space-y-6 text-foreground">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shrink-0">
                    <span className="text-primary-foreground font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Kurs kim tomonidan o'rgatiladi?</h3>
                    <p className="text-muted-foreground">
                      Kurs professional o'qituvchilar tomonidan tayyorlangan va boshqariladi. 
                      Har bir dars sizga logistika sohasida chuqur bilim berish uchun maxsus tayyorlangan.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shrink-0">
                    <span className="text-primary-foreground font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Qancha vaqtda xullas qilish mumkin?</h3>
                    <p className="text-muted-foreground">
                      Kurs o'z tezligingizda o'rganish imkoniyatini beradi. O'rtacha 2-3 oy ichida 
                      barcha materiallarni o'zlashtirib, logistika sohasida professional darajaga erishishingiz mumkin.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shrink-0">
                    <span className="text-primary-foreground font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Logistikaga chuqur olib kiradimi?</h3>
                    <p className="text-muted-foreground">
                      Albatta! Kurs 0 darajadan boshlab, sizni xalqaro logistika va dispetcherlik 
                      sohasida professional darajaga olib chiqadi. Har bir mavzu batafsil va amaliy 
                      misollar bilan tushuntiriladi.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-border">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <a href={APK_URL} download="AsligginLogistic.apk">
                <Button variant="outline" size="lg" className=" text-white hover:text-white bg-gradient-to-r from-[#0849B0] to-[#0B61EC]">
                  <Download className="w-5 h-5 mr-2 text-white" />
                  Ilovani yuklab oling
                </Button>
              </a>
                  <Link to="/login?role=student">
                    <Button variant="gradient" size="lg">
                      Kirish
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Logo variant="icon" size="sm" />
              <span className="text-lg font-bold text-foreground">Asliddin Logistics</span>
            </div>
            <p className="text-sm text-muted-foreground text-center sm:text-right">
              © 2025 Asliddin Logistic. Barcha huquqlar himoyalangan.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

