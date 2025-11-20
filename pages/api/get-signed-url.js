// pages/api/get-signed-url.js

// Usamos el SDK de Admin para generar la URL segura
const admin = require('firebase-admin');
const { storage } = require('../../lib/firebase'); // Usamos la inicialización ya corregida

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido.' });
  }

  const { fileName } = req.body;
  if (!fileName) {
    return res.status(400).json({ message: 'Falta el nombre del archivo.' });
  }

  try {
    // Obtenemos el bucket (Necesario para la función createWriteStream)
    const bucket = admin.storage().bucket(storage.app.options.storageBucket);
    const file = bucket.file(`bodas/${fileName}`);

    // Configuración para la URL firmada (expira en 5 minutos)
    const options = {
      version: 'v4',
      action: 'write',
      expires: Date.now() + 5 * 60 * 1000, // 5 minutos de validez
      contentType: 'application/octet-stream', // Permitir cualquier tipo de archivo
    };

    // Generar la URL
    const [url] = await file.getSignedUrl(options);

    res.status(200).json({ url, fileName });
  } catch (error) {
    console.error('Error al generar URL firmada:', error);
    res.status(500).json({ message: 'Error interno de autenticación para Storage.' });
  }
}
