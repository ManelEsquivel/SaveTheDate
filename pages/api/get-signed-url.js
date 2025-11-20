// pages/api/get-signed-url.js (SOLUCIÓN DE SINCRONIZACIÓN)

const { adminApp } = require('../../lib/firebase'); 

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido.' });
  }

  if (!adminApp) {
    return res.status(500).json({ message: 'Error interno: Admin SDK no inicializado.' });
  }

  // Recibimos nombre Y tipo de archivo
  const { fileName, fileType } = req.body;
  
  if (!fileName || !fileType) {
    return res.status(400).json({ message: 'Faltan datos del archivo (nombre o tipo).' });
  }

  try {
    const bucket = adminApp.storage().bucket();
    const file = bucket.file(`bodas/${fileName}`);

    // Configuración para la URL firmada
    const options = {
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutos
      contentType: fileType, // ⚠️ FIRMAMOS CON EL TIPO EXACTO DEL ARCHIVO
    };

    const [url] = await file.getSignedUrl(options);

    res.status(200).json({ url });
  } catch (error) {
    console.error('Error generando URL:', error);
    res.status(500).json({ message: `Error al generar URL: ${error.message}` });
  }
}
