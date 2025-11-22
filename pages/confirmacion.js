import React, { useState } from 'react';
import Head from 'next/head';

export default function InvitationEnvelope() {
    // ESTADOS DE LA SECUENCIA
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
                <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Montserrat:wght@200;400&family=Great+Vibes&display=swap" rel="stylesheet" />
            </Head>

            <div style={styles.container}>
                
                {/* --- CONTENEDOR ANIMADO --- */}
                <div style={{
                    ...styles.wrapper,
                    // Paso 3: Bajamos el sobre para que la carta quede centrada arriba
                    transform: animationStep === 3 ? 'translateY(160px)' : 'translateY(0)',
                    transition: 'transform 1.5s cubic-bezier(0.25, 1, 0.5, 1)'
                }}>

                    {/* --- 1. LA CARTA (INTERIOR) --- */}
                    <div style={{
                        ...styles.card,
                        // Sale hacia arriba (-330px)
                        transform: animationStep >= 2 ? 'translateY(-330px)' : 'translateY(0)',
                        opacity: animationStep >= 2 ? 1 : 0,
                        zIndex: animationStep >= 2 ? 20 : 1,
                        transition: 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease'
                    }}>
                        <div style={styles.cardContent}>
                            <p style={styles.saveTheDate}>NOS CASAMOS</p>
                            <h1 style={styles.names}>Manel & Carla</h1>
                            
                            <div style={styles.divider}></div>
                            
                            <p style={styles.date}>21 · OCTUBRE · 2026</p>
                            <p style={styles.location}>MASIA MAS LLOMBART</p>
                            
                            <p style={styles.quote}>
                                "El amor es lo que hace que<br/>el viaje valga la pena."
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

                    {/* --- 2. EL SOBRE TIPO FOTO --- */}
                    <div style={styles.envelope}>
                        
                        {/* Interior oscuro para dar profundidad al abrir */}
                        <div style={styles.envelopeInner}></div>
                        
                        {/* Solapas Laterales (Ayudan a cerrar los huecos) */}
                        <div style={styles.flapLeft}></div>
                        <div style={styles.flapRight}></div>
                        
                        {/* Solapa Inferior (Grande, sube hasta el centro) */}
                        <div style={styles.flapBottom}></div>

                        {/* Solapa Superior (La que se abre, GRAN TRIÁNGULO) */}
                        <div style={{
                            ...styles.flapTop,
                            transform: animationStep >= 1 ? 'rotateX(180deg)' : 'rotateX(0deg)',
                            zIndex: animationStep >= 1 ? 1 : 50, 
                            transition: 'transform 0.9s cubic-bezier(0.4, 0, 0.2, 1), z-index 0s linear 0.4s'
                        }}></div>

                        {/* --- 3. SELLO DORADO --- */}
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
                body { margin: 0; padding: 0; background-color: #e0e0e0; }
            `}</style>
        </>
    );
}

const styles = {
    container: {
        width: '100vw',
        height: '100vh',
        backgroundColor: '#e0e0e0', 
        // Fondo desenfocado o neutro para resaltar el sobre blanco
        backgroundImage: 'radial-gradient(circle, #f0f0f0 0%, #d0d0d0 100%)', 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
    },
    wrapper: {
        position: 'relative',
        width: '340px', 
        height: '480px', // Formato vertical alto
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end', 
        perspective: '1500px',
    },
    
    // --- CARTA ---
    card: {
        position: 'absolute',
        bottom: '5px',
        width: '310px',
        height: '450px',
        backgroundColor: '#fff',
        backgroundImage: `url("https://www.transparenttextures.com/patterns/cream-paper.png")`,
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '15px',
        boxSizing: 'border-box',
    },
    cardContent: {
        width: '100%',
        height: '100%',
        border: '1px solid #c5b358', // Dorado suave
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
        color: '#888',
        textTransform: 'uppercase',
        margin: 0,
    },
    names: {
        fontFamily: '"Great Vibes", cursive',
        fontSize: '48px',
        color: '#333',
        margin: '5px 0',
        lineHeight: 1.1,
    },
    divider: {
        width: '40px',
        height: '1px',
        backgroundColor: '#c5b358',
        margin: '5px 0',
    },
    date: {
        fontFamily: '"Cormorant Garamond", serif',
        fontSize: '18px',
        fontWeight: '600',
        color: '#333',
        letterSpacing: '1px',
        marginTop: '5px',
    },
    location: {
        fontFamily: '"Montserrat", sans-serif',
        fontSize: '10px',
        color: '#666',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        marginBottom: '10px',
    },
    quote: {
        fontFamily: '"Cormorant Garamond", serif',
        fontSize: '14px',
        fontStyle: 'italic',
        color: '#666',
        lineHeight: '1.4',
        marginBottom: '5px',
    },
    button: {
        backgroundColor: '#333',
        color: '#fff',
        border: 'none',
        padding: '12px 28px',
        fontSize: '11px',
        fontFamily: '"Montserrat", sans-serif',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        cursor: 'pointer',
        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
    },

    // --- SOBRE (BLANCO CON TEXTURA) ---
    envelope: {
        position: 'relative',
        width: '340px',
        height: '240px', // Altura visual del sobre cerrado
        zIndex: 10,
        filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.2))',
    },
    envelopeInner: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#cccccc', // Interior gris
        borderRadius: '4px',
    },
    // Solapas Laterales
    flapLeft: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        borderTop: '120px solid transparent',
        borderBottom: '120px solid transparent',
        borderLeft: '180px solid #f4f4f4', // Blanco textura
        zIndex: 11,
    },
    flapRight: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 0,
        height: 0,
        borderTop: '120px solid transparent',
        borderBottom: '120px solid transparent',
        borderRight: '180px solid #f4f4f4',
        zIndex: 11,
    },
    // Solapa Inferior
    flapBottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 0,
        height: 0,
        borderLeft: '170px solid transparent',
        borderRight: '170px solid transparent',
        borderBottom: '150px solid #ebebeb', // Ligera diferencia tono
        zIndex: 12,
    },
    // SOLAPA SUPERIOR (EL PICO GRANDE)
    flapTop: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        // Ajustamos para que las líneas nazcan de las esquinas
        borderLeft: '170px solid transparent',
        borderRight: '170px solid transparent',
        borderTop: '190px solid #f9f9f9', // Pico largo y blanco
        transformOrigin: 'top',
        zIndex: 50,
        // Textura sutil (simulada con drop-shadow interna en CSS real o imagen, aquí color plano limpio)
    },

    // --- SELLO DE LACRE (EN LA PUNTA) ---
    waxSeal: {
        position: 'absolute',
        top: '155px', // Ajustado a la punta del pico (aprox 190px - mitad sello)
        left: '50%',
        marginLeft: '-32px', 
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse at 30% 30%, #e6c15c, #cfa336, #8a6e28)',
        boxShadow: '0 3px 6px rgba(0,0,0,0.3)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 60,
        cursor: 'pointer',
        transition: 'transform 0.2s ease',
    },
    sealInner: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        border: '1px solid rgba(138, 110, 40, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: 'inset 0 0 5px rgba(0,0,0,0.1)',
    },
    sealText: {
        fontFamily: '"Great Vibes", cursive',
        fontSize: '18px',
        color: '#5e4b25',
        fontWeight: '400',
        transform: 'rotate(-5deg)',
    }
};

