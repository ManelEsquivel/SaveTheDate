import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

// *******************************************************************
// ⚠️ TUS DATOS DE GOOGLE FORMS ⚠️
// *******************************************************************
const FORM_URL = "https://docs.google.com/forms/d/e/TU_ID_AQUI/formResponse"; 
const ENTRY_SONG   = "entry.111111111"; 
const ENTRY_ARTIST = "entry.222222222"; 
const ENTRY_ALBUM  = "entry.333333333"; 
// *******************************************************************

export default function DjPage() {
    const router = useRouter();
    
    const [formData, setFormData] = useState({ song: '', artist: '', album: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

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

        const newTrack = {
            id: Date.now(),
            song: formData.song,
            artist: formData.artist || 'Desconocido',
            album: formData.album || 'Single'
        };
        
        setPlaylist(prev => [newTrack, ...prev]);

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
            console.error("Error local.");
        }

        setFormData({ song: '', artist: '', album: '' });
        setIsSubmitting(false);
    };

    return (
        <div className="container">
            <Head>
                <title>DJ Colaborativo 🎵</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
                <meta name="theme-color" content="#667eea" />
                <link href="https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Poppins:wght@400;600;800&display=swap" rel="stylesheet" />
            </Head>

            {/* --- SECCIÓN SUPERIOR: FORMULARIO --- */}
            <div className="form-section">
                <div className="header">
                    <div className="vinyl-icon">💿</div>
                    <h1 className="title">DJ GUEST LIST</h1>
                    <p className="subtitle">¡Tú eres el DJ! Pide ese temazo.</p>
                </div>

                <form onSubmit={handleSubmit} className="form-card">
                    <div className="input-group full-width">
                        <label>🎵 Canción</label>
                        <input 
                            name="song" 
                            value={formData.song} 
                            onChange={handleChange} 
                            placeholder="Ej: Waka Waka" 
                            required
                            autoComplete="off"
                        />
                    </div>
                    
                    <div className="row-group">
                        <div className="input-group half-width">
                            <label>🎤 Artista</label>
                            <input 
                                name="artist" 
                                value={formData.artist} 
                                onChange={handleChange} 
                                placeholder="Shakira" 
                            />
                        </div>
                        <div className="input-group half-width">
                            <label>💿 Álbum</label>
                            <input 
                                name="album" 
                                value={formData.album} 
                                onChange={handleChange} 
                                placeholder="Sale el Sol" 
                            />
                        </div>
                    </div>

                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'ENVIANDO...' : 'AÑADIR A LA PIZARRA ✨'}
                    </button>
                </form>
                
                <button onClick={() => router.push('/homepage')} className="back-btn">
                    ← Volver al Menú
                </button>
            </div>

            {/* --- SECCIÓN INFERIOR: PIZARRA --- */}
            <div className="board-section">
                <div className="chalkboard">
                    <h2 className="chalk-title">PETICIONES</h2>
                    <div className="chalk-divider"></div>
                    
                    <div className="requests-list">
                        {playlist.map((track) => (
                            <div key={track.id} className="chalk-item">
                                <div className="chalk-song">"{track.song}"</div>
                                <div className="chalk-details">
                                    <span className="artist">🎤 {track.artist}</span>
                                    <span className="separator">|</span>
                                    <span className="album">💿 {track.album}</span>
                                </div>
                                <div className="chalk-line"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- ESTILOS CSS RESPONSIVE --- */}
            <style jsx>{`
                /* Layout General */
                .container {
                    min-height: 100vh;
                    background: #1a202c;
                    display: flex;
                    flex-direction: column;
                    font-family: 'Poppins', sans-serif;
                }

                /* Sección Formulario */
                .form-section {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: 30px 20px; /* Padding más cómodo en móvil */
                    border-bottom-left-radius: 30px;
                    border-bottom-right-radius: 30px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    z-index: 10;
                    position: relative;
                }

                .header { textAlign: center; color: white; margin-bottom: 20px; }
                .vinyl-icon { 
                    font-size: 45px; 
                    display: inline-block; 
                    animation: spin 4s linear infinite; 
                }
                .title { 
                    margin: 5px 0; 
                    font-size: 26px; /* Un poco más pequeño para evitar saltos de línea */
                    font-weight: 800; 
                    letter-spacing: 1px; 
                }
                .subtitle { margin: 0; opacity: 0.9; font-size: 13px; }

                /* Tarjeta del Formulario */
                .form-card {
                    background: rgba(255, 255, 255, 0.96);
                    padding: 20px;
                    border-radius: 20px;
                    width: 100%;
                    max-width: 400px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                }

                .input-group { margin-bottom: 15px; }
                .input-group label {
                    display: block;
                    font-size: 11px;
                    font-weight: bold;
                    color: #4a5568;
                    margin-bottom: 6px;
                    text-transform: uppercase;
                }

                .input-group input {
                    width: 100%;
                    padding: 12px;
                    border-radius: 10px;
                    border: 2px solid #e2e8f0;
                    font-size: 16px; /* CRUCIAL PARA IPHONE (evita zoom) */
                    outline: none;
                    box-sizing: border-box;
                    background-color: #f7fafc;
                    font-family: 'Poppins', sans-serif;
                    transition: border-color 0.2s;
                    -webkit-appearance: none; /* Elimina estilos nativos iOS */
                }
                
                .input-group input:focus {
                    border-color: #667eea;
                    background: #fff;
                }

                .row-group {
                    display: flex;
                    gap: 10px;
                }
                
                .half-width { flex: 1; }

                .submit-btn {
                    width: 100%;
                    padding: 16px;
                    margin-top: 5px;
                    background: #2d3748;
                    color: #fff;
                    border: none;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                    animation: pulse 2s infinite;
                    touch-action: manipulation; /* Mejora respuesta táctil */
                }

                .back-btn {
                    background: none;
                    border: none;
                    color: rgba(255,255,255,0.7);
                    margin-top: 15px;
                    padding: 10px;
                    font-size: 14px;
                }

                /* Sección Pizarra */
                .board-section {
                    flex: 1;
                    padding: 20px 15px; /* Menos padding lateral en móvil */
                    display: flex;
                    justify-content: center;
                    align-items: flex-start;
                }

                .chalkboard {
                    width: 100%;
                    max-width: 500px;
                    background: #2b2b2b;
                    border: 10px solid #5D4037; /* Borde un poco más fino */
                    border-radius: 6px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.5);
                    padding: 20px;
                    color: #fff;
                    font-family: 'Permanent Marker', cursive;
                    min-height: 300px;
                    position: relative;
                    background-image: url("https://www.transparenttextures.com/patterns/black-chalk.png");
                }

                .chalk-title {
                    text-align: center;
                    font-size: 22px;
                    margin: 0 0 10px 0;
                    color: rgba(255,255,255,0.9);
                    letter-spacing: 2px;
                }

                .chalk-divider {
                    height: 2px;
                    background: rgba(255,255,255,0.3);
                    margin-bottom: 15px;
                    border-radius: 50%;
                }

                .chalk-item { animation: slideIn 0.5s ease-out; margin-bottom: 12px; }
                
                .chalk-song {
                    font-size: 18px; /* Tamaño legible pero ajustado */
                    color: #fff;
                    margin-bottom: 4px;
                    line-height: 1.3;
                }

                .chalk-details {
                    font-size: 13px;
                    opacity: 0.85;
                    font-family: 'Poppins', sans-serif;
                    display: flex;
                    flex-wrap: wrap; /* Permite que los detalles bajen si no caben */
                    gap: 5px;
                }
                
                .artist { color: #f6e05e; }
                .album { color: #63b3ed; }
                .separator { margin: 0 2px; opacity: 0.5; }

                .chalk-line {
                    margin-top: 8px;
                    border-bottom: 1px dashed rgba(255,255,255,0.15);
                }

                /* Animaciones */
                @keyframes spin { 100% { transform: rotate(360deg); } }
                @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.02); } 100% { transform: scale(1); } }

                /* MEDIA QUERIES PARA PANTALLAS MUY PEQUEÑAS */
                @media (max-width: 380px) {
                    .row-group {
                        flex-direction: column; /* Apilar artista y album verticalmente */
                        gap: 0;
                    }
                    .header { margin-bottom: 15px; }
                    .title { font-size: 22px; }
                    .chalk-song { font-size: 16px; }
                    .chalk-details { font-size: 12px; }
                }
            `}</style>
        </div>
    );
}
