// pages/api/chat.js
// Ya no necesitamos marked
// import { marked } from "marked"; 

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Método no permitido" }); 
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ reply: "No se recibió ningún mensaje." });
  }

  const weddingInfo = {
    date: "31 de octubre de 2026",
    time: "de 12:00 a 21:00 aproximadamente",
    location: "Masia Mas Llombart, Sant Fost de Campsentelles, Barcelona",
    detailUbisUrl: "https://www.bodas.net/web/manel-y-carla/ubicacion-8",
    banquet: "en el mismo recinto, justo después del aperitivo",
    dressCode: "Formal",
    transport: "Habrá parking gratuito y servicio de taxi disponible",
    accommodation: "Hoteles cercanos: Celler Suites y Villas Coliving",
    schedule: `
      - Ceremonia: de 12:30 a 13:30
      - Aperitivo: de 13:30 a 15:30
      - Banquete: de 15:30 a 19:00
      - Fiesta y barra libre: de 19:00 a 21:00
    `,
  };

  const systemPrompt = `
Eres un asistente virtual amable y servicial para la boda de Manel y Carla.
Responde en español si te escriben en español y si te escriben en catalán, responde en catalán, de forma clara, cálida y concisa.

📅 La boda será el ${weddingInfo.date}, de ${weddingInfo.time}, en ${weddingInfo.location}.
Más información sobre el lugar: [Ubicación](${weddingInfo.detailUbisUrl}).

🕒 Horario aproximado del evento:
${weddingInfo.schedule}

🍽️ El banquete será ${weddingInfo.banquet}.
👗 Código de vestimenta: ${weddingInfo.dressCode}.
🚗 Transporte: ${weddingInfo.transport}.
🏨 Alojamiento: ${weddingInfo.accommodation}.

Si alguien pregunta por regalos (por ejemplo: "¿hay lista de boda?", "¿qué puedo regalar?", "¿cómo hacemos con los regalos?"), responde de manera amable y discreta que no es necesario, pero si desean más información pueden visitar: [Regalos de boda](https://www.bodas.net/web/manel-y-carla/regalos-8).

IMPORTANTE:
- Usa SIEMPRE el formato Markdown correcto para enlaces: [Texto](URL)
- NO uses etiquetas HTML (<a>, target, rel, etc.)
- No devuelvas ningún otro formato que no sea texto o Markdown.
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    let aiReplyRaw =
      data?.choices?.[0]?.message?.content || "No tengo una respuesta en este momento.";

    // 🟢 PASO DE LIMPIEZA CLAVE: Eliminar atributos HTML problemáticos
    // 1. Eliminamos el patrón de atributos target/rel que está causando el error.
    let aiReplyCleaned = aiReplyRaw.replace(/target="_blank"\s*rel="noopener noreferrer"/gi, "");
    
    // 2. Eliminamos cualquier comilla o ">" extra que haya quedado justo después de la URL, 
    // lo que genera el código corrupto.
    // Esto limpia patrones como '...url-8">' o '...url-8' target...'
    aiReplyCleaned = aiReplyCleaned.replace(/"\s*>/g, ""); 
    
    // 3. Eliminamos cualquier etiqueta <a> de apertura o cierre que el modelo pueda haber generado.
    aiReplyCleaned = aiReplyCleaned.replace(/<\/?a\b[^>]*>/gi, "");


    // Devolvemos el texto limpio en formato Markdown puro
    res.status(200).json({ reply: aiReplyCleaned }); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Error interno del servidor. Intenta más tarde." });
  }
}

