import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parsing middleware
app.use(express.json());

// Lazy-initialize Gemini API
let aiClient: GoogleGenAI | null = null;
function getAiClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY" && key.trim() !== "") {
      aiClient = new GoogleGenAI({ apiKey: key });
    }
  }
  return aiClient;
}

// AI Rehab Plan Endpoint
app.post("/api/rehab-plan", async (req, res) => {
  try {
    const { name, offenses, behaviorScore, caseNotes, securityLevel } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Inmate name is required" });
    }

    const ai = getAiClient();
    if (!ai) {
      console.warn("GEMINI_API_KEY is not configured or placeholder. Using fallback offline evaluation.");
      // Return highly detailed, realistic fallback rehabilitation plan
      const mockPlan = {
        riskAssessment: {
          recidivismRisk: behaviorScore < 50 ? "High" : behaviorScore < 80 ? "Medium" : "Low",
          escapeRisk: securityLevel === "Maximum" ? "Medium" : "Low",
          violenceRisk: securityLevel === "Maximum" || offenses.some((o: string) => o.toLowerCase().includes("assault") || o.toLowerCase().includes("weapon")) ? "High" : "Low",
          justification: `Offline analysis based on offense history (${offenses.join(", ")}) and behavioral index of ${behaviorScore}/100.`
        },
        recommendedPrograms: [
          {
            name: "Anger Management & Cognitive Behavioral Therapy",
            description: "A structured group counseling environment targeting behavioral triggers and emotional regulation.",
            frequency: "Bi-weekly, 90-minute sessions",
            goal: "Enhance decision-making frameworks and de-escalation strategies."
          },
          {
            name: "Vocational Skills Training (Computer Literacy & Woodworking)",
            description: "Hands-on occupational training to prepare the candidate for post-release employment.",
            frequency: "Mon-Wed-Fri, 3 hours daily",
            goal: "Secure basic certification to reduce post-release economic instability."
          }
        ],
        behavioralGoals: [
          "Maintain a clean disciplinary record for the next 90 days",
          "Participate actively in peer support groups",
          "Meet with the appointed social worker twice a month"
        ],
        housingRecommendation: securityLevel === "Maximum" ? "Single Cell, Block C (High Security)" : "Shared Ward, Block A/B (General Population)",
        releasePreparation: "Schedule pre-release housing assistance, job placement coaching, and establish a local community sponsor."
      };
      return res.json(mockPlan);
    }

    const prompt = `
You are an expert criminal psychologist and correctional rehabilitation officer.
Generate a comprehensive, scientifically backed Rehabilitation Plan and Risk Assessment for the following inmate:

Inmate Name: ${name}
Security Level: ${securityLevel}
Current Offenses: ${offenses.join(", ")}
Behavioral Progress Score (0-100): ${behaviorScore}/100
Case Officer Notes: ${caseNotes || "No specific notes recorded."}

Return a strictly valid JSON object matching the following structure:
{
  "riskAssessment": {
    "recidivismRisk": "Low" | "Medium" | "High",
    "escapeRisk": "Low" | "Medium" | "High",
    "violenceRisk": "Low" | "Medium" | "High",
    "justification": "Detailed explanation of risks based on behavior and offenses."
  },
  "recommendedPrograms": [
    {
      "name": "Program Title",
      "description": "Short description of what the program is.",
      "frequency": "e.g., Weekly, 2 hours",
      "goal": "Expected positive outcome."
    }
  ],
  "behavioralGoals": [
    "Specific, measurable behavioral goal 1",
    "Specific, measurable behavioral goal 2"
  ],
  "housingRecommendation": "Detailed housing / block assignment recommendation.",
  "releasePreparation": "Key preparations or transition steps required for rehabilitation."
}

Do not include any extra text, commentary, or markdown outside the valid JSON. Just output raw JSON or a JSON block.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let text = response.text || "";
    // Clean up markdown block format if present
    if (text.includes("```json")) {
      text = text.split("```json")[1].split("```")[0];
    } else if (text.includes("```")) {
      text = text.split("```")[1].split("```")[0];
    }
    
    const parsedData = JSON.parse(text.trim());
    res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    res.status(500).json({ error: "Failed to generate AI Rehabilitation Plan: " + error.message });
  }
});

// Serve frontend assets using Vite middleware or static files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Correctional Center Server running on port ${PORT}`);
  });
}

startServer();
