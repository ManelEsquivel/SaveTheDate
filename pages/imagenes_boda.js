import React, { useState, useRef, useEffect } from 'react';

export default function ImagenesBoda() {
    const [files, setFiles] = useState([]);
    const [galleryPhotos, setGalleryPhotos] = useState([]); 
    const [nextPageToken, setNextPageToken] = useState(null); // Token para cargar más
    const [isLoadingGallery, setIsLoadingGallery] = useState(false);
    
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    // --- FUNCIÓN INTELIGENTE DE CARGA DE GALERÍA ---
    const fetchGallery = async (token = null, reset = false) => {
        setIsLoadingGallery(true);
        try {
            // Construimos la URL con el token si existe
            let url = '/api/get-photos';
            if (token) url += `?pageToken=${token}`;

            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                
                if (reset) {
                    // Si es reset (después de subir), reemplazamos todo
                    setGalleryPhotos(data.photos);
                } else {
                    // Si es "ver más", añadimos a lo que ya hay
                    setGalleryPhotos(prev => [...prev, ...data.photos]);
                }
                
                // Guardamos el token para la próxima vez (o null si no hay más)
                setNextPageToken(data.nextPageToken);
            }
        } catch (error) {
            console.error("Error cargando galería:", error);
        } finally {
            setIsLoadingGallery(false);
        }
    };

    // Carga inicial
    useEffect(() => {
        fetchGallery();
    }, []);

    // Manejador del botón "Ver más fotos"
    const handleLoadMore = () => {
        if (nextPageToken) {
            fetchGallery(nextPageToken, false);
        }
    };

    // --- UI HANDLERS (Drag & Drop) ---
    const handleZoneClick = () => fileInputRef.current.click();
    const handleFileSelect = (e) => {
        if (e.target.files?.length) setFiles(prev => [...prev, ...Array.from(e.target.files)]);
    };
    const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = () => { setIsDragging(false); };
    const handleDrop = (e) => {
        e.preventDefault(); setIsDragging(false);
        if (e.dataTransfer.files?.length) setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
    };
    const handleRemoveFile = (index) => setFiles(prev => prev.filter((_, i) => i !== index));

    // --- LÓGICA DE SUBIDA ---
    const sendFileToServer = async (file) => {
        const typeToSend = file.type || 'application/octet-stream';
        const urlResponse = await fetch('/api/get-signed-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileName: file.name, fileType: typeToSend }), 
        });
        if (!urlResponse.ok) throw new Error('Fallo al obtener permiso.');
        const { url } = await urlResponse.json();
        
        const uploadResponse = await fetch(url, {
            method: 'PUT', 
            headers: { 'Content-Type': typeToSend },
            body: file,
        });
        if (!uploadResponse.ok) throw new Error(`Error subiendo: ${uploadResponse.status}`);
    };

    const handleSubmit = async () => {
        if (files.length === 0) return alert("Selecciona una foto.");
        setUploading(true);
        try {
            await Promise.all(files.map(file => sendFileToServer(file)));
            alert(`🎉 ¡Éxito! Se subieron ${files.length} fotos.`);
            setFiles([]); 
            // Recargar galería desde cero para ver las nuevas
            setTimeout(() => fetchGallery(null, true), 1000); 
        } catch (error) {
            console.error(error);
            alert(`Error: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={styles.pageContainer}>
            <div style={styles.card}>
                <h1 style={styles.title}>Sube tus Fotos</h1>
                <p style={styles.subtitle}>Comparte tus recuerdos de la boda</p>
                
                <div 
                    style={{ ...styles.dropZone, ...(isDragging ? styles.dropZoneActive : {}) }}
                    onClick={handleZoneClick}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div style={styles.iconContainer}>📸</div>
                    <p style={styles.dropText}>{isDragging ? '¡Suelta aquí!' : 'Toca para seleccionar fotos'}</p>
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} style={{display:'none'}} multiple accept="image/*" />
                </div>
                
                {files.length > 0 && (
                    <div style={styles.fileListContainer}>
                        <ul style={styles.fileList}>
                            {files.map((f, i) => (
                                <li key={i} style={styles.fileItem}>
                                    <span style={styles.fileName}>{f.name}</span>
                                    <button onClick={() => handleRemoveFile(i)} style={styles.removeBtn}>✕</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <button onClick={handleSubmit} style={{...styles.submitBtn, opacity: uploading ? 0.7 : 1}} disabled={uploading || !files.length}>
                    {uploading ? 'Subiendo...' : 'Enviar Fotos'}
                </button>
            </div>

            {/* --- GALERÍA CON PAGINACIÓN --- */}
            <div style={styles.galleryContainer}>
                <h2 style={styles.galleryTitle}>📸 Galería de la Boda</h2>
                
                <div style={styles.grid}>
                    {galleryPhotos.length === 0 ? (
                        <p style={{color: '#888', width: '100%', gridColumn: '1/-1'}}>Aún no hay fotos.</p>
                    ) : (
                        galleryPhotos.map((photo, index) => (
                            <div key={index} style={styles.gridItem}>
                                <img src={photo.url} alt="Boda" style={styles.image} loading="lazy" />
                            </div>
                        ))
                    )}
                </div>

                {/* Botón Cargar Más */}
                {nextPageToken && (
                    <button 
                        onClick={handleLoadMore} 
                        style={styles.loadMoreBtn}
                        disabled={isLoadingGallery}
                    >
                        {isLoadingGallery ? 'Cargando...' : 'Ver más fotos'}
                    </button>
                )}
            </div>
        </div>
    );
}

const styles = {
    pageContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f2f5', fontFamily: 'sans-serif', padding: '20px 10px' },
    card: { backgroundColor: 'white', borderRadius: '12px', padding: '30px', width: '100%', maxWidth: '450px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginBottom: '40px' },
    title: { margin: '0 0 10px 0', color: '#333' },
    subtitle: { margin: '0 0 20px 0', color: '#666', fontSize: '14px' },
    dropZone: { border: '2px dashed #ccc', borderRadius: '8px', padding: '40px 20px', cursor: 'pointer', backgroundColor: '#fafafa' },
    dropZoneActive: { borderColor: '#5a67d8', backgroundColor: '#eef2ff' },
    iconContainer: { marginBottom: '15px', fontSize: '24px' },
    dropText: { margin: 0, color: '#888' },
    submitBtn: { width: '100%', padding: '12px', marginTop: '20px', borderRadius: '8px', border: 'none', backgroundColor: '#5a67d8', color: 'white', fontWeight: 'bold', cursor: 'pointer' },
    fileListContainer: { marginTop: '20px', textAlign: 'left', maxHeight: '100px', overflowY: 'auto' },
    fileList: { listStyle: 'none', padding: 0, margin: 0 },
    fileItem: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '5px 0', borderBottom: '1px solid #eee' },
    fileName: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' },
    removeBtn: { background: 'none', border: 'none', color: 'red', cursor: 'pointer' },
    
    // Estilos Galería
    galleryContainer: { width: '100%', maxWidth: '800px', textAlign: 'center', paddingBottom: '40px' },
    galleryTitle: { color: '#333', marginBottom: '20px', fontSize: '20px' },
    grid: { 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
        gap: '10px',
        width: '100%'
    },
    gridItem: { 
        backgroundColor: '#fff', 
        borderRadius: '8px', 
        overflow: 'hidden', 
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        aspectRatio: '1 / 1' 
    },
    image: { width: '100%', height: '100%', objectFit: 'cover' },
    
    // Botón Ver Más
    loadMoreBtn: {
        marginTop: '20px',
        padding: '10px 20px',
        backgroundColor: 'transparent',
        border: '2px solid #5a67d8',
        color: '#5a67d8',
        borderRadius: '20px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'all 0.2s'
    }
};
