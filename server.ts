import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Initialize Gemini AI client lazily/safely
  const getAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // AI Feature API Route
  app.post("/api/ai/process", async (req, res) => {
    try {
      const { action, content, title, prompt } = req.body;

      if (!action) {
        return res.status(400).json({ error: "Action parameter is required." });
      }

      const ai = getAI();

      let systemInstruction = "You are DeskFlow AI, an intelligent assistant built into DeskFlow AI Notes.";
      let userPrompt = "";

      if (action === "summarize") {
        systemInstruction += " Summarize the note concisely in 2-3 sentences.";
        userPrompt = `Title: ${title || "Untitled"}\n\nContent:\n${content || "(No content provided)"}`;
      } else if (action === "tags") {
        systemInstruction += " Extract 3 to 6 short, relevant single-word hashtags for this note. Return ONLY a JSON array of string tags without '#' e.g. [\"ideas\",\"work\",\"planning\"].";
        userPrompt = `Title: ${title || ""}\nContent:\n${content || ""}`;
      } else if (action === "improve") {
        systemInstruction += " Enhance, format, and polish the given text into high-quality, readable Markdown with proper headers, bullet points, and clean typography. Preserve the core meaning.";
        userPrompt = `Content to improve:\n${content || ""}`;
      } else if (action === "takeaways") {
        systemInstruction += " Extract key takeaways and action items from the note. Format as Markdown bullet points with checkboxes [ ] for action items.";
        userPrompt = `Title: ${title || ""}\nContent:\n${content || ""}`;
      } else if (action === "draft") {
        systemInstruction += " Generate a structured, detailed, professional note in Markdown based on the prompt or title provided.";
        userPrompt = `Topic or Title: ${prompt || title || "New Note Topic"}`;
      } else {
        return res.status(400).json({ error: `Unknown action: ${action}` });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: userPrompt,
        config: {
          systemInstruction,
        },
      });

      const resultText = response.text || "";

      return res.json({ result: resultText });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      return res.status(500).json({
        error: error.message || "Failed to process AI request.",
      });
    }
  });

  // Health route
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "DeskFlow AI Notes" });
  });

  // Vite development middleware vs Static Production serving
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
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
