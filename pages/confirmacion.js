import React, { useState } from 'react';
import Head from 'next/head';

export default function InvitationEnvelope() {
    // ESTADOS DE LA SECUENCIA:
    // 0: Cerrado
    // 1: Abriendo Solapa
    // 2: Extrayendo Carta
    // 3: Lectura (El sobre baja, la carta se centra)
    const [animationStep, setAnimationStep] = useState(0);

    const startAnimation = () => {
        setAnimationStep(1);

        setTimeout(() => {
            setAnimationStep(2);
        }, 800); // Tiempo para abrir solapa

        setTimeout(() => {
            setAnimationStep(3);
        }, 1800); // Tiempo para sacar carta
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
                    // Al final (paso 3), bajamos el sobre para dejar ver la carta entera arriba
                    transform: animationStep === 3 ? 'translateY(180px)' : 'translateY(0)',
                    transition: 'transform 1.2s cubic-bezier(0.25, 1, 0.5, 1)'
                }}>

                    {/* --- 1. LA CARTA (INVITACIÓN) --- */}
                    <div style={{
                        ...styles.card,
                        // La carta sube mucho más arriba (-350px) porque el sobre es más alto
                        transform: animationStep >= 2 ? 'translateY(-350px)' : 'translateY(50px)',
                        opacity: animationStep >= 2 ? 1 : 0,
                        zIndex: animationStep >= 2 ? 20 : 1,
                        transition: 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease-out'
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
                                    transition: 'opacity 0.8s ease 0.8s'
                                }}
                            >
                                Confirmar Asistencia
                            </button>
                        </div>
                    </div>

                    {/* --- 2. EL SOBRE (VERTICAL) --- */}
                    <div style={styles.envelope}>
                        <div style={styles.envelopeInner}></div>
                        <div style={styles.flapLeft}></div>
                        <div style={styles.flapRight}></div>
                        <div style={styles.flapBottom}></div>

                        {/* Solapa Superior */}
                        <div style={{
                            ...styles.flapTop,
                            transform: animationStep >= 1 ? 'rotateX(180deg)' : 'rotateX(0deg)',
                            zIndex: animationStep >= 1 ? 1 : 30, 
                            transition: 'transform 0.8s ease-in-out, z-index 0s linear 0.4s'
                        }}></div>

                        {/* Sello Dorado "Abrir" */}
                        <div 
                            onClick={animationStep === 0 ? startAnimation : undefined}
                            style={{
                                ...styles.waxSeal,
                                opacity: animationStep === 0 ? 1 : 0,
                                transform: animationStep === 0 ? 'scale(1)' : 'scale(1.2)',
                                pointerEvents: animationStep === 0 ? 'auto' : 'none',
                            }}
                        >
                            <span style={styles.sealText}>Abrir</span>
                        </div>
                    </div>
                    
                </div>
            </div>
            
            <style jsx global>{`
                body { margin: 0; padding: 0; background-color: #e8e6e1; }
                @keyframes shimmer {
                    0% { background-position: -100% 0; }
                    100% { background-position: 100% 0; }
                }
            `}</style>
        </>
    );
}

