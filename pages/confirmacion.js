import React, { useState } from 'react';
import Head from 'next/head';

export default function InvitationEnvelope() {
    // ESTADOS DE LA SECUENCIA:
    // 0: Cerrado
    // 1: Abriendo Solapa
    // 2: Extrayendo Carta
    // 3: Lectura (El sobre baja para centrar la carta)
    const [animationStep, setAnimationStep] = useState(0);

    const startAnimation = () => {
        setAnimationStep(1);

        setTimeout(() => {
            setAnimationStep(2);
        }, 800);

        setTimeout(() => {
            setAnimationStep(3);
        }, 1600);
    };

    const handleConfirm = () => {
        window.open('https://www.bodas.net/web/manel-y-carla/confirmatuasistencia-3', '_blank');
    };

    return (
        <>
            <Head>
                <title>Invitación Manel & Carla</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
                <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Great+Vibes&family=Montserrat:wght@300;400;600&display=swap" rel="stylesheet" />
            </Head>

            <div style={styles.container}>
                
                {/* CONTENEDOR PRINCIPAL */}
                <div style={{
                    ...styles.wrapper,
                    // CORRECCIÓN CLAVE: Bajamos el sobre (translateY 140px) cuando se lee
                    // para que la carta (que sale hacia arriba) quede centrada en pantalla.
                    transform: animationStep === 3 ? 'scale(1.05) translateY(140px)' : 'scale(1)',
                    transition: 'transform 1.2s cubic-bezier(0.25, 1, 0.5, 1)'
                }}>

                    {/* --- 1. LA CARTA --- */}
                    <div style={{
                        ...styles.card,
                        // La carta sube 230px hacia arriba desde el fondo del sobre
                        transform: animationStep >= 2 ? 'translateY(-230px)' : 'translateY(100px)',
                        opacity: animationStep >= 2 ? 1 : 0,
                        zIndex: animationStep >= 2 ? 20 : 1,
                        transition: 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease-out'
                    }}>
                        <div style={styles.cardBorder}>
                            <p style={styles.subHeader}>NOS CASAMOS</p>
                            <h1 style={styles.names}>Manel & Carla</h1>
                            <div style={styles.divider}>
                                <span style={{fontSize:'18px'}}>❦</span>
                            </div>
                            <p style={styles.date}>21 · 10 · 2026</p>
                            <p style={styles.place}>Masia Mas Llombart, BCN</p>
                            
                            <p style={styles.verse}>
                                "El amor es lo que hace que el viaje valga la pena."
                            </p>

                            <button 
                                onClick={handleConfirm} 
                                style={{
                                    ...styles.confirmButton,
                                    opacity: animationStep === 3 ? 1 : 0,
                                    pointerEvents: animationStep === 3 ? 'auto' : 'none',
                                    transition: 'opacity 0.8s ease 0.5s'
                                }}
                            >
                                Confirmar Asistencia
                            </button>
                        </div>
                    </div>

                    {/* --- 2. EL SOBRE --- */}
                    <div style={styles.envelope}>
                        <div style={styles.envelopeInner}></div>
                        <div style={styles.flapLeft}></div>
                        <div style={styles.flapRight}></div>
                        <div style={styles.flapBottom}></div>

                        {/* Solapa Superior */}
                        <div style={{
                            ...styles.flapTop,
                            transform: animationStep >= 1 ? 'rotateX(180deg)' : 'rotateX(0deg)',
                            zIndex: animationStep >= 1 ? 1 : 10, 
                            transition: 'transform 0.8s ease-in-out, z-index 0s linear 0.4s'
                        }}></div>

                        {/* Sello */}
                        <div 
                            onClick={animationStep === 0 ? startAnimation : undefined}
                            style={{
                                ...styles.waxSeal,
                                opacity: animationStep === 0 ? 1 : 0,
                                transform: animationStep === 0 ? 'scale(1)' : 'scale(1.5)',
                                pointerEvents: animationStep === 0 ? 'auto' : 'none',
                            }}
                        >
                            <span style={styles.sealText}>M&C</span>
                        </div>
                    </div>
                    
                    <div style={{
                        ...styles.hintText,
                        opacity: animationStep === 0 ? 1 : 0,
                        transition: 'opacity 0.5s'
                    }}>
                        Toca el sello para abrir
                    </div>

                </div>
            </div>
            
            <style jsx global>{`
                body { margin: 0; padding: 0; background-color: #f2f0eb; }
                @keyframes pulse-shadow {
                    0% { box-shadow: 0 0 0 0 rgba(180, 0, 0, 0.4); }
                    70% { box-shadow: 0 0 0 10px rgba(180, 0, 0, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(180, 0, 0, 0); }
                }
            `}</style>
        </>
    );
}

