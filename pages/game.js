import React, { useState, useEffect } from 'react';
import Head from 'next/head';

// *******************************************************************
// ⚠️ TUS IDENTIFICADORES REALES (BASADOS EN TU ÚLTIMO ENLACE) ⚠️
// *******************************************************************
const BASE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfd6X0a5VGjQW_y7e3IYqTh64HLrh1yA6CWJEGJZu4HxENr3Q/formResponse";

// IDs (5 Preguntas - SIN NOMBRE)
const ENTRY_Q1 = "entry.1000057";      
const ENTRY_Q2 = "entry.1509074265";   
const ENTRY_Q3 = "entry.551001831";    
const ENTRY_Q4 = "entry.1989972928";   
const ENTRY_Q5 = "entry.694289165";    

const QUIZ_COMPLETED_KEY = 'manel_carla_quiz_completed'; 

// --- ESTRUCTURA DE PREGUNTAS (5 Preguntas) ---
const ALL_QUESTIONS = [
    { id: 'q1', entry: ENTRY_Q1, label: '1. ¿De quién fue la idea de tener animales en casa?', options: ['Manel', 'Carla'] },
    { id: 'q2', entry: ENTRY_Q2, label: '2. ¿Cómo se llaman los michis de Manel y Carla?', options: ['Wasabi y Abby', 'Sky y Wasabi', 'Mia y Sombra', 'Mochi y Abby'] },
    { id: 'q3', entry: ENTRY_Q3, label: '3. ¿En qué Provincia/Ciudad se comprometieron?', options: ['Roma/Fontana di trevi', 'París/ Torre eiffel', 'Girona /Cadaques', 'Menorca /Cala turqueta'] },
    { id: 'q4', entry: ENTRY_Q4, label: '4. ¿Dónde fue el primer bautizo de buceo de Carla?', options: ['Tossa de Mar', 'Cadaques', 'Illes Medes', 'Palamos'] },
    { id: 'q5', entry: ENTRY_Q5, label: '5. Número de tatuajes Entre Carla y Manel', options: ['6', '7', '8', '10'] },
];

// Mapeo de IDs
const entryMap = {
    q1: ENTRY_Q1,
    q2: ENTRY_Q2,
    q3: ENTRY_Q3,
    q4: ENTRY_Q4,
    q5: ENTRY_Q5,
};

// *******************************************************************


