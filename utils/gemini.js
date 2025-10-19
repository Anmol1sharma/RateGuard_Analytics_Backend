import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateGeminiResponse(policyText) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are an expert insurance policy summarizer. Please summarize the following insurance policy in **exactly 5 concise bullet points**, covering the most important features, benefits, exclusions, and terms of the policy.

Use this format:
1. Point one...
2. Point two...
3. Point three...
4. Point four...
5. Point five...

Policy Text:
${policyText}
`;

    const result = await model.generateContent([prompt]);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Gemini API error:", error);
    return "❌ Failed to generate 5-point summary.";
  }
}



export async function getChatbotReply(userMessage) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are an expert in Indian insurance policies. Answer user questions in a simple, clear, and helpful way. Do not provide legal or financial advice, just general information.

User: ${userMessage}
`;

    const result = await model.generateContent([prompt]);
    const response = await result.response;
    const reply = response.text();

    return reply;
  } catch (error) {
    console.error("Chatbot Gemini error:", error);
    return "Sorry, I couldn't process your question.";
  }
}
