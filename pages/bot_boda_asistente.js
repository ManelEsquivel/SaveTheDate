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

  // 🔴 IMPORTANTE: Eliminamos la función formatMessage para evitar conflictos con el backend
  // const formatMessage = (text) => { /* ... */ };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    
    // 1. Añadimos el mensaje del usuario y el placeholder del bot
    setMessages((prev) => [...prev, userMessage, { role: "assistant", content: "" }]);
    
    setInput("");
    setTextAreaHeight("40px");
    
    // 2. INICIAMOS EL INDICADOR
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
    
    // 3. Obtenemos solo el texto sin HTML para la animación
    // Usamos una regex para limpiar tags, dejando solo el texto visible.
    const fullReplyText = fullReplyHTML.replace(/<[^>]+>/g, '');
    
    let currentText = "";

    // 4. Bucle de Simulación de escritura carácter a carácter
    for (let i = 0; i < fullReplyText.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 30)); // 30ms por carácter
        currentText += fullReplyText[i];
        
        // 🟢 SOLUCIÓN AL ERROR: Usamos prev.length - 1
        // Esto garantiza que siempre actualizamos el último mensaje añadido (el placeholder).
        setMessages((prev) => {
            const updated = [...prev];
            updated[prev.length - 1] = { role: "assistant", content: currentText }; 
            return updated;
        });
    }

    // 5. DETENEMOS EL INDICADOR
    setIsTyping(false); 

    // 6. REEMPLAZAMOS EL TEXTO TEMPORAL CON EL HTML COMPLETO FINAL
    setMessages((prev) => {
        const updated = [...prev];
        // 🟢 SOLUCIÓN AL ERROR: Usamos prev.length - 1 por última vez.
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
        <div
          ref={chatBoxRef}
          style={{
            maxWidth: "400px",
            // Altura ligeramente reducida: 280px (ajuste anterior)
            height: "280px", 
            overflowY: "auto",
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "10px",
            backgroundColor: "#fff",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            margin: "20px auto",
          }}
        >
          {messages.map((msg, i) => (
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
                // 🟢 Uso directo del HTML del backend (ajuste anterior)
                dangerouslySetInnerHTML={{ __html: msg.content }} 
              />
            </div>
          ))}
          {/* Ocultamos "Escribiendo..." ya que el efecto de tipeo es visual */}
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
              resize: "none",
              height: textAreaHeight,
              maxHeight: "100px",
              padding: "10px 12px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              outline: "none",
              // Font-size 16px para evitar el zoom en móviles (ajuste anterior)
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