const QuizBodaPage = () => {
    // currentStep: 0 (Bienvenida), 1-5 (Preguntas), 6 (Enviando), 7 (Finalizado)
    const [currentStep, setCurrentStep] = useState(0); 
    const [answers, setAnswers] = useState({
        q1: '', q2: '', q3: '', q4: '', q5: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false); 

    const optionLetters = ['A', 'B', 'C', 'D'];
    const currentQuestionIndex = currentStep - 1; // Ajustado (sin paso de nombre)
    const currentQuestion = ALL_QUESTIONS[currentQuestionIndex];

    useEffect(() => {
        if (typeof window !== 'undefined' && localStorage.getItem(QUIZ_COMPLETED_KEY) === 'true') {
            setIsCompleted(true);
            setCurrentStep(7); 
        }
    }, []);

    const handleAnswerSelect = (value, questionId) => {
        const newAnswers = { ...answers, [questionId]: value };
        setAnswers(newAnswers);

        // Si es la última pregunta (índice 4), vamos a la pantalla de envío
        if (currentQuestionIndex === 4) {
            handleSubmit(newAnswers); // Enviar inmediatamente
        } else {
            setCurrentStep(prev => prev + 1); // Siguiente pregunta
        }
    };

    // --- Lógica de Envío (Método GET / window.open) ---
    const handleSubmit = (finalAnswers) => { 
        setIsSubmitting(true);
        setCurrentStep(6); // Muestra la pantalla "Enviando"
        
        // 1. Construir la URL de Envío (GET Request)
        let submissionUrl = `${BASE_FORM_URL}?`;
        submissionUrl += `&${entryMap.q1}=${encodeURIComponent(finalAnswers.q1)}`;
        submissionUrl += `&${entryMap.q2}=${encodeURIComponent(finalAnswers.q2)}`;
        submissionUrl += `&${entryMap.q3}=${encodeURIComponent(finalAnswers.q3)}`;
        submissionUrl += `&${entryMap.q4}=${encodeURIComponent(finalAnswers.q4)}`;
        submissionUrl += `&${entryMap.q5}=${encodeURIComponent(finalAnswers.q5)}`;
        submissionUrl += `&submit=Submit`; // Parámetro final de envío

        // Limpiar el primer '&'
        submissionUrl = submissionUrl.replace('?&', '?');

        // 2. Abrir la URL en una nueva pestaña
        // Este es el método que SÍ funciona
        window.open(submissionUrl, '_blank');

        // 3. Transición local garantizada
        localStorage.setItem(QUIZ_COMPLETED_KEY, 'true');
        setIsCompleted(true);
        
        // Esperar 2 segundos y forzar la transición a la pantalla final
        setTimeout(() => { 
             setIsSubmitting(false);
             setCurrentStep(7); // Muestra el mensaje final
        }, 2000); 
    };
    
    
    // --- Renderizado de Vistas ---

    const renderStep = () => {
        // Pantalla de bloqueo/éxito (STEP 7)
        if (isCompleted || currentStep === 7) {
             return (
                 <div className="step-content success-screen">
                    {/* Mensaje de éxito personalizado */}
                    <h2>¡Respuestas Enviadas con Éxito! 🎉</h2>
                    <p>¡Vuestro conocimiento sobre Manel y Carla ha sido registrado!</p>
                    <p>Vuestras respuestas han sido validadas. Si habéis acertado las preguntas o sois de las personas con mayor acierto, **¡tendréis un Detalle Especial!**</p>
                    <p>¡Gracias por jugar y nos vemos muy pronto en la boda!</p>
                    <p style={{ marginTop: '20px', fontWeight: 'bold', fontSize: '1.2rem', color: '#ffcc00' }}>Con cariño, Manel y Carla.</p>
                </div>
             );
        }

        switch (currentStep) {
            
            // STEP 0: BIENVENIDA
            case 0:
                return (
                    <div className="step-content welcome-screen">
                        <h1>💍 ¡Bienvenido/a al Gran Quiz de Manel y Carla!</h1>
                        <p>Pon a prueba cuánto sabes de nuestra historia. Si aciertas, entrarás en el sorteo de un detalle especial de nuestra parte.</p>
                        <button 
                            className="button" 
                            onClick={() => setCurrentStep(1)}
                            disabled={isSubmitting}
                        >
                            ¡EMPEZAR A JUGAR!
                        </button>
                    </div>
                );

            // STEPS 1-5: PREGUNTAS
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                return (
                    <div className="step-content question-screen">
                        <h2>{currentQuestion.label}</h2>
                        <div className="options-grid">
                            {currentQuestion.options.map((option, index) => (
                                <button
                                    key={index}
                                    className={`option-button option-${optionLetters[index]}`}
                                    onClick={() => handleAnswerSelect(option, currentQuestion.id)}
                                    disabled={isSubmitting}
                                >
                                    <span className="option-letter">{optionLetters[index]}</span>
                                    <span className="option-text">{option}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                );
            
            // STEP 6: ENVIANDO RESPUESTAS
            case 6:
                return (
                    <div className="step-content submit-screen">
                        <h2>¡Enviando tus Respuestas!</h2>
                        <div className="spinner"></div>
                        <p>No cierres la página, estamos registrando tu participación...</p>
                    </div>
                );
                
            default:
                return null;
        }
    };

    return (
        <>
            <Head>
                <title>El Gran Quiz de Manel y Carla 💍</title>
                <meta name="description" content="Pon a prueba cuánto sabes de nuestra historia" />
            </Head>

            <div className="container">
                <div className="card">
                    {renderStep()}
                    
                    {/* Indicador de progreso (Steps 1-5) */}
                    {(currentStep >= 1 && currentStep <= 5) && (
                        <div className="progress-bar-container">
                             <div 
                                className="progress-bar" 
                                style={{ width: `${(currentStep / 5) * 100}%` }}
                            ></div>
                            <p className="progress-text">Pregunta {currentStep} de 5</p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- ESTILOS ESTILO MILLONARIO --- */}
            <style jsx global>{`
                 @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@700&display=swap'); 
            `}</style>
            <style jsx>{`
                /* ... (Estilos Millonarios idénticos al código anterior) ... */
                .container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background: #111827; 
                    font-family: 'Roboto Mono', monospace, sans-serif;
                    padding: 20px;
                }
                .card { background: #1f2937; color: #fff; padding: 3rem; border-radius: 16px; box-shadow: 0 0 25px rgba(0, 0, 0, 0.5); text-align: center; max-width: 700px; width: 100%; min-height: 500px; display: flex; flex-direction: column; justify-content: space-between; }
                h1 { color: #ffcc00; margin-bottom: 1rem; font-size: 2.5rem; text-shadow: 0 0 10px rgba(255, 204, 0, 0.5); }
                h2 { color: #fff; font-size: 1.5rem; margin-bottom: 2rem; border-bottom: 2px solid #374151; padding-bottom: 1rem; }
                p { color: #e5e7eb; font-size: 1.1rem; margin-bottom: 2rem; }
                .button { display: inline-block; padding: 1rem 2rem; background-color: #ffcc00; color: #1f2937; border: none; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 1.1rem; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 0 #cc9900; text-transform: uppercase; }
                .button:hover { background-color: #ffdd44; transform: translateY(-2px); box-shadow: 0 6px 0 #cc9900; }
                .options-grid { display: flex; flex-wrap: wrap; gap: 15px; justify-content: center; margin-top: 20px; }
                .option-button { display: flex; align-items: center; width: calc(50% - 7.5px); min-height: 70px; padding: 15px 20px; background-color: #374151; color: #fff; border: 2px solid #5a6475; border-radius: 35px; font-size: 1rem; text-align: left; transition: background-color 0.2s, transform 0.1s; box-shadow: 0 4px 0 #2d3748; }
                .option-button:hover { background-color: #4b5563; border-color: #ffcc00; transform: translateY(-2px); box-shadow: 0 6px 0 #2d3748; }
                .option-letter { background: #ffcc00; color: #1f2937; font-weight: bold; width: 30px; height: 30px; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin-right: 15px; flex-shrink: 0; }
                .option-text { flex-grow: 1; }
                .spinner { border: 4px solid #f3f3f3; border-top: 4px solid #ffcc00; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 20px auto; }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                .progress-bar-container { width: 90%; height: 15px; background: #374151; border-radius: 10px; overflow: hidden; margin: 20px auto 0; box-shadow: 0 2px 5px rgba(0,0,0,0.3) inset; }
                .progress-bar { height: 100%; background: linear-gradient(90deg, #ffcc00, #ff8c00); transition: width 0.5s ease-in-out; border-radius: 10px; }
                .progress-text { margin-top: 5px; font-size: 0.9rem; color: #ffcc00; }
                .success-screen h2 { color: #70e000; text-shadow: 0 0 5px #70e000; }
            `}</style>
        </>
    );
};

export default QuizBodaPage;
