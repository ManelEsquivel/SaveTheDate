// pages/api/chat.js

export default async function handler(req, res) {
  // Solo permitir peticiones POST
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Método no permitido" });
  }

  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "No se recibió ningún mensaje." });
  }

  try {
    // Llamada a la API de OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // modelo rápido y económico
        messages: [
          { role: "system", content: "Eres un asistente de boda amable y servicial. Responde en español de forma clara y breve." },
          ...(history || []),
          { role: "user", content: message },
        ],
        temperature: 0.7,
      }),
    });

    // Comprobación de errores HTTP
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error HTTP de OpenAI:", errorText);
      return res.status(response.status).json({ reply: "Error al contactar con la IA." });
    }

    const data = await response.json();
    const aiReply = data?.choices?.[0]?.message?.content || "No tengo una respuesta en este momento.";

    res.status(200).json({ reply: aiReply });

  } catch (error) {
    console.error("Error interno del backend:", error);
    res.status(500).json({ reply: "Error interno del servidor. Intenta más tarde." });
  }
}
