import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiService } from '@/services/api';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles,
  Lightbulb,
  HelpCircle,
  BookOpen,
  Trash2
} from 'lucide-react';
import { ChatMessage } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const suggestedQuestions = [
  { icon: Lightbulb, text: "Logistika nima va qanday ishlaydi?" },
  { icon: HelpCircle, text: "Freight broker va carrier farqi nima?" },
  { icon: BookOpen, text: "Load board qanday ishlaydi?" },
];

export default function AIChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const response = await apiService.request<{ messages: any[] }>('/chat/history');
      if (response.success && response.data && response.data.messages) {
        const formattedMessages: ChatMessage[] = response.data.messages.map((msg: any) => ({
          id: msg._id || msg.id || Date.now().toString(),
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.createdAt || msg.timestamp || new Date()),
        }));
        setMessages(formattedMessages);
        
        // Session ID ni olish (agar mavjud bo'lsa)
        if (formattedMessages.length > 0) {
          const firstMessage = response.data.messages[0];
          if (firstMessage && firstMessage.sessionId) {
            setSessionId(firstMessage.sessionId);
          }
        }
      } else {
        // Agar xabarlar bo'lmasa, welcome message qo'shish
        setMessages([{
          id: 'welcome',
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
        }]);
      }
    } catch (error: any) {
      console.error('Chat history load error:', error);
      // Agar xatolik bo'lsa, welcome message qo'shish
      setMessages([{
        id: 'welcome',
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
      }]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    let currentSessionId = sessionId;

    // Agar session yo'q bo'lsa, yaratish
    if (!currentSessionId) {
      try {
        const sessionResponse = await apiService.request<{ sessionId: string; message: any }>('/chat/session', {
          method: 'POST',
          body: JSON.stringify({}),
        });
        if (sessionResponse.success && sessionResponse.data) {
          currentSessionId = sessionResponse.data.sessionId;
          setSessionId(currentSessionId);
          if (sessionResponse.data.message) {
            const welcomeMessage: ChatMessage = {
              id: sessionResponse.data.message._id || sessionResponse.data.message.id,
              role: 'assistant',
              content: sessionResponse.data.message.content,
              timestamp: new Date(sessionResponse.data.message.createdAt || new Date()),
            };
            setMessages([welcomeMessage]);
          }
        } else {
          toast.error('Sessiya yaratishda xatolik');
          return;
        }
      } catch (error: any) {
        toast.error(error.message || 'Sessiya yaratishda xatolik');
        return;
      }
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      const response = await apiService.request<{ userMessage: any; aiResponse: any }>('/chat/message', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: currentSessionId,
          content: currentInput,
        }),
      });

      if (response.success && response.data) {
        // User message'ni yangilash (backend'dan kelgan ID bilan)
        if (response.data.userMessage) {
          setMessages((prev) => {
            const updated = prev.map(msg => 
              msg.id === userMessage.id 
                ? {
                    ...msg,
                    id: response.data.userMessage._id || response.data.userMessage.id || msg.id,
                  }
                : msg
            );
            return updated;
          });
        }

        // AI message'ni qo'shish
        if (response.data.aiResponse) {
          const aiMessage: ChatMessage = {
            id: response.data.aiResponse._id || response.data.aiResponse.id || Date.now().toString(),
            role: 'assistant',
            content: response.data.aiResponse.content,
            timestamp: new Date(response.data.aiResponse.createdAt || new Date()),
          };
          setMessages((prev) => [...prev, aiMessage]);
        }
      } else {
        throw new Error(response.message || 'Xabar yuborishda xatolik');
      }
    } catch (error: any) {
      toast.error(error.message || 'Xabar yuborishda xatolik');
      // Xatolik bo'lsa, user message'ni olib tashlash
      setMessages((prev) => prev.filter(msg => msg.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const response = await apiService.request(`/chat/message/${messageId}`, {
        method: 'DELETE',
      });

      if (response.success) {
        setMessages((prev) => prev.filter(msg => msg.id !== messageId));
      }
    } catch (error: any) {
      toast.error(error.message || 'Xabarni o\'chirishda xatolik');
    }
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
      {isLoadingHistory ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3 group",
                message.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
              
              <div className="flex items-start gap-2">
                <div
                  className={cn(
                    "max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-3 relative",
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
                {message.id !== 'welcome' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteMessage(message.id)}
                  >
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </Button>
                )}
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
      )}

      {/* Suggested Questions */}
      {messages.length <= 1 && !isLoadingHistory && (
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
