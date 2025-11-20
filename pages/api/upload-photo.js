// pages/api/upload-photo.js

import formidable from 'formidable'; 
import { ref, uploadBytes } from 'firebase/storage';
// Usaremos el módulo 'fs' de Node.js, pero lo importamos de forma nativa para mayor estabilidad
const fs = require('fs'); 

// Necesario para la ruta de importación de Firebase
const { storage } = require('../../lib/firebase'); 

// Deshabilitamos el parser de body de Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido.' });
  }

  const form = formidable({});

  try {
    const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) return reject(err);
            resolve({ fields, files });
        });
    });

    const file = files.photos && files.photos[0]; 

    if (!file) {
        return res.status(400).json({ message: 'No se encontró ningún archivo.' });
    }

    // 1. LECTURA SIMPLE Y DIRECTA DEL BUFFER (método más estable en Vercel)
    const fileData = fs.readFileSync(file.filepath); 
    
    // 2. Subir a Firebase Storage
    const storageRef = ref(storage, 'bodas/' + file.originalFilename);
    await uploadBytes(storageRef, fileData);

    // 3. Borramos el archivo temporal (asíncrono)
    try {
        await fs.promises.unlink(file.filepath); 
    } catch (e) {
        console.error("No se pudo borrar el archivo temporal.");
    }

    // 4. Éxito
    res.status(200).json({ message: 'Foto subida con éxito a Firebase Storage.' });

  } catch (serverError) {
    // Capturamos cualquier error, incluyendo los fallos internos de FS o Firebase
    console.error('Error FATAL en la función Serverless:', serverError);
    
    let errorMessage = 'Error al subir a Firebase Storage. Verifica las credenciales de Service Account.';
    
    // Devolvemos el error 500 con el mensaje genérico de permisos
    res.status(500).json({ message: errorMessage });
  }
}
