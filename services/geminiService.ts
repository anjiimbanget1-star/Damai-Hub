import { GoogleGenAI } from "@google/genai";
import { AnalysisResult } from "../types";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeReportContent = async (text: string, type: 'THREAT' | 'PEACE'): Promise<AnalysisResult> => {
  try {
    const prompt = type === 'THREAT' 
      ? `Analyze the following report description for potential threats. 
         Text: "${text}"
         Return a JSON object with:
         - isSafe: boolean (false if it contains hate speech, radicalism, or violence)
         - suggestedCategory: string (e.g., "Hate Speech", "Radicalism", "Vandalism", "Harassment", or "Unclear")
         - sentimentScore: number (0 to 100, where 100 is very negative/dangerous)
         - summary: string (max 15 words summary)`
      : `Analyze the following peace activity report.
         Text: "${text}"
         Return a JSON object with:
         - isSafe: boolean (true usually)
         - suggestedCategory: string (e.g., "Community Service", "Interfaith Dialogue", "Education", "Charity")
         - sentimentScore: number (0 to 100, where 100 is very positive)
         - summary: string (max 15 words summary)`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const result = JSON.parse(response.text || "{}");
    
    return {
      isSafe: result.isSafe ?? true,
      suggestedCategory: result.suggestedCategory || "General",
      sentimentScore: result.sentimentScore || 50,
      summary: result.summary || "No summary available"
    };

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      isSafe: true,
      suggestedCategory: "Manual Review Required",
      sentimentScore: 50,
      summary: "Analysis failed."
    };
  }
};