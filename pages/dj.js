import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

// *******************************************************************
// ✅ TUS DATOS CONFIGURADOS (NO TOCAR)
// *******************************************************************
const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdUwUkcF_RHlfHdraWI0Vdca6Or6HxE1M_ykj2mfci_cokyoA/formResponse"; 

const ENTRY_SONG   = "entry.38062662"; 
const ENTRY_ARTIST = "entry.1279581249"; 
const ENTRY_ALBUM  = "entry.2026891459"; 

// Enlace a tu Excel publicado como CSV
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTZ9RxSCBQemScY8lZhfg2Bbi4T5xOoNhTcmENIJSZWFo8yVF0bxd7yXy5gx0HoKIb87-chczYEccKr/pub?output=csv";
// *******************************************************************

export default function DjPage() {
    const router = useRouter();
    
    const [formData, setFormData] = useState({ song: '', artist: '', album: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [playlist, setPlaylist] = useState([]);

    // --- FUNCIÓN: LEER DATOS DE GOOGLE SHEETS ---
    const fetchPlaylist = async () => {
        try {
            // Añadimos timestamp para evitar caché antigua del móvil
            const response = await fetch(`${SHEET_CSV_URL}&t=${Date.now()}`);
            const text = await response.text();
            
            const rows = text.split('\n').slice(1); // Quitamos cabeceras
            
            const tracks = rows.map((row, index) => {
                // Separamos por comas respetando comillas (CSV parser simple)
                const columns = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); 
                const clean = (str) => str ? str.replace(/^"|"$/g, '').trim() : '';

                // Ajustamos índices según el orden estándar de Google Sheets
                // Col 0: Marca temporal | Col 1: Canción | Col 2: Artista | Col 3: Álbum
                return {
                    id: index,
                    song: clean(columns[1]) || "Canción desconocida",
                    artist: clean(columns[2]) || "Desconocido",
                    album: clean(columns[3]) || "Single"
                };
            });

            // Filtramos vacíos y mostramos lo más nuevo arriba
            const validTracks = tracks.filter(t => t.song && t.song !== "Canción desconocida").reverse();
            setPlaylist(validTracks);
            setIsLoading(false);

        } catch (error) {
            console.error("Error cargando lista:", error);
            setIsLoading(false);
        }
    };

    // Cargar al inicio y cada 10 segundos
    useEffect(() => {
        fetchPlaylist();
        const interval = setInterval(fetchPlaylist, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.song) return;

        setIsSubmitting(true);

        // Enviamos datos a Google Form
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
            
            // Feedback visual inmediato (mientras llega al Excel)
            const newTrack = {
                id: Date.now(), 
                song: formData.song,
                artist: formData.artist || 'Desconocido',
                album: formData.album || 'Single'
            };
            setPlaylist(prev => [newTrack, ...prev]);

        } catch (error) {
            console.error("Error enviando");
        }

        setFormData({ song: '', artist: '', album: '' });
        setIsSubmitting(false);
        
        // Recargamos la lista real a los pocos segundos
        setTimeout(fetchPlaylist, 4000);
    };

    return (
        <div className="container">
            <Head>
                <title>DJ Guest List 🎵</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
                <meta name="theme-color" content="#667eea" />
                <link href="https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Poppins:wght@400;600;800&display=swap" rel="stylesheet" />
            </Head>

            {/* FORMULARIO */}
            <div className="form-section">
                <div className="header">
                    <div className="vinyl-icon">💿</div>
                    <h1 className="title">DJ GUEST LIST</h1>
                    <p className="subtitle">¡Pide tu canción y mira qué suena!</p>
                </div>

                <form onSubmit={handleSubmit} className="form-card">
                    <div className="input-group full-width">
                        <label>🎵 Canción</label>
                        <input name="song" value={formData.song} onChange={handleChange} placeholder="Ej: Waka Waka" required autoComplete="off"/>
                    </div>
                    
                    <div className="row-group">
                        <div className="input-group half-width">
                            <label>🎤 Artista</label>
                            <input name="artist" value={formData.artist} onChange={handleChange} placeholder="Shakira" />
                        </div>
                        <div className="input-group half-width">
                            <label>💿 Álbum</label>
                            <input name="album" value={formData.album} onChange={handleChange} placeholder="Sale el Sol" />
                        </div>
                    </div>

                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'ENVIANDO...' : 'AÑADIR A LA PIZARRA ✨'}
                    </button>
                </form>
                
                <button onClick={() => router.push('/homepage')} className="back-btn">← Volver</button>
            </div>

            {/* PIZARRA DE PETICIONES */}
            <div className="board-section">
                <div className="chalkboard">
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px'}}>
                        <h2 className="chalk-title" style={{margin:0}}>PETICIONES</h2>
                        <button onClick={fetchPlaylist} className="refresh-btn">↻</button>
                    </div>
                    <div className="chalk-divider"></div>
                    
                    {isLoading ? (
                        <p style={{textAlign:'center', color:'rgba(255,255,255,0.5)'}}>Cargando lista...</p>
                    ) : (
                        <div className="requests-list">
                            {playlist.length === 0 ? (
                                <p style={{textAlign:'center', opacity:0.5}}>Aún no hay peticiones. ¡Sé el primero!</p>
                            ) : (
                                playlist.map((track) => (
                                    <div key={track.id} className="chalk-item">
                                        <div className="chalk-song">"{track.song}"</div>
                                        <div className="chalk-details">
                                            <span className="artist">🎤 {track.artist}</span>
                                            <span className="separator">|</span>
                                            <span className="album">💿 {track.album}</span>
                                        </div>
                                        <div className="chalk-line"></div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .container { min-height: 100vh; background: #1a202c; display: flex; flex-direction: column; font-family: 'Poppins', sans-serif; }
                .form-section { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; border-bottom-left-radius: 30px; border-bottom-right-radius: 30px; display: flex; flex-direction: column; alignItems: center; box-shadow: 0 10px 30px rgba(0,0,0,0.3); z-index: 10; position: relative; }
                .header { textAlign: center; color: white; margin-bottom: 20px; }
                .vinyl-icon { font-size: 45px; display: inline-block; animation: spin 4s linear infinite; }
                .title { margin: 5px 0; font-size: 26px; font-weight: 800; letter-spacing: 1px; }
                .subtitle { margin: 0; opacity: 0.9; font-size: 13px; }
                .form-card { background: rgba(255, 255, 255, 0.96); padding: 20px; border-radius: 20px; width: 100%; max-width: 400px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
                .input-group { margin-bottom: 15px; }
                .input-group label { display: block; font-size: 11px; font-weight: bold; color: #4a5568; margin-bottom: 6px; text-transform: uppercase; }
                .input-group input { width: 100%; padding: 12px; border-radius: 10px; border: 2px solid #e2e8f0; font-size: 16px; outline: none; box-sizing: border-box; background-color: #f7fafc; font-family: 'Poppins', sans-serif; -webkit-appearance: none; }
                .input-group input:focus { border-color: #667eea; background: #fff; }
                .row-group { display: flex; gap: 10px; }
                .half-width { flex: 1; }
                .submit-btn { width: 100%; padding: 16px; margin-top: 5px; background: #2d3748; color: #fff; border: none; border-radius: 12px; font-size: 16px; font-weight: bold; cursor: pointer; animation: pulse 2s infinite; touch-action: manipulation; }
                .back-btn { background: none; border: none; color: rgba(255,255,255,0.7); margin-top: 15px; padding: 10px; font-size: 14px; }
                .board-section { flex: 1; padding: 20px 15px; display: flex; justifyContent: center; alignItems: flex-start; }
                .chalkboard { width: 100%; max-width: 500px; background: #2b2b2b; border: 10px solid #5D4037; border-radius: 6px; box-shadow: 0 5px 15px rgba(0,0,0,0.5); padding: 20px; color: #fff; font-family: 'Permanent Marker', cursive; min-height: 300px; position: relative; background-image: url("https://www.transparenttextures.com/patterns/black-chalk.png"); }
                .chalk-title { textAlign: center; font-size: 22px; color: rgba(255,255,255,0.9); letter-spacing: 2px; }
                .chalk-divider { height: 2px; background: rgba(255,255,255,0.3); margin-bottom: 15px; border-radius: 50%; }
                .chalk-item { animation: slideIn 0.5s ease-out; margin-bottom: 12px; }
                .chalk-song { font-size: 18px; color: #fff; margin-bottom: 4px; line-height: 1.3; }
                .chalk-details { font-size: 13px; opacity: 0.85; font-family: 'Poppins', sans-serif; display: flex; flex-wrap: wrap; gap: 5px; }
                .artist { color: #f6e05e; }
                .album { color: #63b3ed; }
                .separator { margin: 0 2px; opacity: 0.5; }
                .chalk-line { margin-top: 8px; border-bottom: 1px dashed rgba(255,255,255,0.15); }
                .refresh-btn { background: none; border: 1px solid rgba(255,255,255,0.3); color: white; border-radius: 5px; cursor: pointer; padding: 2px 8px; font-size: 18px; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
                @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.02); } 100% { transform: scale(1); } }
                @media (max-width: 380px) { .row-group { flex-direction: column; gap: 0; } .header { margin-bottom: 15px; } .title { font-size: 22px; } .chalk-song { font-size: 16px; } .chalk-details { font-size: 12px; } }
            `}</style>
        </div>
    );
}
