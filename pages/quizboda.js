// pages/quizboda.jsx

import React from 'react';
import Head from 'next/head';

// ⚠️ IMPORTANTE: PEGA AQUÍ EL ENLACE REAL DE TU GOOGLE FORM
const GOOGLE_FORM_URL = "PEGA_AQUÍ_TU_ENLACE_REAL_DE_GOOGLE_FORMS";

const QuizBodaPage = () => {

    // --- Función para manejar el clic del botón ---
    const handleClick = () => {
        // Redirige a Google Forms en una nueva pestaña
        window.open(GOOGLE_FORM_URL, '_blank');
    };

    return (
        <>
            <Head>
                <title>¡El Gran Quiz de Manel y Carla! 💍</title>
                {/* 1. Carga de Fuentes (Necesarias para el diseño divertido)
                  Next.js preferiría usar next/font, pero esto funciona para este caso.
                */}
                <link href="https://fonts.googleapis.com/css2?family=Pacifico&family=Poppins:wght@400;700&display=swap" rel="stylesheet" />
                
                {/* 2. Estilos CSS Clásicos (El diseño divertido)
                  Incluimos los estilos directamente aquí para que se apliquen solo a esta página.
                */}
                <style jsx global>{`
                    /* Estilos aplicados al body (Fondo y centrado) */
                    body {
                        font-family: 'Poppins', sans-serif !important; /* Usamos !important por si hay estilos globales */
                        background-color: #fce4ec; /* Rosa muy claro, festivo */
                        background-image: linear-gradient(135deg, #fce4ec 0%, #fff3e0 100%); /* Degradado suave */
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        margin: 0;
                        text-align: center;
                        padding: 20px;
                    }
                    /* Ocultamos el scrollbar si es necesario */
                    body > div {
                        display: contents; /* Necesario para que el div de React no rompa el centrado del body */
                    }
                `}</style>
                <style jsx>{`
                    /* 3. Estilos Específicos de la Tarjeta (Componente) */
                    .quiz-card {
                        background-color: #ffffff;
                        padding: 45px 30px;
                        border-radius: 20px;
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                        max-width: 550px;
                        width: 100%;
                        border: 5px solid #ff69b4; /* Borde rosa vibrante */
                        animation: pulse 2s infinite; /* Animación sutil */
                    }
                    
                    h1 {
                        font-family: 'Pacifico', cursive; /* Fuente divertida y caligráfica */
                        color: #d1495b; /* Color romántico */
                        font-size: 2.8em;
                        margin-bottom: 5px;
                        line-height: 1.1;
                    }
                    
                    .subtitle {
                        font-size: 1.2em;
                        color: #4a4a4a;
                        margin-bottom: 30px;
                        font-weight: 700;
                    }
                    
                    .emoji {
                        font-size: 3em;
                        margin-bottom: 20px;
                        display: block;
                    }
                    
                    .instructions {
                        color: #6a6a6a;
                        margin-bottom: 40px;
                        font-size: 1.1em;
                    }
                    
                    /* Estilo del Botón CTA */
                    .cta-button {
                        background-color: #ff69b4; /* Rosa chillón */
                        color: white;
                        padding: 15px 35px;
                        text-decoration: none;
                        border-radius: 50px; /* Borde redondeado para efecto píldora */
                        font-size: 1.3em;
                        font-weight: bold;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 10px rgba(255, 105, 180, 0.4);
                        border: 2px solid #e91e63;
                        cursor: pointer;
                    }

                    .cta-button:hover {
                        background-color: #e91e63;
                        transform: scale(1.05) translateY(-2px); /* Efecto 3D al pasar el ratón */
                    }
                    
                    /* Animación para el borde de la tarjeta */
                    @keyframes pulse {
                        0% { border-color: #ff69b4; }
                        50% { border-color: #e91e63; }
                        100% { border-color: #ff69b4; }
                    }
                `}</style>
            </Head>

            <div className="quiz-card">
                <span className="emoji">💖✨</span>
                
                <h1>¡Bienvenido/a al QUIZ de Manel y Carla!</h1>
                <p className="subtitle">Pon a prueba cuánto sabes de nuestra historia.</p>
                
                <p className="instructions">¡Solo 3 preguntas! Si aciertas, entrarás en el sorteo de un detalle especial de nuestra parte. ¡Mucha suerte!</p>
                
                <button 
                    className="cta-button"
                    onClick={handleClick}
                >
                    EMPIEZA TU TEST
                </button>
            </div>
        </>
    );
};

export default QuizBodaPage;
