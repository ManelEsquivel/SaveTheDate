import React, { useState } from 'react';
import Head from 'next/head';

export default function InvitationEnvelope() {
    // ESTADOS DE LA SECUENCIA DE ANIMACIÓN
    // 0: Cerrado
    // 1: Abriendo Solapa
    // 2: Extrayendo Carta
    // 3: Lectura (El sobre baja para centrar la carta)
    const [animationStep, setAnimationStep] = useState(0);

    const startAnimation = () => {
        setAnimationStep(1);

        // Tiempo apertura solapa
        setTimeout(() => {
            setAnimationStep(2);
        }, 800);

        // Tiempo sacar carta + bajar sobre
        setTimeout(() => {
            setAnimationStep(3);
        }, 1800); 
    };

    const handleConfirm = () => {
        window.open('https://www.bodas.net/web/manel-y-carla/confirmatuasistencia-3', '_blank');
    };

    return (
        <>
            <Head>
                <title>Invitación Manel & Carla</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
                {/* Fuentes Premium */}
                <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Montserrat:wght@200;400&family=Pinyon+Script&display=swap" rel="stylesheet" />
            </Head>

            <div style={styles.container}>
                
                {/* --- CONTENEDOR ANIMADO --- */}
                <div style={{
                    ...styles.wrapper,
                    // Al final, bajamos todo el sobre para que la carta (que sale hacia arriba) quede centrada
                    transform: animationStep === 3 ? 'translateY(150px)' : 'translateY(0)',
                    transition: 'transform 1.5s cubic-bezier(0.25, 1, 0.5, 1)'
                }}>

                    {/* --- 1. LA CARTA (INTERIOR) --- */}
                    <div style={{
                        ...styles.card,
                        // Sale hacia arriba. Ajustado para verse completa en el móvil
                        transform: animationStep >= 2 ? 'translateY(-320px)' : 'translateY(0)',
                        opacity: animationStep >= 2 ? 1 : 0,
                        zIndex: animationStep >= 2 ? 20 : 1,
                        transition: 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease'
                    }}>
                        <div style={styles.cardContent}>
                            <p style={styles.saveTheDate}>SAVE THE DATE</p>
                            <h1 style={styles.names}>Manel & Carla</h1>
                            
                            <div style={styles.divider}></div>
                            
                            <p style={styles.date}>21 · OCTUBRE · 2026</p>
                            <p style={styles.location}>MASIA MAS LLOMBART</p>
                            
                            <p style={styles.quote}>
                                "Te esperamos para celebrar<br/>el inicio de nuestra nueva aventura."
                            </p>

                            <button 
                                onClick={handleConfirm} 
                                style={{
                                    ...styles.button,
                                    opacity: animationStep === 3 ? 1 : 0,
                                    pointerEvents: animationStep === 3 ? 'auto' : 'none',
                                    transition: 'opacity 1s ease 1s'
                                }}
                            >
                                Confirmar Asistencia
                            </button>
                        </div>
                    </div>

                    {/* --- 2. EL SOBRE (CÁSCARA) --- */}
                    <div style={styles.envelope}>
                        
                        {/* Interior (Gris oscuro para contraste) */}
                        <div style={styles.envelopeInner}></div>
                        
                        {/* Solapas Laterales (Izquierda/Derecha) */}
                        <div style={styles.flapLeft}></div>
                        <div style={styles.flapRight}></div>
                        
                        {/* Solapa Inferior (Bolsillo) */}
                        <div style={styles.flapBottom}></div>

                        {/* Solapa Superior (Móvil) */}
                        <div style={{
                            ...styles.flapTop,
                            transform: animationStep >= 1 ? 'rotateX(180deg)' : 'rotateX(0deg)',
                            zIndex: animationStep >= 1 ? 1 : 50, 
                            transition: 'transform 0.8s ease-in-out, z-index 0s linear 0.4s'
                        }}></div>

                        {/* --- 3. SELLO DE LACRE DORADO --- */}
                        <div 
                            onClick={animationStep === 0 ? startAnimation : undefined}
                            style={{
                                ...styles.waxSeal,
                                opacity: animationStep === 0 ? 1 : 0,
                                transform: animationStep === 0 ? 'scale(1)' : 'scale(1.2)',
                                pointerEvents: animationStep === 0 ? 'auto' : 'none',
                            }}
                        >
                            <div style={styles.sealInner}>
                                <span style={styles.sealText}>Abrir</span>
                            </div>
                        </div>

                    </div>
                    
                </div>
            </div>

            <style jsx global>{`
                body { margin: 0; padding: 0; background-color: #e8e6e1; }
            `}</style>
        </>
    );
}

