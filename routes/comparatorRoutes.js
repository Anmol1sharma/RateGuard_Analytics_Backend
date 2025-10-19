import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/compare", async (req, res) => {
  const { policy1, policy2 } = req.body;
  if (!policy1 || !policy2) {
    return res.status(400).json({ error: "Both policy names required." });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are an insurance expert AI.

Compare two insurance policies based on their names. Your job is to assume and simulate details of these policies as typically offered by insurers in India. Use general industry knowledge and generate a comparison in a clean HTML table.

Policy A: "${policy1}"
Policy B: "${policy2}"

Include differences in:
- Policy Type
- Coverage
- Eligibility
- Premiums
- Exclusions
- Claim Process
- Benefits
- Add-ons (if any)
- Limitations

Output only an HTML table with columns: "Feature", "${policy1}", "${policy2}". Do not add any extra explanation before or after the table.
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    if (!response.includes("<table")) {
      return res.status(500).json({ error: "AI did not return a valid table." });
    }

    res.json({ result: response });
  } catch (err) {
    console.error("Error comparing policies:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
