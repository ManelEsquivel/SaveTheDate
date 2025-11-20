// lib/firebase.js (VERSIÓN FINAL CON CORRECCIÓN 404 DE BUCKET)

const firebase = require("firebase/app");
const firebaseStorage = require("firebase/storage");
const admin = require("firebase-admin");

let storage;

// El nombre de bucket que funciona en GCS/Firebase Storage (solución al 404)
const STORAGE_BUCKET_NAME = "boda-74934.firebasestorage.app";

// 1. Lógica de Inicialización del Servidor (Server-Side)
// Usamos FIREBASE_PRIVATE_KEY_STRING como la señal de que estamos en el servidor
if (process.env.FIREBASE_PRIVATE_KEY_STRING && !admin.apps.length) {
    
    // --- PASO CRÍTICO: Reconstruir la clave privada con saltos de línea correctos ---
    // Esto resuelve el error "Invalid PEM formatted message"
    const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY_STRING.replace(/\\n/g, '\n');
    
    // Construcción del objeto de credenciales a partir de las variables de entorno simples.
    const adminConfig = {
        type: "service_account",
        projectId: process.env.FIREBASE_PROJECT_ID || "boda-74934",
        private_key_id: "81e7ab04fd58f50a14c4f647f0713d0052b08ac2",
        private_key: rawPrivateKey, // Clave reconstruida y limpia
        client_email: process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk-fbsvc@boda-74934.iam.gserviceaccount.com",
        client_id: "103279998604633186654", 
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40boda-74934.iam.gserviceaccount.com"
    };

    // Inicialización del SDK de Firebase Admin para el Servidor
    const app = admin.initializeApp({
        credential: admin.credential.cert(adminConfig),
        projectId: adminConfig.projectId,
        // 🚨 CORRECCIÓN CRÍTICA 404: Usamos la URL correcta del bucket.
        storageBucket: STORAGE_BUCKET_NAME 
    });
    
    storage = firebaseStorage.getStorage(app);
    module.exports = { storage };
    
} else if (!admin.apps.length) {
    // 2. Lógica de Inicialización del Cliente (Client-Side)
    
    const firebaseConfig = {
      apiKey: "AIzaSyDlYPq0WoXY5q5evJTdMX5ABd3nV_IISr0",
      authDomain: "boda-74934.firebaseapp.com",
      projectId: "boda-74934",
      // Usamos el nombre estándar para el frontend, ya que este sí funciona
      storageBucket: "boda-74934.appspot.com", 
      messagingSenderId: "154296508162",
      appId: "1:1542998604633186654:web:10a93aebd7960b31a02c1b"
    }; 
    
    const app = firebase.initializeApp(firebaseConfig);
    storage = firebaseStorage.getStorage(app);
    module.exports = { storage };
    
} else {
    // 3. Usa la aplicación ya inicializada
    const app = admin.apps[0] || firebase.getApps()[0];
    storage = firebaseStorage.getStorage(app);
    module.exports = { storage };
}
