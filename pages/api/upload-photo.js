import formidable from 'formidable'; 
import { ref, uploadBytes } from 'firebase/storage';

// Necesitamos las promesas de 'fs' para leer el archivo de forma asíncrona y segura
const fs = require('fs/promises'); 

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
      const fileData = await fs.readFile(file.filepath); 
      
      // 2. Subir a Firebase Storage
      const storageRef = ref(storage, 'bodas/' + file.originalFilename);
      await uploadBytes(storageRef, fileData);

      // 3. Éxito
      res.status(200).json({ message: 'Foto subida con éxito a Firebase Storage.' });

    } catch (serverError) {
      console.error('Error FATAL en la función Serverless:', serverError);
      
      // Intentamos responder con un error detallado
      let errorMessage = 'Error al subir a Firebase Storage. Verifica las credenciales de Service Account.';
      if (serverError.code === 'storage/unauthenticated' || serverError.code === 'permission_denied') {
          errorMessage = 'Error de Permisos. Revisa el rol asignado a la Cuenta de Servicio.';
      }
      
      // Borramos el archivo temporal si existe y es accesible
      try {
          await fs.unlink(file.filepath);
      } catch (unlinkError) {
          console.error("Error al borrar archivo temporal:", unlinkError);
      }

      res.status(500).json({ message: errorMessage });
    }
  });
}
