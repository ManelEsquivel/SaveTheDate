import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';

export default function IntroPage() {
  const router = useRouter();
  const videoRef = useRef(null);
  
  // Estado para controlar la opacidad (fade out)
  const [opacity, setOpacity] = useState(1);

  const handleVideoEnd = () => {
    // 1. Empezar a desvanecer
    setOpacity(0);
    
    // 2. Esperar 1 seg a que se ponga negro y cambiar de página
    setTimeout(() => {
      router.push('/bot_boda_asistente');
    }, 1000);
  };

  // Forzar play por si acaso
  useEffect(() => {
    if(videoRef.current) {
      videoRef.current.play().catch(e => console.error("Autoplay bloqueado:", e));
    }
  }, []);

  return (
    <div style={{ 
      height: '100vh', 
      width: '100vw', 
      backgroundColor: 'black',
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      transition: 'opacity 1s ease-in-out', // La magia del desvanecimiento
      opacity: opacity 
    }}>
      <video
        ref={videoRef}
        autoPlay
        muted        // <--- CRÍTICO: Si quitas esto, no arranca solo
        playsInline  // <--- CRÍTICO: Si quitas esto, falla en iPhone
        onEnded={handleVideoEnd}
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover' 
        }}
      >
        {/* Como ya confirmamos que el video carga, esta ruta es la buena: */}
        <source src="/wedding-intro.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
