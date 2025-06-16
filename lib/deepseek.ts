// DeepSeek API Integration
// This module handles all interactions with the DeepSeek API

const DEEPSEEK_API_KEY = 'sk-8e8b3cf59fb74f49be40ce28c96ccf49';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

interface BaziAnalysis {
  elements: {
    dominant: string;
    weak: string;
    all: string[];
  };
  animals: {
    dominant: string;
    weak: string;
    all: string[];
  };
  personality: string[];
  compatibility: string[];
  lucky: {
    colors: string[];
    numbers: number[];
    directions: string[];
  };
  challenges: string[];
  opportunities: string[];
}

export async function generateFreeReading(userBazi: BaziAnalysis, todayBazi: BaziAnalysis): Promise<string> {
  try {
    const prompt = `Create today's fortune reading guidance and analysis, using "you" language. Make it personal and insightful. No questions or disclaimers. Don't include Chinese characters. 
    Use natural markdown formatting for structure like headings, bold, and lists.\n\n**User Profile:**\n${JSON.stringify(userBazi)}\n\n**Daily Energy Profile:**\n${JSON.stringify(todayBazi)}`;

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'Unable to generate reading at this time.';
  } catch (error) {
    console.error('Error generating reading:', error);
    throw new Error('Failed to generate reading. Please try again later.');
  }
}

export async function generatePremiumReading(
  userBazi: BaziAnalysis,
  todayBazi: BaziAnalysis,
  specificQuestion?: string
): Promise<string> {
  try {
    const basePrompt = `Create a detailed premium fortune reading and analysis, using "you" language. Make it personal, insightful, and specific. No questions or disclaimers. Don't include Chinese characters.
    Use natural markdown formatting for structure like headings, bold, and lists.\n\n**User Profile:**\n${JSON.stringify(userBazi)}\n\n**Daily Energy Profile:**\n${JSON.stringify(todayBazi)}`;

    const prompt = specificQuestion
      ? `${basePrompt}\n\n**Specific Question:**\n${specificQuestion}`
      : basePrompt;

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'Unable to generate premium reading at this time.';
  } catch (error) {
    console.error('Error generating premium reading:', error);
    throw new Error('Failed to generate premium reading. Please try again later.');
  }
} 