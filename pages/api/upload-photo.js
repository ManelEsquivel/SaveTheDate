import formidable from 'formidable'; 

// Deshabilitamos el parser de body de Next.js para manejar la subida de archivos grandes
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
      return res.status(500).json({ message: 'Error interno del servidor al leer el archivo.' });
    }

    // 2. Extraer el archivo
    // 'files.photos' corresponde al campo que envía el frontend (formData.append('photos', file))
    const file = files.photos && files.photos[0]; 

    if (!file) {
        return res.status(400).json({ message: 'No se encontró ningún archivo en el formulario.' });
    }

    // 3. Subida a Firebase (usando require() para resolver módulos en el servidor)
    try {
      // Módulos necesarios para leer y subir el archivo
      const fs = require('fs');
      const { storage } = require('../../lib/firebase'); // RUTA CORRECTA para la API Route
      const { ref, uploadBytes } = require('firebase/storage');
      
      // Leer el archivo temporal y convertirlo a un Buffer
      const fileData = fs.readFileSync(file.filepath);

      // Subir a Firebase Storage
      const storageRef = ref(storage, 'bodas/' + file.originalFilename);
      await uploadBytes(storageRef, fileData);

      // Éxito
      res.status(200).json({ message: 'Foto subida con éxito al servidor.' });

    } catch (firebaseError) {
      console.error('Error de Firebase o Lectura de Archivo:', firebaseError);
      res.status(500).json({ message: 'Error al subir a Firebase Storage. Revisa la configuración de Firebase y permisos.' });
    }
  });
}
