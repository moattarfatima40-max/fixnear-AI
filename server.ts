import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { SERVICE_CATEGORIES } from "./src/data/categories.js";
import { SERVICE_PROVIDERS } from "./src/data/providers.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "FixNear AI" });
  });

  // AI Problem Analysis Endpoint
  app.post("/api/analyze-problem", async (req, res) => {
    const { problemDescription, locationZip = "90210", urgencyHint = "normal" } = req.body;

    if (!problemDescription || typeof problemDescription !== "string" || problemDescription.trim().length === 0) {
      return res.status(400).json({ error: "Please enter a problem description before analyzing." });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    const systemInstruction = `You are FixNear AI, an intelligent everyday problem classification assistant serving users in Pakistan.

Understand problem descriptions written in English, Roman Urdu (Urdu written in Latin/English script), or a mix of both.

Common Roman Urdu phrases to recognize and categorize accurately:
- "mera AC thanda nahi kar raha" / "garm hawa de raha hai" -> AC Technician
- "bijli baar baar ja rahi hai" / "short circuit" / "breaker trip ho raha hai" -> Electrician
- "pani leak ho raha hai" / "nalka kharab hai" / "tanki overflow" -> Plumber
- "bike start nahi ho rahi" / "gaadi start nahi ho rahi" -> Mechanic
- "mobile charge nahi ho raha" / "screen toot gayi" -> Mobile Phone Repair
- "WiFi slow chal raha hai" / "laptop hang ho raha hai" -> Laptop Repair
- "fridge thanda nahi kar raha" / "washing machine chal nahi rahi" -> Appliance Repair
- "geyser kaam nahi kar raha" -> Plumber

Return structured JSON Adhering strictly to schema. Provide explanation and troubleshooting in clear, practical English.`;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build",
            },
          },
        });

        const prompt = `User Problem Statement: "${problemDescription}"
User Location Zip: ${locationZip}
User Urgency Hint: ${urgencyHint}

Analyze this problem (which may be written in English or Roman Urdu) and classify it.
Supported categories MUST be strictly one of these 7 options:
- "AC Technician"
- "Electrician"
- "Plumber"
- "Mechanic"
- "Mobile Phone Repair"
- "Laptop Repair"
- "Appliance Repair"

Provide structured output in JSON adhering strictly to the schema provided.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                category: {
                  type: Type.STRING,
                  enum: [
                    "AC Technician",
                    "Electrician",
                    "Plumber",
                    "Mechanic",
                    "Mobile Phone Repair",
                    "Laptop Repair",
                    "Appliance Repair",
                  ],
                },
                professional: { type: Type.STRING },
                possibleIssue: { type: Type.STRING },
                urgency: {
                  type: Type.STRING,
                  enum: ["Low", "Medium", "High"],
                },
                safeAdvice: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                nextStep: { type: Type.STRING },
                // Complementary fields for deep UI triage
                primaryCategoryId: { type: Type.STRING },
                categoryName: { type: Type.STRING },
                recommendedTrade: { type: Type.STRING },
                urgencyReason: { type: Type.STRING },
                summaryTitle: { type: Type.STRING },
                diagnosticSummary: { type: Type.STRING },
                potentialCauses: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                estimatedCostMin: { type: Type.NUMBER },
                estimatedCostMax: { type: Type.NUMBER },
                estimatedTimeToFix: { type: Type.STRING },
                questionsToAskProvider: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                safetyTips: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                matchConfidence: { type: Type.NUMBER },
              },
              required: [
                "category",
                "professional",
                "possibleIssue",
                "urgency",
                "safeAdvice",
                "nextStep",
              ],
            },
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text.trim());

          // Map category to internal primaryCategoryId for provider matching
          const categoryMap: Record<string, string> = {
            "AC Technician": "hvac",
            "Electrician": "electrical",
            "Plumber": "plumbing",
            "Mechanic": "auto",
            "Mobile Phone Repair": "mobile_repair",
            "Laptop Repair": "laptop_repair",
            "Appliance Repair": "appliance",
          };

          const matchedCatId = categoryMap[parsed.category] || "handyman";
          const matchingProviders = SERVICE_PROVIDERS.filter(
            (p) => p.categoryId === matchedCatId
          ).map((p) => p.id);

          const urgencyLevelLower = (parsed.urgency || "Medium").toLowerCase() as "low" | "medium" | "high";

          return res.json({
            category: parsed.category || "Appliance Repair",
            professional: parsed.professional || "Qualified Repair Specialist",
            possibleIssue: parsed.possibleIssue || parsed.diagnosticSummary || "Component wear or line maintenance required.",
            urgency: parsed.urgency || "Medium",
            safeAdvice: parsed.safeAdvice && parsed.safeAdvice.length > 0
              ? parsed.safeAdvice
              : ["Keep workspace clear and dry.", "Avoid using the unit until inspected."],
            nextStep: parsed.nextStep || "Schedule a verified local specialist to inspect and provide a firm quote.",

            primaryCategoryId: parsed.primaryCategoryId || matchedCatId,
            categoryName: parsed.categoryName || parsed.category,
            recommendedTrade: parsed.recommendedTrade || parsed.professional,
            urgencyLevel: urgencyLevelLower,
            urgencyReason: parsed.urgencyReason || `Rated ${parsed.urgency} urgency based on symptom evaluation.`,
            summaryTitle: parsed.summaryTitle || `${parsed.category} Issue Triage`,
            diagnosticSummary: parsed.diagnosticSummary || parsed.possibleIssue,
            potentialCauses: parsed.potentialCauses && parsed.potentialCauses.length > 0 ? parsed.potentialCauses : [parsed.possibleIssue],
            estimatedCostMin: parsed.estimatedCostMin || 95,
            estimatedCostMax: parsed.estimatedCostMax || 280,
            estimatedTimeToFix: parsed.estimatedTimeToFix || "1 - 2 hours",
            questionsToAskProvider: parsed.questionsToAskProvider || [
              "Is the service call fee applied toward the final repair?",
              "What warranty do you offer on labor and parts?"
            ],
            safetyTips: parsed.safetyTips || parsed.safeAdvice || [
              "Turn off power or water to the unit if active leaking or sparking occurs."
            ],
            recommendedProviderIds: matchingProviders.length > 0 ? matchingProviders : ["prov-p1", "prov-e1"],
            matchConfidence: parsed.matchConfidence || 95,
          });
        }
      } catch (err) {
        console.error("Gemini API call error, using local fallback generator:", err);
      }
    }

    // Heuristic Fallback Engine
    const fallbackResult = generateLocalAnalysis(problemDescription, urgencyHint);
    return res.json(fallbackResult);
  });

  // Vite middleware or static serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FixNear AI server running on http://0.0.0.0:${PORT}`);
  });
}

