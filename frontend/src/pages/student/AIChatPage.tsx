import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles,
  Lightbulb,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { ChatMessage } from '@/types';
import { cn } from '@/lib/utils';

const suggestedQuestions = [
  { icon: Lightbulb, text: "Logistika nima va qanday ishlaydi?" },
  { icon: HelpCircle, text: "Freight broker va carrier farqi nima?" },
  { icon: BookOpen, text: "Load board qanday ishlaydi?" },
];

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'assistant',
    content: `Assalomu alaykum! Men sizning AI o'quv yordamchingizman. 🚛

Sizga xalqaro logistika, dispetcherlik va transport sohasida yordam berishga tayyorman.

**Quyidagi savollarga javob bera olaman:**
- Logistika asoslari va tushunchalari
- Broker, shipper, carrier vazifalari
- Load board bilan ishlash
- Rate confirmation tuzish
- Amaliy vaziyatlar va senariylar

Savolingiz bo'lsa, bemalol yozing!`,
    timestamp: new Date(),
  },
];

export default function AIChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponses: Record<string, string> = {
        'logistika': `**Logistika** — bu tovarlarni A nuqtadan B nuqtaga optimal yo'l bilan yetkazib berish jarayonidir.

**Asosiy tushunchalar:**
1. **Supply Chain** — ta'minot zanjiri
2. **Freight** — yuk
3. **Carrier** — yuk tashuvchi
4. **Shipper** — yuk jo'natuvchi
5. **Consignee** — yuk qabul qiluvchi

Xalqaro logistikada asosan 4 ta transport turi ishlatiladi:
- 🚛 **Avtomobil transporti (Trucking)**
- 🚂 **Temir yo'l (Rail)**
- 🚢 **Dengiz transporti (Ocean)**
- ✈️ **Havo transporti (Air)**

Batafsil ma'lumot olmoqchimisiz?`,
        'broker': `**Freight Broker** va **Carrier** farqlari:

**Freight Broker:**
- Yuk jo'natuvchi va tashuvchi o'rtasida vositachi
- O'z transportiga ega emas
- Foyda — broker komissiyasi (margin)
- Yuklarni topib, carrierlarga beradi

**Carrier:**
- Haqiqiy transport egasi
- Yuklarni bevosita tashiydi
- MC va DOT raqamlariga ega
- Insurance va authority kerak

**Misol:**
Shipper → Broker → Carrier → Consignee

Brokerlik ishini qiziqtirmoqdami?`,
        'load': `**Load Board** — bu yuklarni topish va joylashtirish uchun online platforma.

**Eng mashhur load boardlar:**
1. **DAT** — eng katta va ishonchli
2. **Truckstop** — raqobatchi
3. **123Loadboard** — arzon variant
4. **Amazon Relay** — Amazon yuklari

**Load board orqali:**
- Yuklar ro'yxatini ko'rish
- Rate (narx) ko'rish
- Carrier topish
- Yuk joylashtirish

**Maslahat:** Yangi boshlovchilar uchun DAT Power yoki Truckstop Pro tavsiya qilinadi.

Qaysi load board haqida ko'proq bilmoqchisiz?`,
      };

      let response = `Yaxshi savol! Bu haqida batafsil tushuntiraman...

Sizning savolingiz logistika sohasining muhim qismini o'z ichiga oladi. 

**Qo'shimcha savollar bo'lsa, bemalol yozing!**

💡 **Maslahat:** Amaliy mashqlar uchun "Topshiriqlar" bo'limiga o'ting.`;

      const lowerInput = input.toLowerCase();
      if (lowerInput.includes('logistika') || lowerInput.includes('nima')) {
        response = aiResponses['logistika'];
      } else if (lowerInput.includes('broker') || lowerInput.includes('carrier') || lowerInput.includes('farq')) {
        response = aiResponses['broker'];
      } else if (lowerInput.includes('load') || lowerInput.includes('board') || lowerInput.includes('dat')) {
        response = aiResponses['load'];
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSuggestionClick = (text: string) => {
    setInput(text);
  };

  return (
    <div className="h-[calc(100vh-8rem)] lg:h-[calc(100vh-4rem)] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-accent-foreground" />
        </div>
        <div>
          <h1 className="font-semibold text-foreground">AI O'quv Yordamchi</h1>
          <p className="text-sm text-muted-foreground">Logistika bo'yicha savollaringizga javob beradi</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3",
              message.role === 'user' ? "justify-end" : "justify-start"
            )}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
            
            <div
              className={cn(
                "max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-3",
                message.role === 'user'
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-muted text-foreground rounded-bl-md"
              )}
            >
              <div className="prose prose-sm max-w-none">
                {message.content.split('\n').map((line, i) => (
                  <p key={i} className="mb-1 last:mb-0 whitespace-pre-wrap">
                    {line.startsWith('**') ? (
                      <strong>{line.replace(/\*\*/g, '')}</strong>
                    ) : line.startsWith('- ') ? (
                      <span className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {line.slice(2)}
                      </span>
                    ) : line.match(/^\d\./) ? (
                      <span className="flex items-start gap-2">
                        <span className="text-primary font-medium">{line.slice(0, 2)}</span>
                        {line.slice(2)}
                      </span>
                    ) : (
                      line
                    )}
                  </p>
                ))}
              </div>
            </div>

            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-secondary-foreground" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length <= 1 && (
        <div className="py-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-3">Tez savollar:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(q.text)}
                className="flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm text-foreground transition-colors"
              >
                <q.icon className="w-4 h-4 text-primary" />
                <span>{q.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="pt-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Savolingizni yozing..."
            className="flex-1 h-12"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSend} 
            disabled={!input.trim() || isLoading}
            variant="gradient"
            size="icon"
            className="h-12 w-12"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
