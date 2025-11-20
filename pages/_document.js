import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="es">
        <Head>
          {/* Este bloque inyecta el script del CDN de Firebase en el <head> del HTML.
            La sintaxis 'dangerouslySetInnerHTML={{ __html: `...` }}' es necesaria
            para inyectar código JS/HTML puro dentro de JSX.
          */}
          <script
            type="module"
            // Nota la DOBLE LLAVE: {{ ... }}
            dangerouslySetInnerHTML={{
              __html: `
                // --- URLs del SDK de Firebase (versión moderna) con CDN ---
                import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
                import { getStorage, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-storage.js";

                // --- Tu Configuración ---
                const firebaseConfig = {
                  apiKey: "AIzaSyDlYPq0WoXY5q8evJTdMX5ABd3nV_IISr0",
                  authDomain: "boda-74934.firebaseapp.com",
                  projectId: "boda-74934",
                  storageBucket: "boda-74934.appspot.com", 
                  messagingSenderId: "154296508162",
                  appId: "1:154296508162:web:10a93aebd7960b31a02c1b"
                }; 

                // --- Inicialización y Exposición Global ---
                const app = initializeApp(firebaseConfig);
                
                // Hacemos las funciones accesibles globalmente (window)
                window.storage = getStorage(app); 
                window.storageRef = ref;
                window.uploadBytes = uploadBytes;
              `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
