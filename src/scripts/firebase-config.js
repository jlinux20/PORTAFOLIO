// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, orderBy, limit, query, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js';

// Tu configuración Firebase actualizada
const firebaseConfig = {
  apiKey: "AIzaSyAbx66G2mENP5ENb9mhiW720VjFbvhgXXg",
  authDomain: "portfolio-web-dee85.firebaseapp.com",
  projectId: "portfolio-web-dee85",
  storageBucket: "portfolio-web-dee85.firebasestorage.app",
  messagingSenderId: "115579020873",
  appId: "1:115579020873:web:dc2c5ff23a3786235a4198",
  measurementId: "G-K4CYKZPQ4N"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Funciones de base de datos
export const firebaseService = {
  // Guardar mensaje de contacto
  async saveMessage(messageData) {
    try {
      const docRef = await addDoc(collection(db, 'messages'), {
        ...messageData,
        timestamp: serverTimestamp(),
        read: false
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error saving message:', error);
      return { success: false, error: error.message };
    }
  },

  // Obtener mensajes recientes
  async getRecentMessages() {
    try {
      const q = query(
        collection(db, 'messages'),
        orderBy('timestamp', 'desc'),
        limit(5)
      );
      const querySnapshot = await getDocs(q);
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, messages };
    } catch (error) {
      console.error('Error getting messages:', error);
      return { success: false, error: error.message };
    }
  },

  // Log de analytics
  async logAnalytics(eventData) {
    try {
      await addDoc(collection(db, 'analytics'), {
        ...eventData,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.log('Analytics error:', error);
    }
  }
};

export { db, analytics };
