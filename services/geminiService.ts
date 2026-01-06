import { GoogleGenAI, Type, Schema } from "@google/genai";
import { LotteryType, LuckyDailyResponse } from "../types";

// Schema for structured output from Gemini
const luckySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    luckyIndex: { type: Type.NUMBER, description: "A score from 0 to 100 indicating luck for lottery today" },
    element: { type: Type.STRING, description: "The dominant Five Element (Wu Xing) for today" },
    auspiciousDirection: { type: Type.STRING, description: "Lucky direction (e.g., Southeast)" },
    advice: { type: Type.STRING, description: "One sentence advice based on Chinese Almanac (Huang Li)" },
    suggestedNumbers: {
      type: Type.OBJECT,
      properties: {
        type: { type: Type.STRING, description: "The lottery type requested" },
        redBalls: { 
          type: Type.ARRAY, 
          items: { type: Type.NUMBER },
          description: "Array of lucky red ball numbers based on the lottery rules"
        },
        blueBalls: { 
          type: Type.ARRAY, 
          items: { type: Type.NUMBER },
          description: "Array of lucky blue ball numbers based on the lottery rules"
        },
        reasoning: { type: Type.STRING, description: "Short mystical reason for these numbers" }
      },
      required: ["type", "redBalls", "blueBalls", "reasoning"]
    }
  },
  required: ["luckyIndex", "element", "auspiciousDirection", "advice", "suggestedNumbers"]
};

export const fetchDailyLuckyNumbers = async (
  lotteryType: LotteryType
): Promise<LuckyDailyResponse> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const today = new Date().toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    weekday: 'long' 
  });

  const lotteryRules = lotteryType === LotteryType.SSQ 
    ? "Double Color Ball (SSQ): 6 unique Red balls (1-33) and 1 Blue ball (1-16)." 
    : "Super Lotto (DLT): 5 unique Red balls (1-35) and 2 unique Blue balls (1-12).";

  const prompt = `
    Today is ${today}.
    Act as an expert Chinese Fortune Teller and Numerologist.
    Analyze the 'Huang Li' (Almanac) for today.
    Generate a JSON response containing daily luck prediction and a set of lucky lottery numbers for ${lotteryType}.
    
    Rules for numbers: ${lotteryRules}
    Ensure the numbers are sorted ascendingly.
    The response must strictly follow the JSON schema provided.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: luckySchema,
        temperature: 0.8 // Slightly creative for "Fortune Telling"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as LuckyDailyResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};