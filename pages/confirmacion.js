import React, { useState } from 'react';
import Head from 'next/head';

export default function InvitationEnvelope() {
    // 0: Cerrado
    // 1: Abriendo Solapa
    // 2: Sacando Carta
    // 3: Lectura (Zoom final)
    const [animationStep, setAnimationStep] = useState(0);

    const startAnimation = () => {
        setAnimationStep(1);
        setTimeout(() => setAnimationStep(2), 800);
        setTimeout(() => setAnimationStep(3), 1800); 
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
                
                {/* WRAPPER: Ahora es mucho más alto para simular pantalla completa */}
                <div style={{
                    ...styles.wrapper,
                    transform: animationStep === 3 ? 'translateY(150px)' : 'translateY(0)',
                    transition: 'transform 1.5s cubic-bezier(0.25, 1, 0.5, 1)'
                }}>

                    {/* --- CARTA (Se desliza hacia arriba) --- */}
                    <div style={{
                        ...styles.card,
                        transform: animationStep >= 2 ? 'translateY(-50%)' : 'translateY(10%)', // Sale un 50% hacia arriba
                        opacity: animationStep >= 2 ? 1 : 0,
                        zIndex: animationStep >= 2 ? 20 : 1,
                        transition: 'transform 1.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease'
                    }}>
                        <div style={styles.cardContent}>
                            <p style={styles.saveTheDate}>NOS CASAMOS</p>
                            <h1 style={styles.names}>Manel & Carla</h1>
                            <div style={styles.divider}></div>
                            <p style={styles.date}>21 · OCTUBRE · 2026</p>
                            <p style={styles.location}>MASIA MAS LLOMBART</p>
                            <p style={styles.quote}>"El amor es lo que hace que<br/>el viaje valga la pena."</p>
                            <button onClick={handleConfirm} style={{...styles.button, opacity: animationStep === 3 ? 1 : 0, pointerEvents: animationStep === 3 ? 'auto' : 'none', transition: 'opacity 1s ease 1s'}}>
                                Confirmar Asistencia
                            </button>
                        </div>
                    </div>

                    {/* --- SOBRE (VERTICAL COMPLETO) --- */}
                    <div style={styles.envelope}>
                        
                        {/* Interior */}
                        <div style={styles.envelopeInner}></div>
                        
                        {/* Solapas Laterales (Cubren los lados) */}
                        <div style={styles.flapLeft}></div>
                        <div style={styles.flapRight}></div>
                        
                        {/* Solapa Inferior (Cubre hasta arriba) */}
                        <div style={styles.flapBottom}></div>

                        {/* Solapa Superior (El triángulo que baja) */}
                        <div style={{
                            ...styles.flapTop,
                            transform: animationStep >= 1 ? 'rotateX(180deg)' : 'rotateX(0deg)',
                            zIndex: animationStep >= 1 ? 1 : 50, 
                            transition: 'transform 0.9s cubic-bezier(0.4, 0, 0.2, 1), z-index 0s linear 0.4s'
                        }}></div>

                        {/* Sello */}
                        <div onClick={animationStep === 0 ? startAnimation : undefined}
                             style={{
                                ...styles.waxSeal,
                                opacity: animationStep === 0 ? 1 : 0,
                                transform: animationStep === 0 ? 'scale(1)' : 'scale(1.2)',
                                pointerEvents: animationStep === 0 ? 'auto' : 'none',
                            }}>
                            <div style={styles.sealInner}>
                                <span style={styles.sealText}>Abrir</span>
                            </div>
                        </div>

                    </div>
                    
                </div>
            </div>

            <style jsx global>{`
                body { margin: 0; padding: 0; background-color: #222; } /* Fondo oscuro para resaltar el sobre blanco */
            `}</style>
        </>
    );
}

