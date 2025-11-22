import React, { useState } from 'react';
import Head from 'next/head';

export default function InvitationEnvelope() {
    // Estados: 'closed' (cerrado), 'opening' (abriendo solapa), 'open' (carta fuera)
    const [status, setStatus] = useState('closed');

    const openEnvelope = () => {
        setStatus('opening');
        // Esperamos a que la solapa se abra (600ms) para sacar la carta
        setTimeout(() => {
            setStatus('open');
        }, 600);
    };

    const handleConfirm = () => {
        window.open('https://www.bodas.net/web/manel-y-carla/confirmatuasistencia-3', '_blank');
    };

    return (
        <>
            <Head>
                <title>Invitación Manel & Carla</title>
                {/* Fuentes elegantes */}
                <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Pinyon+Script&family=Montserrat:wght@300;400&display=swap" rel="stylesheet" />
            </Head>

            <div style={styles.container}>
                
                {/* --- CONTENEDOR CENTRAL --- */}
                <div style={{
                    ...styles.wrapper,
                    // Si está 'open', hacemos zoom para que la carta se lea bien
                    transform: status === 'open' ? 'scale(1.1) translateY(50px)' : 'scale(1)',
                    transition: 'transform 1s ease-in-out'
                }}>

                    {/* 1. LA CARTA (INVITACIÓN) */}
                    <div style={{
                        ...styles.card,
                        // Animación: Si está 'open', sube mucho (sale del sobre). Si es 'opening', quieta.
                        transform: status === 'open' ? 'translateY(-180px)' : 'translateY(0)',
                        zIndex: status === 'open' ? 20 : 2, // Sube de nivel al final
                        opacity: status === 'open' ? 1 : (status === 'opening' ? 1 : 0), // Truco para que no se vea por debajo
                        transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1), z-index 0s linear 0.5s, opacity 0.2s'
                    }}>
                        {/* Contenido de la Carta */}
                        <div style={styles.cardContent}>
                            <p style={styles.subHeader}>NOS CASAMOS</p>
                            <h1 style={styles.names}>Manel & Carla</h1>
                            <div style={styles.divider}></div>
                            <p style={styles.date}>21 de Octubre, 2026</p>
                            <p style={styles.place}>Masia Mas Llombart</p>
                            <p style={styles.details}>Esperamos que puedas acompañarnos<br/>en este día tan especial.</p>
                            
                            <button onClick={handleConfirm} style={styles.confirmButton}>
                                Confirmar Asistencia
                            </button>
                        </div>
                    </div>

                    {/* 2. EL SOBRE */}
                    <div style={styles.envelope}>
                        
                        {/* Interior del sobre (fondo oscuro) */}
                        <div style={styles.envelopeInner}></div>

                        {/* Solapa Izquierda */}
                        <div style={styles.flapLeft}></div>
                        
                        {/* Solapa Derecha */}
                        <div style={styles.flapRight}></div>

                        {/* Solapa Inferior (Bolsillo) */}
                        <div style={styles.flapBottom}></div>

                        {/* Solapa Superior (Móvil) */}
                        <div style={{
                            ...styles.flapTop,
                            transform: status !== 'closed' ? 'rotateX(180deg)' : 'rotateX(0deg)',
                            zIndex: status !== 'closed' ? 1 : 10, // Baja el z-index al abrirse
                            transition: 'transform 0.8s ease-in-out, z-index 0.2s linear 0.4s'
                        }}></div>

                        {/* 3. EL SELLO DE CERA ROJA */}
                        <div 
                            onClick={status === 'closed' ? openEnvelope : undefined}
                            style={{
                                ...styles.waxSeal,
                                opacity: status === 'closed' ? 1 : 0,
                                transform: status === 'closed' ? 'scale(1)' : 'scale(1.5)',
                                pointerEvents: status === 'closed' ? 'auto' : 'none',
                            }}
                        >
                            <span style={styles.sealText}>M&C</span>
                        </div>

                    </div>
                    
                    {/* Texto de ayuda (solo si está cerrado) */}
                    {status === 'closed' && (
                        <div style={styles.hintText}>Toca el sello para abrir</div>
                    )}

                </div>
            </div>
        </>
    );
}

