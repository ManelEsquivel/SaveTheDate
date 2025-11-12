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
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setTextAreaHeight("40px");
    setIsTyping(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input, history: messages }),
    });

    const data = await res.json();
    const fullReply = data.reply;
    setIsTyping(false);

    // Efecto de escritura letra por letra
    let currentText = "";
    const botMessage = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, botMessage]);

    for (let i = 0; i < fullReply.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 25)); // velocidad escritura
      currentText += fullReply[i];
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: currentText };
        return updated;
      });
    }
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
        <meta
          name="description"
          content="Asistente virtual para la boda de Manel y Carla"
        />
      </Head>

      <main
        style={{
          fontFamily: "'Segoe UI', Arial, sans-serif",
          background: "linear-gradient(180deg, #fafafa 0%, #e6f0ff 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "20px",
        }}
      >
        <h1 style={{ color: "#333", marginBottom: "15px" }}>Asistente de Boda 💍</h1>

        <div
          ref={chatBoxRef}
          id="chat-box"
          style={{
            width: "100%",
            maxWidth: "420px",
            height: "450px",
            background: "#fff",
            borderRadius: "16px",
            padding: "15px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 6px 12px rgba(0,0,0,0.08)",
            scrollBehavior: "smooth",
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                padding: "10px 14px",
                margin: "6px 0",
                borderRadius: "18px",
                maxWidth: "80%",
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                background:
                  msg.role === "user"
                    ? "linear-gradient(135deg, #d1e7dd, #bcd9c9)"
                    : "linear-gradient(135deg, #d6eaff, #b3d4ff)",
                color: msg.role === "user" ? "#0f5132" : "#0b3d91",
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                wordWrap: "break-word",
                fontSize: "14px",
                lineHeight: "1.5",
                transition: "transform 0.2s ease-in-out",
              }}
            >
              {msg.content}
            </div>
          ))}

          {isTyping && (
            <div
              style={{
                padding: "10px 14px",
                margin: "6px 0",
                borderRadius: "18px",
                maxWidth: "60%",
                alignSelf: "flex-start",
                background: "linear-gradient(135deg, #d6eaff, #b3d4ff)",
                color: "#0b3d91",
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span>Escribiendo</span>
              <span className="typing-dots" style={{ display: "inline-flex" }}>
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#0b3d91",
                    margin: "0 1px",
                    animation: "blink 1s infinite 0s",
                  }}
                ></span>
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#0b3d91",
                    margin: "0 1px",
                    animation: "blink 1s infinite 0.2s",
                  }}
                ></span>
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#0b3d91",
                    margin: "0 1px",
                    animation: "blink 1s infinite 0.4s",
                  }}
                ></span>
              </span>
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes blink {
            0%,
            80%,
            100% {
              opacity: 0.2;
            }
            40% {
              opacity: 1;
            }
          }
        `}</style>

        <div
          id="controls"
          style={{
            display: "flex",
            alignItems: "flex-end",
            marginTop: "12px",
            width: "100%",
            maxWidth: "420px",
            gap: "10px",
          }}
        >
          <textarea
            ref={textAreaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) =>
              e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())
            }
            placeholder="Escribe tu mensaje..."
            style={{
              flex: 1,
              resize: "none",
              height: textAreaHeight,
              maxHeight: "100px",
              padding: "10px 12px",
              borderRadius: "10px",
              border: "none", // 🔹 sin borde
              outline: "none", // 🔹 sin contorno al hacer clic
              fontSize: "14px",
              lineHeight: "1.4",
              transition: "all 0.2s ease",
              background: "#fff",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1) inset",
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              padding: "10px 15px",
              border: "none",
              background: "linear-gradient(135deg, #3b82f6, #2563eb)",
              color: "#fff",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              boxShadow: "0 3px 8px rgba(59,130,246,0.3)",
              transition: "transform 0.15s ease",
            }}
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "scale(0.96)")
            }
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Enviar
          </button>
        </div>
      </main>
    </>
  );
}