const styles = {
    container: {
        width: '100vw',
        height: '100vh',
        backgroundColor: '#2c2c2c', // Fondo oscuro elegante
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
    },
    // EL CAMBIO CLAVE: Dimensiones verticales
    wrapper: {
        position: 'relative',
        width: '90vw', // Ocupa casi todo el ancho
        maxWidth: '400px',
        height: '65vh', // Ocupa el 65% de la altura de la pantalla (Vertical)
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end', 
        perspective: '1500px',
    },
    
    // --- CARTA ---
    card: {
        position: 'absolute',
        bottom: '10px',
        width: '92%', // Un poco más pequeña que el sobre
        height: '95%', // Casi tan alta como el sobre
        backgroundColor: '#fff',
        backgroundImage: `url("https://www.transparenttextures.com/patterns/cream-paper.png")`,
        boxShadow: '0 0 15px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        boxSizing: 'border-box',
    },
    cardContent: {
        width: '100%',
        height: '100%',
        border: '1px solid #c5b358',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        textAlign: 'center',
        padding: '10px',
    },
    // ... (Estilos de texto igual que antes, ajustados para verse bien)
    saveTheDate: { fontFamily: '"Montserrat", sans-serif', fontSize: '11px', letterSpacing: '3px', color: '#888', textTransform: 'uppercase', margin: 0 },
    names: { fontFamily: '"Great Vibes", cursive', fontSize: '42px', color: '#333', margin: '5px 0', lineHeight: 1.1 },
    divider: { width: '40px', height: '1px', backgroundColor: '#c5b358', margin: '5px 0' },
    date: { fontFamily: '"Cormorant Garamond", serif', fontSize: '16px', fontWeight: '600', color: '#333', letterSpacing: '1px', marginTop: '5px' },
    location: { fontFamily: '"Montserrat", sans-serif', fontSize: '9px', color: '#666', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' },
    quote: { fontFamily: '"Cormorant Garamond", serif', fontSize: '14px', fontStyle: 'italic', color: '#666', lineHeight: '1.4', marginBottom: '5px' },
    button: { backgroundColor: '#333', color: '#fff', border: 'none', padding: '12px 28px', fontSize: '11px', fontFamily: '"Montserrat", sans-serif', textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' },

    // --- SOBRE VERTICAL (Estilo "Baronial" de pico profundo) ---
    envelope: {
        position: 'relative',
        width: '100%',
        height: '100%', // Llena el wrapper verticalmente
        zIndex: 10,
        filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))', // Sombra profunda
    },
    envelopeInner: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#d1d1d1', // Gris oscuro interior
        borderRadius: '4px',
    },
    
    // Ajuste de bordes para que sean RESPONSIVOS (usamos % en border-width no funciona bien, así que usamos calc o valores grandes fijos que se cortan con overflow hidden si fuera necesario, pero aquí usaremos el ancho del contenedor padre para calcular visualmente)
    // Truco: Usar bordes grandes para cubrir el área.
    
    flapLeft: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        borderTop: '30vh solid transparent', // Altura dinámica
        borderBottom: '35vh solid transparent',
        borderLeft: '45vw solid #f7f7f7', // Ancho dinámico (mitad pantalla aprox)
        zIndex: 11,
    },
    flapRight: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 0,
        height: 0,
        borderTop: '30vh solid transparent',
        borderBottom: '35vh solid transparent',
        borderRight: '45vw solid #f7f7f7', // Blanco textura
        zIndex: 11,
    },
    flapBottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 0,
        height: 0,
        borderLeft: '45vw solid transparent',
        borderRight: '45vw solid transparent',
        borderBottom: '35vh solid #f0f0f0', // Cubre la parte baja
        zIndex: 12,
    },
    
    // SOLAPA SUPERIOR: Aquí está la clave del diseño de "líneas desde la esquina"
    flapTop: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        // Los bordes transparentes deben igualar el ancho del sobre para que el pico esté en el centro
        borderLeft: '45vw solid transparent', 
        borderRight: '45vw solid transparent',
        // El borde superior define el color y la longitud del pico hacia abajo
        borderTop: '32vh solid #fcfcfc', // Blanco puro, baja hasta casi el centro
        transformOrigin: 'top',
        zIndex: 50,
    },

    // --- SELLO ---
    waxSeal: {
        position: 'absolute',
        top: '30vh', // Ajustar esto para que coincida con la punta del pico (aprox borderTop height)
        left: '50%',
        marginLeft: '-35px', 
        width: '70px',
        height: '70px',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse at 30% 30%, #ffd700, #d4af37, #8b6914)',
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 60,
        cursor: 'pointer',
        transition: 'transform 0.2s ease',
    },
    sealInner: {
        width: '55px',
        height: '55px',
        borderRadius: '50%',
        border: '1px solid rgba(138, 110, 40, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: 'inset 0 0 5px rgba(0,0,0,0.1)',
    },
    sealText: {
        fontFamily: '"Great Vibes", cursive',
        fontSize: '20px',
        color: '#5c4008',
        fontWeight: '400',
        transform: 'rotate(-5deg)',
    }
};
