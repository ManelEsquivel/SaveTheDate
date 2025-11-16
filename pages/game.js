import React, { useState } from 'react';
import Head from 'next/head';

// *******************************************************************
// ⚠️ 1. TUS IDENTIFICADORES REALES ⚠️
// *******************************************************************
// La URL base para enviar respuestas (debe terminar en /formResponse)
const BASE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfd6X0a5VGjQW_y7e3IYqTh64HLrh1yA6CWJEGJZu4HxENr3Q/formResponse";

// IDs de las preguntas de tu formulario
const ENTRY_NAME = "entry.1745994476"; 
const ENTRY_Q1 = "entry.1000057";      
const ENTRY_Q2 = "entry.1509074265";   
const ENTRY_Q3 = "entry.551001831";    
const ENTRY_Q4 = "entry.1989972928";   
const ENTRY_Q5 = "entry.694289165";    
// *******************************************************************


const QuizBodaPage = () => {
  // Inicializamos el estado para 1 campo de nombre y 5 preguntas
  const [answers, setAnswers] = useState({
    guestName: '', 
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnswers(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Verificación simple: ¿Hay alguna respuesta vacía?
    const allAnswered = Object.values(answers).every(val => val.trim() !== '');
    
    if (allAnswered) {
      
      // 🎯 CLAVE: Construimos la URL de envío con todos los campos
      const submissionUrl = `${BASE_FORM_URL}`
        + `?${ENTRY_NAME}=${encodeURIComponent(answers.guestName)}` 
        + `&${ENTRY_Q1}=${encodeURIComponent(answers.q1)}`
        + `&${ENTRY_Q2}=${encodeURIComponent(answers.q2)}`
        + `&${ENTRY_Q3}=${encodeURIComponent(answers.q3)}`
        + `&${ENTRY_Q4}=${encodeURIComponent(answers.q4)}`
        + `&${ENTRY_Q5}=${encodeURIComponent(answers.q5)}`;


      // Abre una nueva pestaña/ventana con la URL de envío para registrar la respuesta
      window.open(submissionUrl, '_blank');
      
      setSubmitted(true);
    } else {
      alert("¡Por favor, completa tu nombre y todas las preguntas para enviar el QUIZ!");
    }
  };
  
  // --- Preguntas del Quiz (Ajusta estas etiquetas a tus preguntas reales) ---
  const questions = [
    { id: 'q1', entry: ENTRY_Q1, label: '1. Pregunta sobre Carla (Carla):', type: 'text' },
    { id: 'q2', entry: ENTRY_Q2, label: '2. Mascotas de los novios (Mochi y Abby):', type: 'text' },
    { id: 'q3', entry: ENTRY_Q3, label: '3. Destino soñado de Manel (Girona/Cadaques):', type: 'text' },
    { id: 'q4', entry: ENTRY_Q4, label: '4. Destino soñado de Carla (Cadaques):', type: 'text' },
    { id: 'q5', entry: ENTRY_Q5, label: '5. Número de invitados que faltan (7):', type: 'number' },
  ];

  return (
    <>
      <Head>
        <title>El Gran Quiz de Manel y Carla 💍</title>
        <meta name="description" content="Pon a prueba cuánto sabes de nuestra historia" />
      </Head>

      <div className="container">
        <div className="card">
          <h1>💖 ¡El Gran QUIZ de Manel y Carla!</h1>
          <p>Pon a prueba cuánto sabes de nuestra historia. Si aciertas, entrarás en el sorteo de un detalle especial. ¡Mucha suerte!</p>
          
          {!submitted ? (
            <form onSubmit={handleSubmit} className="quiz-form">
              
              {/* CAMPO DE NOMBRE Y APELLIDO (entry.1745994476) */}
              <div className="question-group">
                <label htmlFor="guestName">Tu Nombre y Apellido (necesario para el sorteo)</label>
                <input
                  type="text"
                  id="guestName"
                  name="guestName"
                  value={answers.guestName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* RESTO DE PREGUNTAS */}
              {questions.map((q) => (
                <div key={q.id} className="question-group">
                  <label htmlFor={q.id}>{q.label}</label>
                  <input
                    type={q.type}
                    id={q.id}
                    name={q.id}
                    value={answers[q.id]}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}
              
              <button type="submit" className="button">
                ENVIAR RESPUESTAS AL SORTEO
              </button>
            </form>
          ) : (
            <div className="success-message">
              <h2>¡Respuestas Enviadas! 🎉</h2>
              <p>Tu participación ha sido registrada con éxito en el formulario de los novios. ¡Gracias por jugar!</p>
            </div>
          )}

        </div>
      </div>

      {/* --- ESTILOS --- */}
      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #2b2e4a, #4e5a7d); 
          font-family: 'Press Start 2P', 'Segoe UI', Tahoma, sans-serif;
          padding: 20px;
        }

        .card {
          background: #3a3f5b; 
          color: #fff;
          padding: 2rem;
          border-radius: 12px;
          border: 4px solid #f9c74f; 
          box-shadow: 0 0 20px rgba(249, 199, 79, 0.7); 
          text-align: center;
          max-width: 600px;
          width: 100%;
          animation: glow 1.5s infinite alternate;
        }

        @keyframes glow {
          from { box-shadow: 0 0 10px #f9c74f; }
          to { box-shadow: 0 0 20px #f9c74f, 0 0 30px #f9c74f; }
        }

        h1 {
          color: #f9c74f; 
          margin-bottom: 1rem;
          font-size: 1.8rem;
          text-shadow: 0 0 5px #f9c74f;
        }

        p {
          color: #e0e0e0;
          font-size: 0.9rem;
          margin-bottom: 2rem;
        }
        
        .quiz-form {
            display: flex;
            flex-direction: column;
            gap: 15px;
            text-align: left;
        }
        
        .question-group {
            margin-bottom: 10px;
        }
        
        label {
            display: block;
            color: #4df0ff; 
            font-size: 0.8rem;
            margin-bottom: 5px;
            font-weight: bold;
        }

        input {
            width: 100%;
            padding: 10px;
            background: #1e2133; 
            border: 2px solid #00c4ff; 
            color: #fff;
            border-radius: 4px;
            font-size: 1rem;
            box-sizing: border-box;
        }

        .button {
          display: inline-block;
          padding: 1rem 1.5rem;
          margin-top: 15px;
          background-color: #f9c74f; 
          color: #2b2e4a;
          border: none;
          border-radius: 8px;
          text-decoration: none;
          font-weight: bold;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.1s ease;
          box-shadow: 0 4px 0 #e4b646; 
        }

        .button:hover {
          background-color: #e4b646;
          transform: translateY(-2px);
          box-shadow: 0 6px 0 #cc9b3d;
        }
        
        .success-message h2 {
            color: #70e000; 
            text-shadow: 0 0 5px #70e000;
        }
      `}</style>
    </>
  );
};

export default QuizBodaPage;
