import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("AI server working");
});

app.post("/ask", async (req, res) => {
  const userMessage = req.body.message;

  try {

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
  model: "llama-3.1-8b-instant",
  messages: [
    { role: "system", content: "You are a helpful Roblox NPC assistant." },
    { role: "user", content: userMessage }
  ],
        ],
        temperature: 0.7
      })
    });


    const data = await response.json();

    console.log(data); // чтобы видеть ошибки в Railway

    if (!data.choices) {
      return res.json({ reply: "AI error" });
    }

    res.json({
      reply: data.choices[0].message.content
    });

  } catch (err) {

    console.log(err);

    res.json({
      reply: "Server error"
    });

  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
