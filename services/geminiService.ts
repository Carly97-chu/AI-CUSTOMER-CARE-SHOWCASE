import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisData, MockChatLog } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

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
    const model = 'gemini-2.5-flash';
    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction: ASSISTANT_SYSTEM_INSTRUCTION,
      },
      history: history.map(h => ({ role: h.role, parts: h.parts }))
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    throw error;
  }
};

export const analyzeChatLogs = async (logs: MockChatLog[]): Promise<AnalysisData> => {
  try {
    const model = 'gemini-2.5-flash';
    const logsText = logs.map(l => `[${l.timestamp}] ${l.customer}: ${l.message}`).join('\n');
    
    const prompt = `
      Analyze the following customer support chat logs.
      
      LOGS:
      ${logsText}
      
      Return a JSON with:
      1. sentimentScore: a number from 0 (very negative) to 100 (very positive).
      2. topics: an array of objects {name, count} with the top 3 main topics discussed.
      3. summary: a short summary in English of the general trend (max 30 words).
      4. urgentIssues: list of any urgent issues detected.
    `;

    const result = await ai.models.generateContent({
      model,
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
                }
              }
            },
            summary: { type: Type.STRING },
            urgentIssues: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            }
          }
        }
      }
    });

    if (result.text) {
      return JSON.parse(result.text) as AnalysisData;
    }
    throw new Error("No data returned");
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};