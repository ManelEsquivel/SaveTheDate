// pages/api/get-signed-url.js (FINAL ROBUSTA)

// Importamos la instancia del Admin App directamente
const { adminApp } = require('../../lib/firebase'); 

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido.' });
  }

  // 1. Verificación de Autenticación del Servidor
  if (!adminApp) {
    console.error('ERROR: Admin SDK no inicializado. Faltan variables de entorno.');
    return res.status(500).json({ message: 'Error interno del servidor: Credenciales de Firebase Admin incompletas.' });
  }

  const { fileName } = req.body;
  if (!fileName) {
    return res.status(400).json({ message: 'Falta el nombre del archivo.' });
  }

  try {
    // 2. Usar la instancia del Admin App para acceder a Storage
    const bucket = adminApp.storage().bucket();
    const file = bucket.file(`bodas/${fileName}`);

    // 3. Configuración para la URL firmada (FIX FINAL DE CONTENT-TYPE)
    const options = {
      version: 'v4',
      action: 'write',
      expires: Date.now() + 5 * 60 * 1000, 
      contentType: 'application/octet-stream', 
      // ✅ Solución final: Incluimos el encabezado Content-Type que el cliente usará.
      headers: {
          'Content-Type': 'application/octet-stream' 
      }
    };

    // 4. Generar la URL
    const [url] = await file.getSignedUrl(options);

    res.status(200).json({ url, fileName });
  } catch (error) {
    console.error('Error al generar URL firmada. Posiblemente permisos:', error);
    res.status(500).json({ message: 'Error interno de autenticación para Storage. Revisa tus variables y el rol de tu Service Account.' });
  }
}
