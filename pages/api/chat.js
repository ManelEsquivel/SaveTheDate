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

  // --- DATA CLAVE PARA APERITIVO ---
  const aperitivoPrincipales = `Roll de salmón ahumado, con crema de anchoas y brotes de albahaca crujiente; Crostini de escalivada asada con ventresca de atún; Mini tacos de vegetales a la parrilla; Trufa de foie con crocante de almendra tostada; Cazuela gourmet de pasta con relleno de ragú boloñesa con queso fundido y albahaca; Rol de requesón y nueces envuelto en calabacín asado; Mini ensalada de algas con perlas de yuzu y semillas de amapola; Chupito de mazamorra cordobesa con tropicales y mousse de ventresca; Croquetas de pulpo gallego; Simulacro de calamar con patata paja; Patatas bravas con alioli y su toque de valentina; Trilogía de hamburguesas de pollo, ternera y quinoa; Tiras de calamar crujiente en tempura; Bocado de jamón de guijuelo en croqueta cremosa, y Vasito de romesco.`;
  const aperitivoAdicionales = "Además, habrá jamón al corte, Showcooking de carnes a la brasa, zamburiñas, almejas y navajas.";
  
  // RESPUESTA COMPLETA Y PRE-FORMATEADA para la pregunta general del aperitivo
  const aperitivoResponseCompleta = `¡Claro! Para el aperitivo, habrá una gran variedad de platos deliciosos que incluye: ${aperitivoPrincipales} ${aperitivoAdicionales} ¡Una variedad exquisita para disfrutar durante el aperitivo! 🍽️🥂`;

  // RESPUESTA PARA VEGETARIANOS/INTOLERANCIAS
  const aperitivoVegetarianoResponse = `
  ¡Por supuesto! Para los invitados vegetarianos, los platos principales disponibles en el aperitivo (excluyendo carne, pescado y marisco) son:
  
  * **Mini tacos de vegetales a la parrilla**
  * **Rol de requesón y nueces envuelto en calabacín asado**
  * **Mini ensalada de algas con perlas de yuzu y semillas de amapola**
  * **Patatas bravas con alioli y su toque de valentina**
  * **Vasito de romesco**
  
  Si tienes alguna intolerancia alimentaria o alergia específica (gluten, lactosa, etc.), por favor, ponte en contacto con Manel o Carla directamente antes del día de la boda para que puedan asegurar un menú adaptado y seguro para ti. ¡Gracias!
  `;
  // --- FIN DATA APERITIVO ---

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
    fiestaActividades: "Para la fiesta (después del banquete) tendremos un **Videomatón 360º** y un **Fotomatón** para que todos se lleven un gran recuerdo.",
    
    // 🟢 NUEVAS VARIABLES
    padresManel: "Manuel y Maria Dolors",
    padresCarla: "Jordi y Eva",
    regaloCuentaUrl: "https://www.bodas.net/web/manel-y-carla/regalosdeboda-11", // URL específica para el número de cuenta
    regaloGeneralUrl: "https://www.bodas.net/web/manel-y-carla/regalos-8", // URL general
  };

  const systemPrompt = `
Eres un asistente virtual amable y servicial para la boda de Manel y Carla.
Responde en español si te escriben en español y si te escriben en catalán, responde en catalán, de forma clara, cálida y concisa.

---

## 👨‍👩‍👧‍👦 Familias
- Si preguntan por los padres de Manel, son **${weddingInfo.padresManel}**.
- Si preguntan por los padres de Carla, son **${weddingInfo.padresCarla}**.

## 🍽️ Aperitivo y Opciones Especiales
- El banquete será **${weddingInfo.banquet}**.

- **INSTRUCCIÓN CLAVE (APERTIVO COMPLETO):** Si preguntan por el **Aperitivo** (la lista de platos, el menú del aperitivo, etc.), DEBES responder ÚNICAMENTE con el siguiente texto, SIN AÑADIR NI OMITIR NINGUNA PALABRA:
${aperitivoResponseCompleta}

- **INSTRUCCIÓN CLAVE (VEGETARIANOS/INTOLERANCIAS):** Si preguntan por opciones **vegetarianas**, **alergias** o **intolerancias**, DEBES responder ÚNICAMENTE con el siguiente texto, SIN AÑADIR NI OMITIR NINGUNA PALABRA:
${aperitivoVegetarianoResponse}

## 📅 Detalles Generales
- La boda será el **${weddingInfo.date}**, de **${weddingInfo.time}**, en **${weddingInfo.location}**.
- Más información sobre el lugar: [Ubicación](${weddingInfo.detailUbisUrl}).

## 🕒 Horario
${weddingInfo.schedule}

## 🥳 Fiesta
- Si preguntan por la fiesta o actividades después del banquete:
**${weddingInfo.fiestaActividades}**

## 👗 Otros Datos
- Código de vestimenta: ${weddingInfo.dressCode}.
- Transporte: ${weddingInfo.transport}.
- Alojamiento: ${weddingInfo.accommodation}.

---

## 🎁 Regalos
- Si alguien pregunta por el **número de cuenta** o la **transferencia** para el regalo:
Responde de manera amable que pueden ver toda la información en este enlace: [Número de Cuenta](https://www.bodas.net/web/manel-y-carla/regalosdeboda-11).

- Si alguien pregunta por **regalos** en general, o por la lista de boda:
Responde de manera amable y discreta que no es necesario, pero si desean más información pueden visitar: [Regalos de boda](https://www.bodas.net/web/manel-y-carla/regalos-8).


---

## ⚠️ Formato
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
      
    // CONFIGURACIÓN CLAVE: Asegurar que los enlaces se abran en nueva pestaña
    marked.use({
      renderer: {
        link(href, title, text) {
          // Devolvemos el enlace con target="_blank" para abrir en una nueva pestaña.
          return `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
        }
      }
    });

    // Convertir Markdown a HTML limpio y saneado para el frontend
    const aiReplyHTML = marked.parse(aiReplyRaw);

    // Devolvemos el HTML completo.
    res.status(200).json({ reply: aiReplyHTML });
  } catch (error) {
    console.error(error); 
    res.status(500).json({ reply: "Error interno del servidor. Intenta más tarde." });
  }
}
