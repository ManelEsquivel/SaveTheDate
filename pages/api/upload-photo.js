// pages/api/upload-photo.js

import formidable from 'formidable'; 
import { ref, uploadBytes } from 'firebase/storage';

// Importamos 'fs/promises' para usar la versión asíncrona y segura
const fs = require('fs/promises'); 

// ⚠️ Usamos require() para importar Storage desde lib/firebase.js
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

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error al parsear el formulario:', err);
      return res.status(500).json({ message: 'Error interno del servidor al leer el archivo.' });
    }

    const file = files.photos && files.photos[0]; 

    if (!file) {
        return res.status(400).json({ message: 'No se encontró ningún archivo.' });
    }

    try {
      // 1. LECTURA ASÍNCRONA SEGURA: Leemos el buffer del archivo temporal
      // El método 'fs.readFile' es seguro en Vercel y previene el error 500.
      const fileData = await fs.readFile(file.filepath); 
      
      // 2. Subir a Firebase Storage
      const storageRef = ref(storage, 'bodas/' + file.originalFilename);
      await uploadBytes(storageRef, fileData);

      // 3. Borramos el archivo temporal
      try {
          await fs.unlink(file.filepath);
      } catch (unlinkError) {
          console.error("Error al borrar archivo temporal (ignorado):", unlinkError);
      }

      // 4. Éxito
      res.status(200).json({ message: 'Foto subida con éxito a Firebase Storage.' });

    } catch (serverError) {
      console.error('Error FATAL en la función Serverless:', serverError);
      
      // Si falla, el error es de autenticación o de permisos
      let errorMessage = 'Error al subir a Firebase Storage. Verifica las credenciales de Service Account.';
      if (serverError.code === 'storage/unauthenticated' || serverError.code === 'permission_denied') {
          errorMessage = 'Error de Permisos. Revisa el rol asignado a la Cuenta de Servicio.';
      }
      
      // Devolvemos el error 500
      res.status(500).json({ message: errorMessage });
    }
  });
}
