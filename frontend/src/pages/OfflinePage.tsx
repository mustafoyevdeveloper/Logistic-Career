import { WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
  const handleRetry = () => window.location.reload();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="gradient-hero relative overflow-hidden rounded-2xl max-w-md w-full shadow-xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative z-10 p-8 sm:p-10 text-center">
          <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6">
            <WifiOff className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-2">
            Internet ulanmagan
          </h1>
          <p className="text-primary-foreground/80 mb-8">
            Tarmoq bilan aloqa yo'q. Iltimos, internetingizni tekshiring yoki keyinroq qayta urinib ko'ring.
          </p>
          <Button
            variant="secondary"
            size="lg"
            onClick={handleRetry}
            className="bg-white/20 hover:bg-white/30 text-primary-foreground border-0"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Qayta urinish
          </Button>
        </div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-0 left-0 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
      </div>
    </div>
  );
}
