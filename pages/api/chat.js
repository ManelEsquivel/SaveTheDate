// pages/api/chat.js
import { marked } from "marked";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Método no permitido" });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ reply: "No se recibió ningún mensaje." });
  }

  // --- LISTA DE INVITADOS (NOMBRE, APELLIDO, CONFIRMADO) ---
  const guestList = `
NOMBRE,APELLIDOS,CONFIRMADO
Manel,Esquivel,CONFIRMADO
Carla,Bartual,CONFIRMADO
Beatriz Esquivel,Esquivel,PENDIENTE
Manuel Esquivel,Esquivel,PENDIENTE
Eva Lopez,Lopez,PENDIENTE
Marc Genes,Genes,PENDIENTE
Maria Dolors,Dolors,PENDIENTE
Jordi Bartual,,PENDIENTE
Anna Bernal,Bernal,PENDIENTE
Alex Espada,Espada,PENDIENTE
Victor Lopez,Lopez,PENDIENTE
Carlos Barceló,Barceló,PENDIENTE
Sonia Cadevall,Cadevall,PENDIENTE
Antonio Escartín,Escartin,PENDIENTE
Sandra Gano,Gano,PENDIENTE
Ivan Alamo,Alamo,PENDIENTE
Alba Martinez,,PENDIENTE
Alex Ferré,Ferré,PENDIENTE
Alexia Galobardes,Galobardes,PENDIENTE
Marta Oliver,Oliver,PENDIENTE
Helena Briones,Briones,PENDIENTE
Joan,,PENDIENTE
Josua Bayona,Bayona,PENDIENTE
Amandine Liam,Liam,PENDIENTE
Sara ytarte,ytarte,PENDIENTE
Eva Areny,Areny,PENDIENTE
Jesus,,PENDIENTE
Carla Sardà,Sardà,PENDIENTE
Cristian Fernández,Fernández,PENDIENTE
Clara Torres,Torres,PENDIENTE
Pablo,,PENDIENTE
Anna Gonzalez,Gonzalez,PENDIENTE
Carlos Oros,,PENDIENTE
Mujer Oros,,PENDIENTE
Carlos Rodriguez,Rodriguez,PENDIENTE
Dunia Mascaro,Mascaro,PENDIENTE
Gonzalo,,PENDIENTE
Marta Bartual,Bartual,PENDIENTE
Iker Zarate,Zarate,PENDIENTE
Alfonso Zarate,Zarate,PENDIENTE
Jaime Lopez,Lopez,PENDIENTE
Rosario,,PENDIENTE
Natalia Balcells,Balcells,PENDIENTE
Pau,,PENDIENTE
Susana,Lopez,PENDIENTE
Ramon,,PENDIENTE
Natalia Belinguer,Belinguer,PENDIENTE
Natalia Pellicer,Pellicer,PENDIENTE
Silvia,,PENDIENTE
Gemma Urpina,Urpina,PENDIENTE
Alexis Postigo,Postigo,PENDIENTE
Mª Angeles,,PENDIENTE
Carles Castañe,Castañe,PENDIENTE
Teodoro Lopez,Lopez,PENDIENTE
Meritxell,,PENDIENTE
Montse,,PENDIENTE
Marido Montse,,PENDIENTE
Elena Escura,Escura,Escura
Jaime Monzon,Monzon,PENDIENTE
Carmen Izquierdo,Izquierdo,PENDIENTE
Laura Cester,Cester,PENDIENTE
Monica Falguera,Falguera,PENDIENTE
Noa,,PENDIENTE
Mujer Carlos Rodrigu,,PENDIENTE
Narcis Vidal,Vidal,PENDIENTE
Montse Asociación,,PENDIENTE
Marido Montse,Asociación,PENDIENTE
Didac,,PENDIENTE
Mujer,Didac,PENDIENTE
`;

  // --- CÁLCULO DE CONFIRMADOS ---
  const confirmedGuestsCount = 2; // Manel y Carla

  // --- VERIFICACIÓN REAL DE NOMBRES ANTES DE LLAMAR A OPENAI ---
  const normalizedMessage = message.toLowerCase();
  const messageWords = normalizedMessage
    .replace(/[.,;:!?¡¿'"()]/g, "")
    .split(/\s+/)
    .filter(Boolean);

  // Convertimos la lista en un array de nombres y apellidos
  const guestEntries = guestList
    .trim()
    .split("\n")
    .slice(1)
    .map(line => {
      const [nombre, apellido] = line.split(",").map(x => (x || "").trim().toLowerCase());
      return { nombre, apellido, completo: (nombre + " " + apellido).trim() };
    });

  // Detectar si el usuario se está identificando (“soy”, “me llamo”, etc.)
  const isIdentifying = /\b(soy|me llamo|mi nombre es|yo soy)\b/i.test(message);

  if (isIdentifying) {
    // Buscar coincidencias exactas por palabra (nombre o apellido)
    const matches = guestEntries.filter(g =>
      messageWords.includes(g.nombre) ||
      messageWords.includes(g.apellido)
    );

    // Caso 1: no hay ninguna coincidencia
    if (matches.length === 0) {
      return res.status(200).json({
        reply:
          "Lo siento mucho, pero no encuentro tu nombre en la lista de invitados. Si crees que puede ser un error, por favor, contacta directamente con Manel o Carla."
      });
    }

    // Caso 2: hay más de una coincidencia (por ejemplo, “Alex”)
    if (matches.length > 1) {
      return res.status(200).json({
        reply:
          "Hay más de una persona con ese nombre en la lista. ¿Podrías indicarme tus apellidos, por favor?"
      });
    }

    // Caso 3: coincidencia única → dejar que la IA gestione la respuesta normal
  }
  // --- FIN DE VERIFICACIÓN ---

  // --- INFO GENERAL BODA ---
  const weddingInfo = {
    date: "31 de octubre de 2026",
    time: "de 12:00 a 21:00 aproximadamente",
    location: "Masia Mas Llombart, Sant Fost de Campsentelles, Barcelona",
    detailUbisUrl: "https://www.bodas.net/web/manel-y-carla/ubicacion-8",
    banquet: "en el mismo recinto, justo después del aperitivo",
    dressCode: "Formal",
    transport: "Habrá parking gratuito y servicio de taxi disponible",
    accommodation: "Hoteles cercanos: Celler Suites y Villas Coliving",
    urlConfirmacion: "https://www.bodas.net/web/manel-y-carla/confirmatuasistencia-3"
  };

  // --- PROMPT PRINCIPAL COMPLETO ---
  const systemPrompt = `
Eres un asistente virtual amable y servicial para la boda de Manel y Carla.
Responde en español si te escriben en español y si te escriben en catalán, responde en catalán, de forma clara, cálida y concisa.

[... Mantén aquí todo el texto de tu prompt original ...]
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
      data?.choices?.[0]?.message?.content ||
      "No tengo una respuesta en este momento.";

    // Convertir Markdown a HTML con enlaces seguros
    marked.use({
      renderer: {
        link(href, title, text) {
          return `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
        },
      },
    });

    const aiReplyHTML = marked.parse(aiReplyRaw);
    res.status(200).json({ reply: aiReplyHTML });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      reply: "Error interno del servidor. Intenta más tarde.",
    });
  }
}