const styles = {
    container: {
        width: '100vw',
        height: '100vh',
        backgroundColor: '#e8e6e1', // Fondo beige suave tipo papel
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
    },
    wrapper: {
        position: 'relative',
        width: '350px', 
        height: '500px', // MÁS ALTO: Formato Vertical
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end', 
        perspective: '1500px',
    },
    
    // --- CARTA ---
    card: {
        position: 'absolute',
        bottom: '10px',
        width: '320px',
        height: '480px', // Casi tan alta como el sobre
        backgroundColor: '#fffcf5',
        backgroundImage: `url("https://www.transparenttextures.com/patterns/cream-paper.png")`,
        borderRadius: '4px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardBorder: {
        width: '92%',
        height: '94%',
        border: '1px solid #cfaa5e',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly', // Distribución uniforme
        textAlign: 'center',
        padding: '20px 15px',
        boxSizing: 'border-box',
    },
    subHeader: {
        fontFamily: '"Montserrat", sans-serif',
        fontSize: '11px',
        letterSpacing: '4px',
        color: '#8a8a8a',
        textTransform: 'uppercase',
        margin: 0,
    },
    names: {
        fontFamily: '"Great Vibes", cursive',
        fontSize: '48px',
        color: '#2c2c2c',
        margin: '5px 0',
        lineHeight: '1.1',
    },
    divider: {
        color: '#cfaa5e',
        margin: '5px 0',
        opacity: 0.8,
    },
    date: {
        fontFamily: '"Cinzel", serif',
        fontSize: '18px',
        fontWeight: '600',
        color: '#1a1a1a',
        letterSpacing: '2px',
        margin: 0,
    },
    place: {
        fontFamily: '"Montserrat", sans-serif',
        fontSize: '11px',
        color: '#666',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        marginTop: '5px',
    },
    verse: {
        fontFamily: '"Montserrat", sans-serif',
        fontSize: '12px',
        color: '#777',
        fontStyle: 'italic',
        lineHeight: '1.5',
        maxWidth: '85%',
        margin: '10px auto',
    },
    confirmButton: {
        backgroundColor: '#8b0000',
        color: '#fff',
        border: 'none',
        padding: '14px 30px',
        fontSize: '12px',
        fontFamily: '"Montserrat", sans-serif',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        fontWeight: '600',
        cursor: 'pointer',
        borderRadius: '50px',
        boxShadow: '0 4px 15px rgba(139, 0, 0, 0.3)',
    },

    // --- SOBRE VERTICAL ---
    envelope: {
        position: 'relative',
        width: '350px',
        height: '500px', // Alto vertical
        zIndex: 5,
        filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.15))', // Sombra general del sobre
    },
    envelopeInner: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#3e3a38',
        borderRadius: '2px',
    },
    // Triángulos ajustados para formato vertical
    flapLeft: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        borderTop: '250px solid transparent', // Mitad de altura
        borderBottom: '250px solid transparent',
        borderLeft: '185px solid #f2f0eb', // Textura papel claro
        zIndex: 6,
    },
    flapRight: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 0,
        height: 0,
        borderTop: '250px solid transparent',
        borderBottom: '250px solid transparent',
        borderRight: '185px solid #f2f0eb',
        zIndex: 6,
    },
    flapBottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 0,
        height: 0,
        borderLeft: '175px solid transparent',
        borderRight: '175px solid transparent',
        borderBottom: '280px solid #e6e4df', // Un poco más alto para cubrir bien
        zIndex: 7,
    },
    flapTop: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        borderLeft: '175px solid transparent',
        borderRight: '175px solid transparent',
        borderTop: '260px solid #f2f0eb', // Solapa grande
        transformOrigin: 'top',
        zIndex: 30,
    },

    // --- SELLO DORADO "ABRIR" ---
    waxSeal: {
        position: 'absolute',
        top: '230px', // Centrado verticalmente (aprox mitad de 500 - mitad sello)
        left: '50%',
        marginLeft: '-35px',
        width: '70px',
        height: '70px',
        // Gradiente Dorado realista
        background: 'radial-gradient(ellipse at center, #f3e2c7 0%, #c19e67 60%, #b68d4c 100%)',
        borderRadius: '50%',
        // Sombras para dar volumen 3D
        boxShadow: '0 4px 10px rgba(0,0,0,0.3), inset 0 0 15px rgba(100, 70, 0, 0.3)',
        border: '2px solid #a88038',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 40,
        cursor: 'pointer',
        transition: 'transform 0.3s ease, opacity 0.3s ease',
    },
    sealText: {
        color: '#5e4618', // Marrón dorado oscuro
        fontFamily: '"Great Vibes", cursive',
        fontSize: '24px',
        fontWeight: '400',
        textShadow: '0 1px 0px rgba(255,255,255,0.4)', // Efecto grabado
        transform: 'rotate(-5deg)', // Ligeramente inclinado como un sello real
    }
};
