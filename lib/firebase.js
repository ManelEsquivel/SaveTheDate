// lib/firebase.js (FINAL ROBUSTA CON TODAS LAS CLAVES CONFIRMADAS)

const firebase = require("firebase/app");
const firebaseStorage = require("firebase/storage");
const admin = require("firebase-admin");

let storage; 
let adminAppInstance = null; 

// ⚠️ IDs y URLs confirmados por el usuario
const CORRECT_PROJECT_ID = "boda-74934"; 
const CANONICAL_STORAGE_BUCKET = CORRECT_PROJECT_ID + ".appspot.com";
const USER_SERVICE_EMAIL = "firebase-adminsdk-fbsvc@boda-74934.iam.gserviceaccount.com";

// === LÓGICA DE INICIALIZACIÓN ===

// 1. SERVER SIDE (Vercel) - Usa el SDK de Admin para generar URLs Firmadas
if (process.env.FIREBASE_PRIVATE_KEY && admin.apps.length === 0) { 
    
    // TRUCO VERCEL: Limpieza de la clave privada escapada
    const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'); 
    
    const adminConfig = {
        type: "service_account",
        projectId: process.env.FIREBASE_PROJECT_ID || CORRECT_PROJECT_ID,
        private_key: rawPrivateKey, 
        client_email: process.env.FIREBASE_CLIENT_EMAIL || USER_SERVICE_EMAIL, 
    };

    const app = admin.initializeApp({
        credential: admin.credential.cert(adminConfig),
        projectId: adminConfig.projectId,
        storageBucket: CANONICAL_STORAGE_BUCKET 
    });
    
    adminAppInstance = app; 
    
} 
// 2. CLIENT SIDE (Navegador) - Usa el SDK regular (Clave Pública Web)
else if (firebase.getApps().length === 0) { 
    
    // CONFIGURACIÓN PÚBLICA (USADA PARA INICIALIZAR EL CLIENTE)
    const firebaseConfig = {
      apiKey: "AIzaSyDlYPq0WoXY5q8evJTdMX5ABd3nV_IISr0", // ⬅️ CLAVE WEB CONFIRMADA
      authDomain: CORRECT_PROJECT_ID + ".firebaseapp.com",
      projectId: CORRECT_PROJECT_ID,
      storageBucket: CANONICAL_STORAGE_BUCKET,
      messagingSenderId: "154296508162", 
      appId: "1:154296508162:web:10a93aebd7960b31a02c1b" // ⬅️ APP ID CONFIRMADO
    }; 
    
    const app = firebase.initializeApp(firebaseConfig);
    storage = firebaseStorage.getStorage(app); 
    
} else {
    // 3. Usa la aplicación ya inicializada
    const app = admin.apps[0] || firebase.getApps()[0];
    if (admin.apps.length > 0) {
        adminAppInstance = admin.apps[0];
    }
    if (firebase.getApps().length > 0) {
        storage = firebaseStorage.getStorage(app);
    }
}

// Exportamos las referencias para que puedan ser usadas por las rutas API y los componentes
module.exports = { storage, adminApp: adminAppInstance };