const styles = {
    container: {
        width: '100vw',
        height: '100vh',
        backgroundColor: '#f2f0eb',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
    },
    wrapper: {
        position: 'relative',
        width: '340px', 
        height: '230px', 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end', // Alineamos abajo
        perspective: '1500px',
    },
    
    // --- CARTA ---
    card: {
        position: 'absolute',
        bottom: '0',
        width: '310px',
        height: '420px', // Ajustado ligeramente para móvil
        backgroundColor: '#fffcf5',
        backgroundImage: `url("https://www.transparenttextures.com/patterns/cream-paper.png")`,
        borderRadius: '8px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardBorder: {
        width: '90%',
        height: '92%',
        border: '1px solid #cfaa5e',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        textAlign: 'center',
        padding: '25px 15px',
        boxSizing: 'border-box',
    },
    subHeader: {
        fontFamily: '"Montserrat", sans-serif',
        fontSize: '10px',
        letterSpacing: '4px',
        color: '#8a8a8a',
        marginBottom: '5px',
        textTransform: 'uppercase',
    },
    names: {
        fontFamily: '"Great Vibes", cursive',
        fontSize: '40px', // Un poco más pequeño para asegurar fit
        color: '#2c2c2c',
        margin: '0',
        lineHeight: '1.2',
    },
    divider: {
        color: '#cfaa5e',
        margin: '5px 0',
        opacity: 0.8,
    },
    date: {
        fontFamily: '"Cinzel", serif',
        fontSize: '15px',
        fontWeight: '600',
        color: '#1a1a1a',
        letterSpacing: '1px',
        marginBottom: '2px',
    },
    place: {
        fontFamily: '"Montserrat", sans-serif',
        fontSize: '10px',
        color: '#666',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        marginBottom: '10px',
    },
    verse: {
        fontFamily: '"Montserrat", sans-serif',
        fontSize: '11px',
        color: '#777',
        fontStyle: 'italic',
        lineHeight: '1.4',
        maxWidth: '85%',
        margin: '0 auto',
    },
    confirmButton: {
        backgroundColor: '#8b0000',
        color: '#fff',
        border: 'none',
        padding: '12px 24px',
        fontSize: '11px',
        fontFamily: '"Montserrat", sans-serif',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        fontWeight: '600',
        cursor: 'pointer',
        borderRadius: '50px',
        boxShadow: '0 4px 15px rgba(139, 0, 0, 0.3)',
        marginTop: '10px',
    },

    // --- SOBRE ---
    envelope: {
        position: 'relative',
        width: '340px',
        height: '230px',
        zIndex: 5,
    },
    envelopeInner: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#3e3a38',
        borderRadius: '6px',
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
    },
    flapLeft: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        borderTop: '115px solid transparent',
        borderBottom: '115px solid transparent',
        borderLeft: '180px solid #ece6d8',
        zIndex: 6,
        borderTopLeftRadius: '6px',
        borderBottomLeftRadius: '6px',
    },
    flapRight: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 0,
        height: 0,
        borderTop: '115px solid transparent',
        borderBottom: '115px solid transparent',
        borderRight: '180px solid #ece6d8',
        zIndex: 6,
        borderTopRightRadius: '6px',
        borderBottomRightRadius: '6px',
    },
    flapBottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 0,
        height: 0,
        borderLeft: '170px solid transparent',
        borderRight: '170px solid transparent',
        borderBottom: '130px solid #e3decb',
        zIndex: 7,
        borderBottomLeftRadius: '6px',
        borderBottomRightRadius: '6px',
        filter: 'drop-shadow(0 -2px 5px rgba(0,0,0,0.1))',
    },
    flapTop: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        borderLeft: '170px solid transparent',
        borderRight: '170px solid transparent',
        borderTop: '140px solid #ece6d8',
        transformOrigin: 'top',
        borderTopLeftRadius: '6px',
        borderTopRightRadius: '6px',
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
    },

    // --- SELLO ---
    waxSeal: {
        position: 'absolute',
        top: '120px',
        left: '50%',
        marginLeft: '-35px',
        marginTop: '-35px',
        width: '70px',
        height: '70px',
        background: 'radial-gradient(circle at 30% 30%, #d32f2f, #8b0000)',
        borderRadius: '50%',
        boxShadow: '0 5px 15px rgba(0,0,0,0.3), inset 2px 2px 5px rgba(255,255,255,0.3), inset -2px -2px 5px rgba(0,0,0,0.5)',
        border: '4px solid #720e0e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 15,
        cursor: 'pointer',
        transition: 'all 0.4s ease',
        animation: 'pulse-shadow 2s infinite',
    },
    sealText: {
        color: '#520808',
        fontFamily: '"Cinzel", serif',
        fontSize: '22px',
        fontWeight: 'bold',
        textShadow: '0 1px 1px rgba(255,255,255,0.2)',
    },
    hintText: {
        position: 'absolute',
        bottom: '-50px',
        width: '100%',
        textAlign: 'center',
        color: '#8b8b8b',
        fontFamily: '"Montserrat", sans-serif',
        fontSize: '11px',
        letterSpacing: '2px',
        textTransform: 'uppercase',
    }
};
