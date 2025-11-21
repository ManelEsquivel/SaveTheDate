import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

// *******************************************************************
// ⚠️ TUS DATOS DE GOOGLE FORMS ⚠️
// *******************************************************************
const FORM_URL = "https://docs.google.com/forms/d/e/TU_ID_AQUI/formResponse"; 

const ENTRY_SONG   = "entry.111111111"; 
const ENTRY_ARTIST = "entry.222222222"; 
const ENTRY_ALBUM  = "entry.333333333"; // Nuevo campo Álbum
// *******************************************************************

export default function DjPage() {
    const router = useRouter();
    
    // Estado del formulario
    const [formData, setFormData] = useState({ song: '', artist: '', album: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Estado de la Pizarra (Playlist)
    // Inicializamos con algunas canciones de ejemplo para que la pizarra no se vea triste vacía
    const [playlist, setPlaylist] = useState([
        { id: 1, song: "I Gotta Feeling", artist: "The Black Eyed Peas", album: "The E.N.D." },
        { id: 2, song: "Sarandonga", artist: "Lolita", album: "Lola, Lolita, Lola" },
        { id: 3, song: "Flying Free", artist: "Pont Aeri", album: "Flying Free" }
    ]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.song) return;

        setIsSubmitting(true);

        // 1. Añadimos VISUALMENTE a la pizarra (Efecto inmediato)
        const newTrack = {
            id: Date.now(),
            song: formData.song,
            artist: formData.artist || 'Desconocido',
            album: formData.album || 'Single'
        };
        
        // Añadimos al principio de la lista
        setPlaylist(prev => [newTrack, ...prev]);

        // 2. Enviamos a Google Forms (En segundo plano)
        const formBody = new URLSearchParams();
        formBody.append(ENTRY_SONG, formData.song);
        formBody.append(ENTRY_ARTIST, formData.artist);
        formBody.append(ENTRY_ALBUM, formData.album);

        try {
            await fetch(FORM_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formBody
            });
        } catch (error) {
            console.error("Error enviando a Google, pero la pizarra se actualizó localmente.");
        }

        // 3. Reset del formulario y animación
        setFormData({ song: '', artist: '', album: '' });
        setIsSubmitting(false);
    };

    return (
        <div style={styles.container}>
            <Head>
                <title>DJ Colaborativo 🎵</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                <meta name="theme-color" content="#1a202c" />
                {/* Importamos fuente estilo Tiza (Permanent Marker) y estilo moderno (Poppins) */}
                <link href="https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Poppins:wght@400;600;800&display=swap" rel="stylesheet" />
            </Head>

            {/* --- SECCIÓN SUPERIOR: EL FORMULARIO (MODERNO) --- */}
            <div style={styles.formSection}>
                <div style={styles.header}>
                    <div style={styles.vinylIcon}>💿</div>
                    <h1 style={styles.title}>DJ GUEST LIST</h1>
                    <p style={styles.subtitle}>¡Tú eres el DJ! Pide ese temazo.</p>
                </div>

                <form onSubmit={handleSubmit} style={styles.formCard}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>🎵 Canción</label>
                        <input 
                            name="song" 
                            value={formData.song} 
                            onChange={handleChange} 
                            placeholder="Ej: Waka Waka" 
                            style={styles.input} 
                            required
                        />
                    </div>
                    
                    <div style={styles.row}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>🎤 Artista</label>
                            <input 
                                name="artist" 
                                value={formData.artist} 
                                onChange={handleChange} 
                                placeholder="Shakira" 
                                style={styles.input} 
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>💿 Álbum</label>
                            <input 
                                name="album" 
                                value={formData.album} 
                                onChange={handleChange} 
                                placeholder="Sale el Sol" 
                                style={styles.input} 
                            />
                        </div>
                    </div>

                    <button type="submit" style={styles.submitBtn} disabled={isSubmitting}>
                        {isSubmitting ? 'ENVIANDO...' : 'AÑADIR A LA PIZARRA ✨'}
                    </button>
                </form>
                
                <button onClick={() => router.push('/homepage')} style={styles.backButton}>
                    ← Volver al Menú
                </button>
            </div>

            {/* --- SECCIÓN INFERIOR: LA PIZARRA (CHALKBOARD) --- */}
            <div style={styles.boardSection}>
                <div style={styles.chalkboard}>
                    <h2 style={styles.chalkTitle}>PETICIONES DE HOY</h2>
                    <div style={styles.chalkDivider}></div>
                    
                    <div style={styles.requestsList}>
                        {playlist.map((track) => (
                            <div key={track.id} style={styles.chalkItem}>
                                <div style={styles.chalkSong}>"{track.song}"</div>
                                <div style={styles.chalkDetails}>
                                    <span style={{color: '#f6e05e'}}>🎤 {track.artist}</span>
                                    <span style={{margin: '0 5px'}}>|</span>
                                    <span style={{color: '#63b3ed'}}>💿 {track.album}</span>
                                </div>
                                <div style={styles.chalkLine}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- ESTILOS CSS EN JAVASCRIPT --- */}
            <style jsx global>{`
                /* Animación del disco girando */
                @keyframes spin { 100% { transform: rotate(360deg); } }
                /* Animación de entrada de la pizarra */
                @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                /* Animación de pulso botón */
                @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
            `}</style>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        background: '#1a202c', // Fondo oscuro general
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Poppins', sans-serif",
    },
    // --- PARTE DE ARRIBA (FORM) ---
    formSection: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '30px 20px',
        borderBottomLeftRadius: '30px',
        borderBottomRightRadius: '30px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        zIndex: 10,
    },
    header: { textAlign: 'center', color: 'white', marginBottom: '20px' },
    vinylIcon: { fontSize: '50px', display: 'inline-block', animation: 'spin 4s linear infinite' },
    title: { margin: '10px 0 5px', fontSize: '28px', fontWeight: '800', letterSpacing: '1px' },
    subtitle: { margin: 0, opacity: 0.9, fontSize: '14px' },
    formCard: {
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '25px',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    },
    inputGroup: { marginBottom: '15px', width: '100%' },
    row: { display: 'flex', gap: '10px' },
    label: { display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#4a5568', marginBottom: '5px', textTransform: 'uppercase' },
    input: {
        width: '100%',
        padding: '12px',
        borderRadius: '10px',
        border: '2px solid #e2e8f0',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box',
        backgroundColor: '#f7fafc',
        fontFamily: "'Poppins', sans-serif",
    },
    submitBtn: {
        width: '100%',
        padding: '15px',
        marginTop: '10px',
        background: '#2d3748',
        color: '#fff',
        border: 'none',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        animation: 'pulse 2s infinite',
    },
    backButton: { background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', marginTop: '20px', cursor: 'pointer' },

    // --- PARTE DE ABAJO (PIZARRA) ---
    boardSection: {
        flex: 1,
        padding: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    chalkboard: {
        width: '100%',
        maxWidth: '500px',
        background: '#2b2b2b', // Color pizarra oscuro
        border: '12px solid #5D4037', // Marco de madera
        borderRadius: '8px',
        boxShadow: '0 10px 20px rgba(0,0,0,0.5)',
        padding: '20px',
        color: '#fff',
        fontFamily: "'Permanent Marker', cursive", // Fuente tipo Tiza
        minHeight: '300px',
        position: 'relative',
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/black-chalk.png")', // Textura sutil si carga
    },
    chalkTitle: {
        textAlign: 'center',
        fontSize: '24px',
        margin: '0 0 10px 0',
        color: 'rgba(255,255,255,0.9)',
        textShadow: '2px 2px 0px rgba(255,255,255,0.1)',
        letterSpacing: '2px',
    },
    chalkDivider: {
        height: '2px',
        background: 'rgba(255,255,255,0.3)',
        marginBottom: '20px',
        borderRadius: '50%',
    },
    requestsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    chalkItem: {
        animation: 'slideIn 0.5s ease-out',
    },
    chalkSong: {
        fontSize: '20px',
        color: '#fff',
        marginBottom: '5px',
    },
    chalkDetails: {
        fontSize: '14px',
        opacity: 0.8,
        fontFamily: "'Poppins', sans-serif", // Usamos la fuente normal para que se lea mejor los detalles
    },
    chalkLine: {
        marginTop: '10px',
        borderBottom: '1px dashed rgba(255,255,255,0.2)',
    }
};
