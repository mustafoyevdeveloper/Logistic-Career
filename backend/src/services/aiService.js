import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return {
      content: response.choices[0].message.content,
      tokens: response.usage.total_tokens,
      model: 'gpt-3.5-turbo',
    };
  } catch (error) {
    console.error('AI Service Error:', error);
    throw new Error('AI xizmati bilan bog\'lanishda xatolik yuz berdi');
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

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Siz topshiriqlarni baholovchi AI yordamchisisiz. Faqat 0-100 orasidagi raqamni qaytaring.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 50,
    });

    const score = parseInt(response.choices[0].message.content.trim());
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

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Siz logistika darslari uchun amaliy savollar yaratuvchi yordamchisiz.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 300,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('AI Question Generation Error:', error);
    return null;
  }
};

