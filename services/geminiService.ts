import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisData, MockChatLog } from "../types";

// Inizializzazione centralizzata
const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

// System instruction for the Customer Support Assistant
const ASSISTANT_SYSTEM_INSTRUCTION = `
You are a technical customer support assistant for "TechFlow Solutions".
Use the following context to answer questions (simulation of an uploaded PDF manual):

---
TECHFLOW X-2000 TECHNICAL MANUAL
1. To restart the device: Hold the Power button for 5 seconds.
2. Error Code E-404: No connectivity. Check the Ethernet cable.
3. Error Code E-500: Overheating. Turn off immediately and let cool for 30 minutes.
4. Firmware Update: Go to Settings > System > Update. Requires battery > 50%.
---

If the answer is not in the manual, kindly reply that you will automatically open a ticket for second-level support.
Be concise, professional, and use a reassuring tone in English.
`;

export const sendMessageToGemini = async (message: string, history: { role: string; parts: { text: string }[] }[]) => {
  try {
    const ai = getAIClient();
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: ASSISTANT_SYSTEM_INSTRUCTION,
      },
      history: history.map(h => ({ 
        role: h.role === 'model' ? 'model' : 'user', 
        parts: h.parts 
      }))
    });

    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    throw error;
  }
};

export const analyzeChatLogs = async (logs: MockChatLog[]): Promise<AnalysisData> => {
  try {
    const ai = getAIClient();
    const logsText = logs.map(l => `[${l.timestamp}] ${l.customer}: ${l.message}`).join('\n');
    
    const prompt = `
      Analyze the following customer support chat logs.
      
      LOGS:
      ${logsText}
      
      Return a JSON with exactly these fields:
      1. sentimentScore (0-100)
      2. topics (array of {name, count})
      3. summary (string, max 30 words)
      4. urgentIssues (array of strings)
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentimentScore: { type: Type.NUMBER },
            topics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  count: { type: Type.NUMBER }
                },
                required: ["name", "count"]
              }
            },
            summary: { type: Type.STRING },
            urgentIssues: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            }
          },
          required: ["sentimentScore", "topics", "summary", "urgentIssues"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text.trim()) as AnalysisData;
    }
    throw new Error("Empty response from AI");
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};