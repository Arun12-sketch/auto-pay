import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
// In a production environment, this should be proxied through a backend to protect the key,
// but for this hackathon prototype, we use the env variable directly.
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

export const generateAgentResponse = async (
  systemInstruction: string,
  history: { role: 'user' | 'model'; text: string }[],
  newMessage: string
): Promise<string> => {
  try {
    const modelId = 'gemini-2.5-flash';

    // Convert internal history format to Gemini Chat format if needed, 
    // but for simple request/response we can just use generateContent with system instruction.
    // For a persistent chat, we use ai.chats.create
    
    // We will construct a chat session
    const chat = ai.chats.create({
      model: modelId,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const response = await chat.sendMessage({ message: newMessage });
    
    // Extract text safely based on SDK guidelines
    const text = response.text;
    
    if (!text) {
        return "I apologize, but I couldn't generate a response at this time.";
    }
    
    return text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Connection error. The agent is momentarily unreachable.";
  }
};