// --- ESTILOS CSS ---
const styles = {
    container: {
        width: '100vw',
        height: '100vh',
        backgroundColor: '#f2f0eb', // Fondo general de la web
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
    },
    wrapper: {
        position: 'relative',
        width: '320px', // Ancho base para móvil
        height: '220px', // Altura del sobre (formato horizontal)
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end', // Alineado abajo para que la carta salga hacia arriba
        perspective: '1500px', // Profundidad 3D
    },
    
    // --- CARTA ---
    card: {
        position: 'absolute',
        bottom: '10px', // Empieza dentro del sobre
        width: '290px', // Un poco más estrecha que el sobre
        height: '420px', // Bastante alta para que quepa todo el texto
        backgroundColor: '#fff',
        backgroundImage: 'linear-gradient(to bottom, #fff 0%, #fafafa 100%)',
        borderRadius: '6px',
        boxShadow: '0 5px 25px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // La animación se controla en el render
    },
    cardContent: {
        width: '100%',
        height: '100%',
        border: '1px solid #d4af37', // Marco dorado fino
        margin: '15px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '20px',
        boxSizing: 'border-box',
    },
    subHeader: {
        fontFamily: '"Montserrat", sans-serif',
        fontSize: '10px',
        letterSpacing: '3px',
        color: '#888',
        marginBottom: '10px',
        textTransform: 'uppercase',
    },
    names: {
        fontFamily: '"Pinyon Script", cursive', // Fuente tipo firma elegante
        fontSize: '38px',
        color: '#1a1a1a',
        margin: '5px 0',
        lineHeight: '1',
    },
    divider: {
        width: '40px',
        height: '1px',
        backgroundColor: '#d4af37',
        margin: '15px 0',
    },
    date: {
        fontFamily: '"Cinzel", serif',
        fontSize: '14px',
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: '5px',
    },
    place: {
        fontFamily: '"Montserrat", sans-serif',
        fontSize: '12px',
        color: '#666',
        marginBottom: '20px',
    },
    details: {
        fontFamily: '"Montserrat", sans-serif',
        fontSize: '11px',
        color: '#888',
        lineHeight: '1.6',
        marginBottom: '25px',
        fontStyle: 'italic',
    },
    confirmButton: {
        backgroundColor: '#1a1a1a', // Botón negro elegante
        color: '#fff',
        border: 'none',
        padding: '12px 30px',
        fontSize: '11px',
        fontFamily: '"Montserrat", sans-serif',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        cursor: 'pointer',
        transition: 'background 0.3s',
        borderRadius: '2px',
    },

    // --- SOBRE (ENVELOPE) ---
    envelope: {
        position: 'relative',
        width: '320px',
        height: '220px',
        zIndex: 5,
    },
    envelopeInner: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#403d3d', // Interior oscuro para contraste
        borderRadius: '4px',
    },
    // Estilos de las solapas usando bordes CSS
    flapLeft: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        borderTop: '110px solid transparent',
        borderBottom: '110px solid transparent',
        borderLeft: '170px solid #e3decb', // Color del papel del sobre
        zIndex: 6,
        borderTopLeftRadius: '4px',
        borderBottomLeftRadius: '4px',
    },
    flapRight: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 0,
        height: 0,
        borderTop: '110px solid transparent',
        borderBottom: '110px solid transparent',
        borderRight: '170px solid #e3decb', // Color del papel del sobre
        zIndex: 6,
        borderTopRightRadius: '4px',
        borderBottomRightRadius: '4px',
    },
    flapBottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 0,
        height: 0,
        borderLeft: '160px solid transparent',
        borderRight: '160px solid transparent',
        borderBottom: '120px solid #dcd6c0', // Un pelín más oscuro para sombra
        zIndex: 7,
        borderBottomLeftRadius: '4px',
        borderBottomRightRadius: '4px',
    },
    flapTop: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        borderLeft: '160px solid transparent',
        borderRight: '160px solid transparent',
        borderTop: '130px solid #e3decb', // Solapa superior
        zIndex: 10, // Empieza encima de todo
        transformOrigin: 'top',
        borderTopLeftRadius: '4px',
        borderTopRightRadius: '4px',
        // Sombra suave para dar realismo
        filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.1))', 
    },

    // --- SELLO DE CERA ROJA (WAX SEAL) ---
    waxSeal: {
        position: 'absolute',
        top: '110px', // Centrado (mitad de 220px)
        left: '50%',
        marginLeft: '-35px', // Mitad del ancho
        marginTop: '-35px', // Ajuste vertical
        width: '70px',
        height: '70px',
        // Gradiente rojo complejo para efecto cera
        background: 'radial-gradient(circle at 30% 30%, #ff4d4d, #8b0000)',
        borderRadius: '50%',
        // Sombras: Una externa para levantar el sello, una interna para dar volumen
        boxShadow: '0 4px 10px rgba(0,0,0,0.4), inset 2px 2px 5px rgba(255,255,255,0.4), inset -2px -2px 5px rgba(0,0,0,0.3)',
        border: '3px solid #750000', // Borde irregular simulado
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 15,
        cursor: 'pointer',
        transition: 'transform 0.3s ease, opacity 0.5s ease',
    },
    sealText: {
        color: '#600000', // Texto grabado oscuro
        fontFamily: '"Cinzel", serif',
        fontSize: '20px',
        fontWeight: 'bold',
        textShadow: '0 1px 1px rgba(255,255,255,0.3)', // Efecto relieve hundido
    },
    hintText: {
        position: 'absolute',
        bottom: '-50px',
        color: '#999',
        fontFamily: '"Montserrat", sans-serif',
        fontSize: '12px',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        animation: 'pulse 2s infinite',
    }
};
