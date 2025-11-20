const firebase = require("firebase/app");
const firebaseStorage = require("firebase/storage");
const admin = require("firebase-admin");

let storage;
let adminAppInstance = null;

// ⚠️ CAMBIO: Usamos el bucket donde aplicaste el CORS con gsutil
const CORRECT_PROJECT_ID = "boda-74934";
const CANONICAL_STORAGE_BUCKET = "boda-74934.firebasestorage.app";

// 1. SERVER SIDE (Vercel)
if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 && admin.apps.length === 0) {
    try {
        const encoded = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
        const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
        const serviceAccount = JSON.parse(decoded);

        const app = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId: CORRECT_PROJECT_ID,
            storageBucket: CANONICAL_STORAGE_BUCKET
        });
        
        adminAppInstance = app;
        console.log("Admin SDK inicializado.");
    } catch (e) {
        console.error("Error al decodificar credenciales:", e);
    }
} 
// 2. CLIENT SIDE (Navegador)
else if (firebase.getApps().length === 0) {
    const firebaseConfig = {
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
    const app = admin.apps[0] || firebase.getApps()[0];
    if (admin.apps.length > 0) adminAppInstance = admin.apps[0];
    if (firebase.getApps().length > 0) storage = firebaseStorage.getStorage(app);
}

module.exports = { storage, adminApp: adminAppInstance };
