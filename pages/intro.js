import { useRouter } from 'next/router'; // O 'next/navigation' si usas app directory
import { useState, useEffect, useRef } from 'react';

export default function IntroPage() {
  const router = useRouter();
  const videoRef = useRef(null);
  
  const handleVideoEnd = () => {
    // Cuando acaba, vamos a la siguiente página
    router.push('/bot_boda_asistente');
  };

  useEffect(() => {
    // Intentamos forzar el play cuando la página carga
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Autoplay bloqueado por el navegador:", error);
          // Si entra aquí, es que el navegador requiere clic del usuario
        });
      }
    }
  }, []);

  return (
    <div style={{ height: '100vh', width: '100vw', backgroundColor: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      
      <video
        ref={videoRef}
        width="100%"
        height="100%"
        
        // 1. ATRIBUTOS CRÍTICOS
        autoPlay
        muted        // OBLIGATORIO
        playsInline  // OBLIGATORIO PARA MOVIL
        preload="auto" // Ayuda a cargar rápido
        
        // 2. DEJA ESTO ACTIVADO TEMPORALMENTE
        controls={true} // Esto mostrará la barra de play/pausa.
        
        onEnded={handleVideoEnd}
        style={{ objectFit: 'cover' }}
      >
        {/* 3. LA RUTA EXACTA (Fíjate en la barra al inicio) */}
        <source src="/wedding-intro.mp4" type="video/mp4" />
        
        <p style={{color: 'white'}}>Tu navegador no soporta video o la ruta está mal.</p>
      </video>

    </div>
  );
}
