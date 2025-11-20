// lib/firebase.js (VERSIÓN FINAL BASE64 CON CLAVES REALES)

const firebase = require("firebase/app");
const firebaseStorage = require("firebase/storage");
const admin = require("firebase-admin");

let storage;
let adminAppInstance = null;

// Datos del proyecto confirmados
const CORRECT_PROJECT_ID = "boda-74934";
const CANONICAL_STORAGE_BUCKET = CORRECT_PROJECT_ID + ".appspot.com";

// === LÓGICA DE INICIALIZACIÓN ===

// 1. SERVER SIDE (Vercel) - Usamos la variable Base64 que creaste
if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 && admin.apps.length === 0) {
    
    try {
        // DECODIFICACIÓN BASE64
        // 1. Leemos el string codificado de la variable de entorno
        const encoded = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
        // 2. Lo convertimos a texto real (Buffer)
        const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
        // 3. Parseamos el JSON original
        const serviceAccount = JSON.parse(decoded);

        // Inicializamos el Admin SDK con las credenciales decodificadas
        const app = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId: CORRECT_PROJECT_ID,
            storageBucket: CANONICAL_STORAGE_BUCKET
        });
        
        adminAppInstance = app;
        console.log("Admin SDK inicializado correctamente vía Base64.");
        
    } catch (e) {
        console.error("ERROR CRÍTICO al decodificar Base64 en el servidor:", e);
    }
    
} 
// 2. CLIENT SIDE (Navegador) - Usamos la configuración pública
else if (firebase.getApps().length === 0) { 
    
    const firebaseConfig = {
      // ⚠️ TU CLAVE REAL (Ya insertada)
      apiKey: "AIzaSyDlYPq0WoXY5q8evJTdMX5ABd3nV_IISr0", 
      
      authDomain: CORRECT_PROJECT_ID + ".firebaseapp.com",
      projectId: CORRECT_PROJECT_ID,
      storageBucket: CANONICAL_STORAGE_BUCKET,
      messagingSenderId: "154296508162", 
      appId: "1:154296508162:web:10a93aebd7960b31a02c1b" 
    }; 
    
    const app = firebase.initializeApp(firebaseConfig);
    storage = firebaseStorage.getStorage(app); 
    
} else {
    // 3. Si ya existe una app inicializada, la reutilizamos
    const app = admin.apps[0] || firebase.getApps()[0];
    if (admin.apps.length > 0) adminAppInstance = admin.apps[0];
    if (firebase.getApps().length > 0) storage = firebaseStorage.getStorage(app);
}

// Exportamos las instancias
module.exports = { storage, adminApp: adminAppInstance };
