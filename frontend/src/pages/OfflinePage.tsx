import { WifiOff, RefreshCw, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
  const handleRetry = () => window.location.reload();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <div className="text-center max-w-md w-full">
        {/* Logo / brend */}
        <div className="flex justify-center mb-2">
          <img
            src="/favicon.jpg"
            alt="Asliddin Logistic"
            className="h-10 w-10 rounded-full object-cover"
          />
          <span className="ml-2 text-lg font-semibold text-foreground self-center">
            Asliddin Logistic
          </span>
        </div>

        {/* Asosiy blok — NotFound sahifasi uslubida */}
        <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 shadow-glow">
          <WifiOff className="w-10 h-10 text-primary-foreground" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Internet ulanmagan
        </h1>
        <p className="text-muted-foreground mb-8">
          Tarmoq bilan aloqa yo'q. Quyidagilarni tekshiring yoki keyinroq qayta urinib ko'ring.
        </p>

        {/* Urinib ko'ring — Chrome offline sahifasidagi "Try:" ga mos */}
        <div className="bg-card border border-border rounded-xl p-5 text-left shadow-card mb-8">
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-primary" />
            Urinib ko'ring:
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              Wi-Fi yoki mobil internetni qayta ulang
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              Router va modem simlari to'g'ri ulanganini tekshiring
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              Boshqa qurilmada internet bor-yo'qligini tekshiring
            </li>
          </ul>
        </div>

        <Button variant="gradient" size="lg" onClick={handleRetry}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Qayta urinish
        </Button>
      </div>
    </div>
  );
}
