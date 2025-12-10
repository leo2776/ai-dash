import { GoogleGenAI, Type, Chat } from "@google/genai";
import { GeneratedContent, AnalysisResult, GeneratedCopy } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const BASE_MODEL = "gemini-2.5-flash";

/**
 * Generates a professional description for the venue based on keywords.
 */
export const generateVenueDescription = async (name: string, vibe: string, type: string): Promise<GeneratedContent> => {
  const prompt = `Write a welcoming, professional, and attractive website description for a venue.
  Venue Name: ${name}
  Type: ${type}
  Vibe/Keywords: ${vibe}
  
  Keep it under 60 words. Make it sound inviting to customers looking to make a reservation.`;

  const response = await ai.models.generateContent({
    model: BASE_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING }
        },
        required: ["text"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  return JSON.parse(text) as GeneratedContent;
};

export const analyzeMarketTrends = async (topic: string): Promise<AnalysisResult> => {
  const prompt = `Analyze current market trends for: ${topic}.`;
  
  const response = await ai.models.generateContent({
    model: BASE_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendation: { type: Type.STRING },
          sentiment: { type: Type.STRING, enum: ["positive", "negative", "neutral"] }
        },
        required: ["summary", "keyPoints", "recommendation", "sentiment"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as AnalysisResult;
};

export const generateMarketingCopy = async (product: string, audience: string, tone: string): Promise<GeneratedCopy> => {
  const prompt = `Write marketing copy for ${product}. Target audience: ${audience}. Tone: ${tone}.`;

  const response = await ai.models.generateContent({
    model: BASE_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          headline: { type: Type.STRING },
          body: { type: Type.STRING },
          ctas: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["headline", "body", "ctas"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as GeneratedCopy;
};

export const createStrategyChat = (): Chat => {
  return ai.chats.create({
    model: BASE_MODEL,
    config: {
      systemInstruction: "You are a strategic business advisor. Provide concise, high-impact advice."
    }
  });
};