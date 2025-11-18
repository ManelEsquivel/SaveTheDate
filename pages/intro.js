import { useRouter } from 'next/router'; // O 'next/navigation' si usas la carpeta 'app'
import { useEffect, useRef } from 'react';

export default function IntroPage() {
  const router = useRouter();
  const playerRef = useRef(null);

  useEffect(() => {
    // 1. Cargar la API de YouTube manualmente (ya que no podemos instalar librerías)
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // 2. Esta función se ejecuta automáticamente cuando la API de YouTube está lista
    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('youtube-player', {
        videoId: 'VDqdb9hQZMc', // TU VIDEO ID
        playerVars: {
          autoplay: 1,      // Autoplay
          mute: 1,          // OBLIGATORIO para que arranque solo en móviles
          controls: 0,      // Sin barra de control
          showinfo: 0,      // Sin titulo
          rel: 0,           // Sin videos recomendados al final
          playsinline: 1,   // Para iPhone
          modestbranding: 1 // Menos logos
        },
        events: {
          'onStateChange': onPlayerStateChange
        }
      });
    };

    // Limpieza al salir
    return () => {
      window.onYouTubeIframeAPIReady = null;
    };
  }, []);

  // 3. Función que vigila el video. Cuando acaba (data === 0), redirige.
  const onPlayerStateChange = (event) => {
    if (event.data === 0) { // 0 significa "Ended" (Terminado)
      router.push('/bot_boda_asistente');
    }
  };

  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw', 
      height: '100vh', 
      backgroundColor: 'black', 
      zIndex: 9999,
      overflow: 'hidden'
    }}>
      {/* Contenedor que evita que se pueda clicar encima del video */}
      <div style={{ 
        width: '100%', 
        height: '100%', 
        pointerEvents: 'none' // Esto evita pausar el video por error con el dedo
      }}>
        {/* YouTube inyectará el video AQUÍ dentro de este div */}
        <div id="youtube-player" style={{ width: '100%', height: '100%' }}></div>
      </div>
    </div>
  );
}
