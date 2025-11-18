import { useRouter } from 'next/router'; // O 'next/navigation' si usas App Router
import { useEffect, useRef, useState } from 'react';

export default function IntroPage() {
  const router = useRouter();
  const playerRef = useRef(null);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('youtube-player', {
        videoId: 'XZ8ktV9YgCQ', // <--- NUEVO VIDEO ID ACTUALIZADO
        playerVars: {
          autoplay: 0,
          controls: 0,
          showinfo: 0,
          rel: 0,
          playsinline: 1,
          modestbranding: 1,
          loop: 0,
          fs: 0
        },
        events: {
          'onStateChange': onPlayerStateChange
        }
      });
    };

    return () => {
      window.onYouTubeIframeAPIReady = null;
    };
  }, []);

  const startExperience = () => {
    if (playerRef.current && playerRef.current.playVideo) {
      setIsStarted(true);
      playerRef.current.unMute();   // Activa el sonido
      playerRef.current.setVolume(100);
      playerRef.current.playVideo();
    }
  };

  const onPlayerStateChange = (event) => {
    if (event.data === 0) { 
      router.push('/bot_boda_asistente');
    }
  };

  return (
    <div style={{ 
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
      backgroundColor: 'black', zIndex: 9999, overflow: 'hidden',
      display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>

      {/* --- PANTALLA DE BIENVENIDA --- */}
      {!isStarted && (
        <div 
          onClick={startExperience}
          style={{
            position: 'absolute', zIndex: 100, top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'black',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            color: 'white', cursor: 'pointer'
          }}
        >
          <h1 style={{ fontFamily: 'serif', fontSize: '2rem', marginBottom: '20px', textAlign: 'center' }}>
            Manel & Carla
          </h1>
          
          {/* BOTÓN CON EL NUEVO TEXTO */}
          <div style={{
            padding: '12px 24px', 
            border: '1px solid white', 
            borderRadius: '4px', 
            textTransform: 'uppercase', 
            letterSpacing: '2px', 
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            Entrar al asistente  {/* <--- TEXTO CAMBIADO AQUÍ */}
          </div>
          
          <p style={{ marginTop: '20px', fontSize: '0.8rem', opacity: 0.6 }}>
            (Toca para comenzar)
          </p>
        </div>
      )}

      {/* --- VIDEO YOUTUBE CON ZOOM --- */}
      <div style={{ 
        width: '100%', 
        height: '100%', 
        pointerEvents: 'none',
        transform: 'scale(1.4)', 
        opacity: isStarted ? 1 : 0,
        transition: 'opacity 1s'
      }}>
        <div id="youtube-player" style={{ width: '100%', height: '100%' }}></div>
      </div>

    </div>
  );
}
