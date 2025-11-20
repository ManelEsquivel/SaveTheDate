// lib/firebase.js

const firebase = require("firebase/app");
const firebaseStorage = require("firebase/storage");
const admin = require("firebase-admin");

// La variable global para el objeto storage
let storage;

// 1. Lógica de Inicialización del Servidor (Server-Side)
if (process.env.FIREBASE_SERVICE_ACCOUNT && !admin.apps.length) {
    
    // El Node.js Server debe usar Service Account
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    
    const app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: "boda-74934", 
        storageBucket: "boda-74934.appspot.com"
    });
    
    storage = firebaseStorage.getStorage(app);
    
} else if (!admin.apps.length) {
    // 2. Lógica de Inicialización del Cliente (Client-Side)
    
    const firebaseConfig = {
      apiKey: "AIzaSyDlYPq0WoXY5q5evJTdMX5ABd3nV_IISr0",
      authDomain: "boda-74934.firebaseapp.com",
      projectId: "boda-74934",
      storageBucket: "boda-74934.appspot.com", 
      messagingSenderId: "154296508162",
      appId: "1:1542998604633186654:web:10a93aebd7960b31a02c1b"
    }; 
    
    const app = firebase.initializeApp(firebaseConfig);
    storage = firebaseStorage.getStorage(app);
    
} else {
    // 3. Usa la aplicación ya inicializada
    const app = admin.apps[0] || firebase.getApps()[0];
    storage = firebaseStorage.getStorage(app);
}

module.exports = { storage };