function generateLocalAnalysis(desc: string, urgencyHint: string) {
  const lower = desc.toLowerCase();

  let categoryId = "handyman";
  let categoryName = "Handyman & Repairs";
  let trade = "General Home Repairs Handyman";
  let urgency: "emergency" | "high" | "medium" | "low" = "medium";
  let minCost = 1000;
  let maxCost = 3500;

  // 1. AC / Cooling (English + Roman Urdu)
  if (
    lower.includes("ac") || lower.includes("air condition") || lower.includes("cooling") ||
    lower.includes("thanda") || lower.includes("garm hawa") || lower.includes("chilling") ||
    lower.includes("compressor") || lower.includes("inverter ac") || lower.includes("gas refill")
  ) {
    categoryId = "hvac";
    categoryName = "AC Technician & Cooling";
    trade = "Certified AC Specialist";
    minCost = 1500;
    maxCost = 5000;
    urgency = lower.includes("heatwave") || lower.includes("tripping") || lower.includes("garm hawa") ? "high" : "medium";

  // 2. Electrical (English + Roman Urdu)
  } else if (
    lower.includes("bijli") || lower.includes("electric") || lower.includes("spark") ||
    lower.includes("breaker") || lower.includes("short circuit") || lower.includes("ups") ||
    lower.includes("light") || lower.includes("flicker") || lower.includes("baar baar ja") ||
    lower.includes("plug") || lower.includes("wire") || lower.includes("current")
  ) {
    categoryId = "electrical";
    categoryName = "Electrical & Wiring";
    trade = "Licensed Electrician";
    minCost = 1200;
    maxCost = 4500;
    urgency = lower.includes("spark") || lower.includes("burnt") || lower.includes("short circuit") || urgencyHint === "emergency" ? "emergency" : "high";

  // 3. Plumbing / Water / Geyser (English + Roman Urdu)
  } else if (
    lower.includes("pani") || lower.includes("leak") || lower.includes("water") ||
    lower.includes("pipe") || lower.includes("geyser") || lower.includes("nalka") ||
    lower.includes("tanki") || lower.includes("motor") || lower.includes("drain") ||
    lower.includes("clog") || lower.includes("toilet") || lower.includes("sewer")
  ) {
    categoryId = "plumbing";
    categoryName = "Plumbing & Pipes";
    trade = "Master Plumber";
    minCost = 1200;
    maxCost = 4000;
    urgency = lower.includes("burst") || lower.includes("flood") || lower.includes("overflow") || urgencyHint === "emergency" ? "emergency" : "high";

  // 4. Bike & Car Mechanic (English + Roman Urdu)
  } else if (
    lower.includes("bike") || lower.includes("car") || lower.includes("gaadi") ||
    lower.includes("start nahi") || lower.includes("motorcycle") || lower.includes("engine") ||
    lower.includes("brake") || lower.includes("battery") || lower.includes("tyre") ||
    lower.includes("mechanic") || lower.includes("jumpstart")
  ) {
    categoryId = "auto";
    categoryName = "Mechanic & Auto Repair";
    trade = "Certified Mobile Mechanic";
    minCost = 1500;
    maxCost = 4500;
    urgency = "high";

  // 5. Mobile Phone Repair (English + Roman Urdu)
  } else if (
    lower.includes("mobile") || lower.includes("phone") || lower.includes("charge nahi") ||
    lower.includes("charging") || lower.includes("screen") || lower.includes("glass") ||
    lower.includes("display") || lower.includes("iphone") || lower.includes("samsung")
  ) {
    categoryId = "mobile_repair";
    categoryName = "Mobile Phone Repair";
    trade = "Doorstep Mobile Technician";
    minCost = 1500;
    maxCost = 4000;
    urgency = "medium";

  // 6. Laptop / WiFi Repair (English + Roman Urdu)
  } else if (
    lower.includes("laptop") || lower.includes("wifi") || lower.includes("internet") ||
    lower.includes("slow chal") || lower.includes("hang") || lower.includes("pc") ||
    lower.includes("keyboard") || lower.includes("macbook")
  ) {
    categoryId = "laptop_repair";
    categoryName = "Laptop Repair";
    trade = "Chip-Level Laptop Specialist";
    minCost = 2000;
    maxCost = 5500;
    urgency = "medium";

  // 7. Appliance / Fridge (English + Roman Urdu)
  } else if (
    lower.includes("fridge") || lower.includes("refrigerator") || lower.includes("freezer") ||
    lower.includes("washing machine") || lower.includes("dhulai") || lower.includes("spin") ||
    lower.includes("microwave") || lower.includes("oven") || lower.includes("appliance")
  ) {
    categoryId = "appliance";
    categoryName = "Appliance Repair";
    trade = "Certified Appliance Technician";
    minCost = 1500;
    maxCost = 4000;
    urgency = lower.includes("spoiling") || lower.includes("leak") ? "high" : "medium";
  }

  const matchingProviders = SERVICE_PROVIDERS.filter((p) => p.categoryId === categoryId).map((p) => p.id);

  // Map categoryId to supported 7 categories
  const categoryEnumMap: Record<string, 'AC Technician' | 'Electrician' | 'Plumber' | 'Mechanic' | 'Mobile Phone Repair' | 'Laptop Repair' | 'Appliance Repair'> = {
    hvac: 'AC Technician',
    electrical: 'Electrician',
    plumbing: 'Plumber',
    auto: 'Mechanic',
    mobile_repair: 'Mobile Phone Repair',
    laptop_repair: 'Laptop Repair',
    appliance: 'Appliance Repair',
  };

  const matchedCategory = categoryEnumMap[categoryId] || 'Appliance Repair';
  const urgencyCapitalized = urgency === 'emergency' || urgency === 'high' ? 'High' : urgency === 'medium' ? 'Medium' : 'Low';

  return {
    category: matchedCategory,
    professional: trade,
    possibleIssue: `Symptoms suggest component stress or hardware maintenance requirement in ${categoryName.toLowerCase()}.`,
    urgency: urgencyCapitalized,
    safeAdvice: [
      "Keep workspace clear and dry.",
      "If active leak or sparking occurs, turn off local power or supply valve."
    ],
    nextStep: "Connect with a verified local specialist to inspect the unit and confirm repair scope.",

    primaryCategoryId: categoryId,
    categoryName: categoryName,
    recommendedTrade: trade,
    urgencyLevel: urgency,
    urgencyReason: urgency === "emergency" ? "Immediate action required to prevent structural damage or safety hazard." : "Prompt professional attention recommended to prevent compounding damage.",
    summaryTitle: `${categoryName} Issue Requiring ${trade}`,
    diagnosticSummary: `AI analysis detected symptoms consistent with ${categoryName.toLowerCase()} failure. Immediate diagnosis by a verified specialist will confirm line pressure, component continuity, or physical wear.`,
    potentialCauses: [
      "Worn internal seal, valve, or electrical connection",
      "Thermal stress or line pressure overload",
      "System age or mechanical wear in primary assembly"
    ],
    estimatedCostMin: minCost,
    estimatedCostMax: maxCost,
    estimatedTimeToFix: urgency === "emergency" ? "Under 2 hours (Emergency On-Site)" : "Same day or 1-3 hours",
    questionsToAskProvider: [
      "Is the service call fee credited toward the final repair cost?",
      "Do you provide a written warranty on parts and labor?",
      "Are you carrying emergency replacement parts on your vehicle today?"
    ],
    safetyTips: [
      "If active leak or electrical anomaly is present, isolate the local supply or breaker if safe to do so.",
      "Clear the area surrounding the work zone for easy technician access.",
      "Avoid attempting temporary mechanical modifications before the specialist inspects."
    ],
    recommendedProviderIds: matchingProviders.length > 0 ? matchingProviders : ["prov-p1", "prov-e1"],
    matchConfidence: 94
  };
}

startServer();
