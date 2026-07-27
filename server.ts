import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
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

// --- API ROUTES ---

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", aiConfigured: !!getGeminiClient() });
});

// AI Endpoint: Task Deconstruction
app.post("/api/ai/deconstruct-task", async (req, res) => {
  try {
    const { taskTitle, description, projectContext } = req.body;
    if (!taskTitle) {
      return res.status(400).json({ error: "taskTitle is required" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback rule-based deconstruction if key not active
      return res.json({
        subtasks: [
          { title: `Analyze requirement for "${taskTitle}"`, estimatedMinutes: 15, priority: "high" },
          { title: "Draft core outline or steps", estimatedMinutes: 30, priority: "high" },
          { title: "Execute main implementation", estimatedMinutes: 45, priority: "medium" },
          { title: "Review and verify completed work", estimatedMinutes: 20, priority: "low" },
        ],
      });
    }

    const prompt = `Break down the following main task into 3-6 actionable, structured subtasks with estimated duration in minutes and priority level (high, medium, low).
Task: "${taskTitle}"
${description ? `Context/Description: ${description}` : ""}
${projectContext ? `Project Category: ${projectContext}` : ""}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert productivity coach. Break tasks into logical, concise, step-by-step actionable subtasks.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subtasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  estimatedMinutes: { type: Type.INTEGER },
                  priority: { type: Type.STRING, enum: ["high", "medium", "low"] },
                },
                required: ["title", "estimatedMinutes", "priority"],
              },
            },
          },
          required: ["subtasks"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (err: any) {
    console.error("Error in /api/ai/deconstruct-task:", err);
    res.status(500).json({ error: err.message || "Failed to deconstruct task" });
  }
});

// AI Endpoint: Daily Briefing & Priorities
app.post("/api/ai/daily-briefing", async (req, res) => {
  try {
    const { tasks, date, userName } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      const openCount = (tasks || []).filter((t: any) => t.status !== "done").length;
      return res.json({
        greeting: `Good day${userName ? ", " + userName : ""}! You have ${openCount} open tasks today.`,
        topPriorities: tasks && tasks.length > 0 ? tasks.slice(0, 3).map((t: any) => t.title) : ["Plan your core goals", "Block focus time", "Review inbox"],
        focusAdvice: "Focus on your single highest impact task before tackling smaller administrative items.",
        estimatedHours: 4.5,
      });
    }

    const taskSummary = (tasks || []).map((t: any) => `- [${t.priority.toUpperCase()}] ${t.title} (${t.status}, ~${t.estimatedMinutes || 30} mins)`).join("\n");

    const prompt = `Analyze this list of tasks for ${date || "today"}:
${taskSummary || "No tasks listed yet."}

Generate a short, energizing daily briefing containing a greeting, the top 3 recommended priority focus items, concise focus advice, and total estimated focus hours required.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an executive productivity advisor. Deliver sharp, motivating, hyper-practical daily briefings.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            greeting: { type: Type.STRING },
            topPriorities: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            focusAdvice: { type: Type.STRING },
            estimatedHours: { type: Type.NUMBER },
          },
          required: ["greeting", "topPriorities", "focusAdvice", "estimatedHours"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (err: any) {
    console.error("Error in /api/ai/daily-briefing:", err);
    res.status(500).json({ error: err.message || "Failed to generate briefing" });
  }
});

// AI Endpoint: Smart Time Blocking Schedule
app.post("/api/ai/smart-schedule", async (req, res) => {
  try {
    const { tasks, startHour = 9, endHour = 17 } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Fallback schedule
      const timeSlots = ["09:00 - 10:30", "10:45 - 12:00", "13:00 - 14:30", "14:45 - 16:00"];
      const pending = (tasks || []).filter((t: any) => t.status !== "done");
      const schedule = pending.slice(0, 4).map((t: any, idx: number) => ({
        taskId: t.id,
        taskTitle: t.title,
        timeSlot: timeSlots[idx] || "16:00 - 17:00",
        rationale: "High focus window mapped to task priority.",
      }));
      return res.json({ schedule });
    }

    const taskSummary = (tasks || []).filter((t: any) => t.status !== "done").map((t: any) => `ID: ${t.id}, Title: ${t.title}, Priority: ${t.priority}, Est: ${t.estimatedMinutes || 30}m`).join("\n");

    const prompt = `Create an optimized schedule between ${startHour}:00 and ${endHour}:00 for these tasks:
${taskSummary}

Group tasks into time slots. Put high-priority/deep-work tasks early in the morning. Include short breaks between slots.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert time-blocking strategist. Create balanced, high-output daily schedules with breaks.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            schedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  taskId: { type: Type.STRING },
                  taskTitle: { type: Type.STRING },
                  timeSlot: { type: Type.STRING },
                  rationale: { type: Type.STRING },
                },
                required: ["taskTitle", "timeSlot", "rationale"],
              },
            },
          },
          required: ["schedule"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (err: any) {
    console.error("Error in /api/ai/smart-schedule:", err);
    res.status(500).json({ error: err.message || "Failed to generate schedule" });
  }
});

// AI Endpoint: Productivity Coach Chat
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { messages, taskContext } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        reply: "I am your Productivity Assistant! (Note: Gemini API key is not active, but you can manage tasks, timeblocks, and focus sessions directly in the app). How can I help you organize your day?",
      });
    }

    const formattedHistory = (messages || []).map((m: any) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n");

    const prompt = `Current User Task Context:
${taskContext || "No context provided."}

Conversation History:
${formattedHistory}

Respond as an encouraging, actionable, and succinct AI Productivity Coach. Help the user optimize their workflow, stay focused, or resolve bottlenecks.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are FocusFlow AI, an elite productivity strategist and coach. Keep answers actionable, clear, bulleted when appropriate, and under 200 words.",
      },
    });

    res.json({ reply: response.text });
  } catch (err: any) {
    console.error("Error in /api/ai/chat:", err);
    res.status(500).json({ error: err.message || "Failed to respond in chat" });
  }
});

// Serve frontend in development & production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
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
    console.log(`Productivity SaaS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
