import { useRouter } from 'next/router'; // O 'next/navigation'
import { useEffect } from 'react';

export default function IntroPage() {
  const router = useRouter();

  useEffect(() => {
    // Buscamos el video manualmente una vez que se ha "inyectado"
    const videoElement = document.getElementById('intro-video-player');

    if (videoElement) {
      // 1. Forzamos reproducción silenciosa
      videoElement.muted = true;
      videoElement.play().catch(e => console.log("Forzando play:", e));

      // 2. Escuchamos cuando termina para redirigir
      videoElement.onended = () => {
        // Efecto visual de salida (opcional)
        videoElement.style.opacity = '0';
        setTimeout(() => {
          router.push('/bot_boda_asistente');
        }, 1000);
      };
    }
  }, []);

  // El código HTML del video en texto plano para engañar a React
  const videoHTML = `
    <video
      id="intro-video-player"
      src="/wedding-intro.mp4"
      autoplay
      muted
      playsinline
      style="width: 100%; height: 100%; object-fit: cover; transition: opacity 1s;"
    ></video>
  `;

  return (
    <div 
      style={{ 
        height: '100vh', 
        width: '100vw', 
        backgroundColor: 'black', 
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
      // AQUÍ ESTÁ LA MAGIA: Inyectamos el HTML directamente
      dangerouslySetInnerHTML={{ __html: videoHTML }}
    />
  );
}
