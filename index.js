import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

// Проверка что сервер жив
app.get("/", (req, res) => {
  res.send("Server is working");
});

app.post("/ask", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.json({ reply: "No message provided" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful Roblox NPC assistant." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();

    console.log("Status:", response.status);
    console.log("OpenAI Response:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      return res.json({
        reply: "OpenAI Error: " + (data.error?.message || "Unknown error")
      });
    }

    const aiReply = data.choices?.[0]?.message?.content;

    if (!aiReply) {
      return res.json({ reply: "No response from model" });
    }

    res.json({ reply: aiReply });

  } catch (err) {
    console.error("Server error:", err);
    res.json({ reply: "Server error: " + err.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