// --- ESTILOS PREMIUM ---
const styles = {
    container: {
        width: '100vw',
        height: '100vh',
        backgroundColor: '#dcd9d4', // Fondo de la página (mesa)
        backgroundImage: 'linear-gradient(to bottom, #eef2f3, #8e9eab)', // Degradado sutil fondo
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
    },
    wrapper: {
        position: 'relative',
        width: '320px', 
        height: '450px', // Formato vertical estándar
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end', 
        perspective: '1500px',
    },
    
    // --- CARTA INTERIOR ---
    card: {
        position: 'absolute',
        bottom: '10px',
        width: '290px',
        height: '420px',
        backgroundColor: '#fff',
        // Textura de papel sutil
        backgroundImage: `url("https://www.transparenttextures.com/patterns/cream-paper.png")`,
        boxShadow: '0 0 5px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '15px',
        boxSizing: 'border-box',
    },
    cardContent: {
        width: '100%',
        height: '100%',
        border: '1px solid #b3a285', // Borde fino dorado mate
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        textAlign: 'center',
        padding: '10px',
    },
    saveTheDate: {
        fontFamily: '"Montserrat", sans-serif',
        fontSize: '10px',
        letterSpacing: '3px',
        color: '#666',
        textTransform: 'uppercase',
        margin: 0,
    },
    names: {
        fontFamily: '"Pinyon Script", cursive', // Fuente muy elegante
        fontSize: '42px',
        color: '#222',
        margin: '10px 0',
        lineHeight: 1,
    },
    divider: {
        width: '30px',
        height: '1px',
        backgroundColor: '#b3a285',
        margin: '5px 0',
    },
    date: {
        fontFamily: '"Cormorant Garamond", serif',
        fontSize: '16px',
        fontWeight: '600',
        color: '#222',
        letterSpacing: '1px',
        marginTop: '5px',
    },
    location: {
        fontFamily: '"Montserrat", sans-serif',
        fontSize: '9px',
        color: '#888',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        marginBottom: '15px',
    },
    quote: {
        fontFamily: '"Cormorant Garamond", serif',
        fontSize: '14px',
        fontStyle: 'italic',
        color: '#555',
        lineHeight: '1.4',
        marginBottom: '10px',
    },
    button: {
        backgroundColor: '#222',
        color: '#fff',
        border: 'none',
        padding: '12px 25px',
        fontSize: '10px',
        fontFamily: '"Montserrat", sans-serif',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        cursor: 'pointer',
        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
    },

    // --- SOBRE (BLANCO/GRISÁCEO) ---
    envelope: {
        position: 'relative',
        width: '320px',
        height: '220px', // Altura del "bolsillo" visible
        zIndex: 10,
        filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.15))', // Sombra realista
    },
    envelopeInner: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#d9d9d9', // Interior gris oscuro
        borderRadius: '2px',
    },
    // Solapas laterales
    flapLeft: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        borderTop: '110px solid transparent',
        borderBottom: '110px solid transparent',
        borderLeft: '170px solid #f4f4f4', // Blanco grisáceo
        zIndex: 11,
    },
    flapRight: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 0,
        height: 0,
        borderTop: '110px solid transparent',
        borderBottom: '110px solid transparent',
        borderRight: '170px solid #f4f4f4',
        zIndex: 11,
    },
    // Solapa inferior (Bolsillo)
    flapBottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 0,
        height: 0,
        borderLeft: '160px solid transparent',
        borderRight: '160px solid transparent',
        borderBottom: '130px solid #ebebeb', // Un poco más oscuro para diferenciar
        zIndex: 12,
    },
    // Solapa Superior (La que se abre)
    flapTop: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        borderLeft: '160px solid transparent',
        borderRight: '160px solid transparent',
        borderTop: '140px solid #f4f4f4', // Color principal sobre
        transformOrigin: 'top',
        zIndex: 50, // Por encima de todo al principio
        filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.05))',
    },

    // --- SELLO DORADO ---
    waxSeal: {
        position: 'absolute',
        top: '110px', // Justo en la punta de la solapa superior
        left: '50%',
        marginLeft: '-35px', // Centrado (70px / 2)
        width: '70px',
        height: '70px',
        borderRadius: '50%',
        // Dorado realista
        background: 'radial-gradient(ellipse at 30% 30%, #ffd700, #d4af37, #8b6914)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 60,
        cursor: 'pointer',
        transition: 'transform 0.3s ease',
    },
    sealInner: {
        width: '55px',
        height: '55px',
        borderRadius: '50%',
        border: '1px solid rgba(139, 105, 20, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: 'inset 0 0 5px rgba(0,0,0,0.2)',
    },
    sealText: {
        fontFamily: '"Cormorant Garamond", serif',
        fontSize: '16px',
        fontStyle: 'italic',
        color: '#5c4008', // Marrón dorado oscuro
        fontWeight: '600',
        textShadow: '0 1px 0 rgba(255,255,255,0.3)',
    }
};
