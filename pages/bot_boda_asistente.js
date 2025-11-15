import { useState, useRef, useEffect } from "react";
import Head from "next/head";

export default function BotBodaAsistente() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [textAreaHeight, setTextAreaHeight] = useState("40px");
  const [isTyping, setIsTyping] = useState(false);
  const chatBoxRef = useRef(null);
  const textAreaRef = useRef(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    
    // ... (El resto de la lógica de sendMessage es la misma)

    // 1. Añadimos el mensaje del usuario y el placeholder del bot (VACÍO)
    setMessages((prev) => [...prev, userMessage, { role: "assistant", content: "" }]);
    
    setInput("");
    setTextAreaHeight("40px");
    
    // 2. INICIAMOS EL INDICADOR (Necesario para el useEffect del scroll)
    setIsTyping(true);

    const history = messages.map(msg => ({ role: msg.role, content: msg.content }));

    // Llamada a la API
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input, history: history }),
    });

    const data = await res.json();
    const fullReplyHTML = data.reply;
    
    // 3. Simulación de escritura carácter a carácter
    const replyForTyping = fullReplyHTML.replace(/<br\s*\/?>/gi, '\n'); // Reemplazamos <br> por saltos de línea
    
    let currentText = "";
    
    for (let i = 0; i < replyForTyping.length; i++) {
        const char = replyForTyping[i];
        
        // Lógica para saltar tags HTML (como <a> o </div>) y que no se vean escritos.
        if (char === '<' && replyForTyping.substring(i, i + 10).match(/<\/?[a-z][^>]*>/i)) {
             // Si encontramos un tag HTML, avanzamos el índice hasta después del tag y añadimos todo el tag.
             const endIndex = replyForTyping.indexOf('>', i) + 1;
             currentText += replyForTyping.substring(i, endIndex);
             i = endIndex - 1; 
        } else {
             // Si es un carácter normal, lo escribimos con un delay.
             await new Promise((resolve) => setTimeout(resolve, 30)); // 30ms por carácter
             currentText += char;
        }

        // Actualizamos el último mensaje (el placeholder) con el texto animado
        setMessages((prev) => {
            const updated = [...prev];
            updated[prev.length - 1] = { role: "assistant", content: currentText }; 
            return updated;
        });
    }

    // 4. DETENEMOS EL INDICADOR
    setIsTyping(false); 

    // 5. REEMPLAZAMOS EL TEXTO TEMPORAL CON EL HTML COMPLETO FINAL
    setMessages((prev) => {
        const updated = [...prev];
        updated[prev.length - 1] = { role: "assistant", content: fullReplyHTML }; 
        return updated;
    });
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    const el = textAreaRef.current;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 100) + "px";
    setTextAreaHeight(el.style.height);
  };

  return (
    <>
      <Head>
        <title>Asistente de Boda</title>
      </Head>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h1>Asistente de Boda 💍</h1>

        {/* --- INICIO: Mensaje de Bienvenida Agregado --- */}
        <div style={{ 
            maxWidth: "400px",
            margin: "20px auto 0",
            padding: "15px",
            textAlign: "left",
            backgroundColor: "#fff0f0", // Fondo más cálido para la bienvenida
            borderRadius: "10px",
            border: "1px solid #ffcccb",
            boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
        }}>
            <h3 style={{ margin: "0 0 5px 0", color: "#cc0000" }}>¡Hola! 👋</h3>
            <p style={{ margin: "0 0 10px 0", fontSize: "1.1em", fontWeight: "bold" }}>
                Soy tu asistente para la boda de **Manel y Carla**.
            </p>
            <p style={{ margin: 0, fontSize: "0.95em" }}>
                Puedes hacerme **preguntas** como:
                <ul style={{ paddingLeft: "20px", marginTop: "5px", marginBottom: "0" }}>
                    <li>¿Estoy en la lista de invitados?</li>
                    <li>¿Qué comida se va a servir?</li>
                    <li>¿Cuál es el plan del día?</li>
                </ul>
            </p>
        </div>
        {/* --- FIN: Mensaje de Bienvenida Agregado --- */}

        <div
          ref={chatBoxRef}
          style={{
            maxWidth: "400px",
            // Altura ligeramente reducida
            height: messages.length === 0 ? "240px" : "280px", // Ajusta la altura si no hay mensajes
            overflowY: "auto",
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "10px",
            backgroundColor: "#fff",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            margin: "10px auto 20px", // Espacio reducido arriba para acercarlo al mensaje de bienvenida
          }}
        >
          {/* Si no hay mensajes, se podría mostrar un mensaje dentro de la caja de chat */}
          {messages.length === 0 ? (
             <div style={{ textAlign: 'center', color: '#666', marginTop: '50px' }}>
                ¡Escribe tu primera pregunta abajo!
             </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  textAlign: msg.role === "user" ? "right" : "left",
                  margin: "10px 0",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    backgroundColor: msg.role === "user" ? "#d1e7dd" : "#cce5ff",
                    maxWidth: "80%",
                    wordWrap: "break-word",
                  }}
                  dangerouslySetInnerHTML={{ __html: msg.content }} 
                />
              </div>
            ))
          )}
          
          {/* El indicador "Escribiendo..." se reemplaza por el efecto visual de tipeo */}
          {isTyping && <p style={{ textAlign: 'left' }}>...</p>} 
        </div>

        <div style={{ maxWidth: "400px", margin: "10px auto", display: "flex", flexDirection: "column" }}>
          <textarea
            ref={textAreaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Escribe tu mensaje..."
            style={{
              // ... (Estilos de textarea)
              resize: "none",
              height: textAreaHeight,
              maxHeight: "100px",
              padding: "10px 12px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              outline: "none",
              fontSize: "16px", 
              lineHeight: "1.4",
              transition: "all 0.2s ease",
              background: "#fff",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1) inset",
              marginBottom: "10px",
            }}
          />
          <button
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.96)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onClick={sendMessage}
            style={{
              // ... (Estilos de botón)
              padding: "12px 20px",
              borderRadius: "12px",
              border: "1px solid #007bff",
              backgroundColor: "#007bff",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
              transition: "transform 0.2s ease, background-color 0.3s ease",
            }}
          >
            Enviar
          </button>
        </div>
      </div>
    </>
  );
}
