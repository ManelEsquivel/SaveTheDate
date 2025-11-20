// pages/api/upload-photo.js

import formidable from 'formidable'; 
import { ref, uploadBytes } from 'firebase/storage';

// Usaremos 'fs/promises' para el borrado asíncrono y 'fs' para la lectura síncrona
const fs = require('fs'); 
const fsPromises = require('fs/promises'); 

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
  let filePath = null; // Para almacenar la ruta temporal del archivo

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
    
    // Almacenamos la ruta para intentar borrarlo después
    filePath = file.filepath; 

    // 1. LECTURA SÍNCRONA DIRECTA (El método más estable para archivos temporales pequeños en Node.js/Vercel)
    const fileData = fs.readFileSync(filePath); 
    
    // 2. Subir a Firebase Storage
    const storageRef = ref(storage, 'bodas/' + file.originalFilename);
    await uploadBytes(storageRef, fileData);

    // 3. Éxito
    return res.status(200).json({ message: 'Foto subida con éxito a Firebase Storage.' });

  } catch (serverError) {
    // Capturamos cualquier error (de lectura de archivo o de Firebase)
    console.error('Error FATAL en la función Serverless:', serverError);
    
    let errorMessage = 'Error al subir a Firebase Storage. Verifica las credenciales de Service Account.';
    
    // Devolvemos el error 500 con el mensaje genérico de permisos
    res.status(500).json({ message: errorMessage });

  } finally {
      // 4. Intentamos borrar el archivo temporal del servidor SÍ O SÍ
      if (filePath) {
          try {
              await fsPromises.unlink(filePath); 
          } catch (e) {
              console.error("No se pudo borrar el archivo temporal.");
          }
      }
  }
}
