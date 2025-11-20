import { storage } from '../../lib/firebase'; // Reusa tu inicialización de Firebase
import { ref, uploadBytes } from 'firebase/storage';
import formidable from 'formidable'; // Paquete necesario para leer la subida de archivos

// Deshabilitamos el parser de body de Next.js para manejar la subida de archivos
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido.' });
  }

  // 1. Usar Formidable para parsear el archivo
  const form = formidable({});

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error al parsear el formulario:', err);
      return res.status(500).json({ message: 'Error interno del servidor.' });
    }

    // 2. Extraer el archivo
    const file = files.photos && files.photos[0]; // Asumiendo que el campo se llama 'photos'

    if (!file) {
        return res.status(400).json({ message: 'No se encontró ningún archivo.' });
    }

    try {
      // 3. Convertir el archivo temporal a un Buffer para subirlo a Firebase
      const fs = require('fs');
      const fileData = fs.readFileSync(file.filepath);

      // 4. Subir a Firebase Storage desde el servidor
      const storageRef = ref(storage, 'bodas/' + file.originalFilename);
      await uploadBytes(storageRef, fileData);

      // 5. Éxito
      res.status(200).json({ message: 'Foto subida con éxito al servidor.' });
    } catch (firebaseError) {
      console.error('Error de Firebase:', firebaseError);
      res.status(500).json({ message: 'Error al subir a Firebase Storage.' });
    }
  });
}
