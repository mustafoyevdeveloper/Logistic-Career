import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
// Model nomini .env dan boshqarish uchun:
// GEMINI_MODEL=gemini-1.5-flash-latest yoki GEMINI_MODEL=chat-bison-001 va hokazo
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const callGemini = async (body) => {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY yoki GOOGLE_API_KEY .env faylida topilmadi');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Gemini API error:', res.status, text);
    throw new Error(`Gemini API xatosi: ${res.status}`);
  }

  const data = await res.json();
  const candidate = data.candidates?.[0];
  const part = candidate?.content?.parts?.[0];

  return {
    text: part?.text || '',
    tokens: data.usageMetadata?.totalTokenCount || 0,
  };
};

/**
 * AI bilan chat qilish
 */
export const chatWithAI = async (messages, context = {}) => {
  try {
    const systemPrompt = `Siz logistika o'quv markazining AI yordamchisisiz. Sizning vazifangiz:
- Xalqaro logistika, dispetcherlik va transport sohasida o'quvchilarga yordam berish
- Savollarga aniq va tushunarli javob berish
- Amaliy misollar va senariylar bilan tushuntirish
- O'zbek tilida professional va do'stona muloqot qilish

Muhim tushunchalar:
- Freight Broker: Yuk jo'natuvchi va tashuvchi o'rtasida vositachi
- Carrier: Haqiqiy transport egasi
- Shipper: Yuk jo'natuvchi
- Consignee: Yuk qabul qiluvchi
- Load Board: Yuklarni topish platformasi (DAT, Truckstop)
- Rate Confirmation: Narx tasdiqlash hujjati

Har doim o'zbek tilida javob bering va amaliy misollar keltiring.`;

    const body = {
      contents: [
        {
          role: 'user',
          parts: [{ text: systemPrompt }],
        },
        ...messages.map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    };

    const result = await callGemini(body);

    return {
      content: result.text,
      tokens: result.tokens,
      model: GEMINI_MODEL,
    };
  } catch (error) {
    console.error('AI Service Error:', error);
    
    // 429 - Quota exceeded (pul/credit tugagan)
    if (error.status === 429 || error.code === 'insufficient_quota') {
      throw new Error('AI xizmati vaqtincha mavjud emas. Iltimos, keyinroq qayta urinib ko\'ring yoki administratorga murojaat qiling.');
    }
    
    // 401 - Invalid API key
    if (error.status === 401 || error.code === 'invalid_api_key') {
      throw new Error('AI xizmati sozlanmagan. Iltimos, administratorga murojaat qiling.');
    }
    
    // Boshqa xatolar
    throw new Error('AI xizmati bilan bog\'lanishda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko\'ring.');
  }
};

/**
 * Topshiriqni AI tomonidan baholash
 */
export const gradeAssignment = async (assignment, answers) => {
  try {
    const prompt = `Quyidagi topshiriq javoblarini baholang va 0-100 ball orasida baho bering.

Topshiriq: ${assignment.title}
Tavsif: ${assignment.description}

Javoblar:
${JSON.stringify(answers, null, 2)}

Baholash mezonlari:
- To'g'ri javoblar: 80-100 ball
- Qisman to'g'ri: 50-79 ball
- Noto'g'ri yoki to'liq emas: 0-49 ball

Faqat raqamli baho qaytaring (0-100).`;

    const body = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text:
                'Siz topshiriqlarni baholovchi AI yordamchisisiz. Faqat 0-100 orasidagi raqamni qaytaring.\n\n' +
                prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 20,
      },
    };

    const result = await callGemini(body);
    const score = parseInt(result.text.trim(), 10);
    return Math.min(100, Math.max(0, isNaN(score) ? 0 : score));
  } catch (error) {
    console.error('AI Grading Error:', error);
    return null; // AI baholash muvaffaqiyatsiz bo'lsa, null qaytaradi
  }
};

/**
 * AI savol yaratish (dars oxirida)
 */
export const generateLessonQuestion = async (lesson) => {
  try {
    const prompt = `"${lesson.title}" darsi uchun o'quvchiga amaliy savol yarating.
Savol real logistika senariysi bo'lishi kerak va o'zbek tilida bo'lishi kerak.

Dars mavzulari: ${lesson.topics.join(', ')}

Savol formatida qaytaring.`;

    const body = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text:
                'Siz logistika darslari uchun amaliy savollar yaratuvchi yordamchisiz.\n\n' +
                prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 300,
      },
    };

    const result = await callGemini(body);
    return result.text;
  } catch (error) {
    console.error('AI Question Generation Error:', error);
    return null;
  }
};

