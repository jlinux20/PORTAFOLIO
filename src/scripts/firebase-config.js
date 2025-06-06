/**
 * @typedef {Object} MessageData
 * @property {string} name - Nombre del remitente
 * @property {string} email - Email del remitente
 * @property {string} message - Contenido del mensaje
 * @property {string} [company] - Compañía (opcional)
 */

/**
 * @typedef {Object} AnalyticsEvent
 * @property {string} eventName - Nombre del evento
 * @property {Object} eventData - Datos del evento
 * @property {string} [userId] - ID de usuario (opcional)
 */

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    orderBy, 
    limit, 
    query, 
    serverTimestamp 
} from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Clase para manejo de errores personalizados en Firebase
export class FirebaseError extends Error {
    /**
     * Crea una instancia de FirebaseError.
     * @param {string} message - Mensaje de error.
     * @param {string} code - Código de error personalizado.
     * @param {Error} [originalError] - Error original capturado.
     */
    constructor(message, code, originalError) {
        super(message);
        this.code = code;
        this.originalError = originalError;
    }
}

// Tu configuración Firebase actualizada
export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || 'fake-api-key',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'fake-auth-domain',
  projectId: process.env.FIREBASE_PROJECT_ID || 'fake-project-id',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'fake-storage-bucket',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || 'fake-messaging-sender-id',
  appId: process.env.FIREBASE_APP_ID || 'fake-app-id',
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || 'fake-measurement-id'
};

export const firestoreSettings = {
  cacheSizeBytes: 4194304, // 4MB
  ignoreUndefinedProperties: true
};
// Note: Ensure these environment variables are set in your build environment or .env file for frontend bundler.

  // Inicializar Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const analytics = (typeof window !== 'undefined' && process.env.NODE_ENV !== 'test') ? getAnalytics(app) : null;

// Servicio firebase mejorado
export const firebaseService = {
    // Validación de mensajes
    validateMessage(messageData) {
        const required = ['name', 'email', 'message'];
        for (const field of required) {
            if (!messageData[field]) {
                throw new FirebaseError(
                    `Campo requerido: ${field}`,
                    'VALIDATION_ERROR'
                );
            }
        }

        if (!messageData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            throw new FirebaseError(
                'Email inválido',
                'VALIDATION_ERROR'
            );
        }
    },

    // Guardar mensaje mejorado
    async saveMessage(messageData) {
        try {
            // Validación inicial
            if (!messageData || typeof messageData !== 'object') {
                throw new FirebaseError(
                    'Datos de mensaje inválidos',
                    'VALIDATION_ERROR'
                );
            }

            // Sanitize input data
            const sanitizedData = {
                name: String(messageData.name || '').trim(),
                email: String(messageData.email || '').trim().toLowerCase(),
                message: String(messageData.message || '').trim(),
                ...(messageData.company && {
                    company: String(messageData.company).trim()
                })
            };

            this.validateMessage(sanitizedData);

            const enrichedData = {
                ...sanitizedData,
                timestamp: serverTimestamp(),
                read: false,
                userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'test',
                ipAddress: await this.getClientIP(),
                created: new Date().toISOString()
            };

            const docRef = await addDoc(
                collection(db, 'messages'), 
                enrichedData
            );

            return { 
                success: true, 
                id: docRef.id,
                timestamp: enrichedData.created
            };

        } catch (error) {
            console.error('Error guardando mensaje:', error);
            throw new FirebaseError(
                'Error al guardar mensaje',
                error.code || 'SAVE_ERROR',
                error
            );
        }
    },

async getRecentMessages(page = 1, pageSize = 5) {
    try {
        // Validate input parameters
        if (page < 1) throw new FirebaseError('Página inválida', 'VALIDATION_ERROR');
        if (pageSize < 1) throw new FirebaseError('Tamaño de página inválido', 'VALIDATION_ERROR');

        const messagesRef = collection(db, 'messages');

        // Calculate offset for pagination
        const offset = (page - 1) * pageSize;

        // Get all messages ordered by timestamp descending
        const allMessagesQuery = query(
            messagesRef,
            orderBy('timestamp', 'desc')
        );

        const allMessagesSnapshot = await getDocs(allMessagesQuery);

        // Convert snapshot to array and apply pagination manually
        const allMessages = [];
        allMessagesSnapshot.forEach((doc) => {
            const data = doc.data();
            allMessages.push({
                id: doc.id,
                ...data,
                timestamp: data.timestamp?.toDate() || new Date(),
                read: Boolean(data.read)
            });
        });

        // Paginate messages manually
        const paginatedMessages = allMessages.slice(offset, offset + pageSize);

        const totalCount = allMessages.length;

        return {
            success: true,
            messages: paginatedMessages,
            pagination: {
                page,
                limit: pageSize,
                total: totalCount,
                pages: Math.ceil(totalCount / pageSize)
            }
        };

    } catch (error) {
        console.error('Error obteniendo mensajes:', error);
        throw new FirebaseError(
            'Error al obtener mensajes',
            error.code || 'FETCH_ERROR',
            error
        );
    }
},

    // Obtener total de mensajes
    async getMessagesCount() {
        try {
            const snapshot = await getDocs(collection(db, 'messages'));
            
            if (!snapshot) {
                throw new Error('No se pudo obtener el snapshot');
            }

            return snapshot.size || 0;

        } catch (error) {
            console.error('Error obteniendo el conteo de mensajes:', error);
            throw new FirebaseError(
                'Error al obtener el conteo de mensajes',
                'COUNT_ERROR',
                error
            );
        }
    },

    // Analytics mejorado
    async logAnalytics(eventData) {
        try {
            const enrichedData = {
                ...eventData,
                timestamp: serverTimestamp(),
                userAgent: navigator.userAgent,
                screenResolution: `${window.screen.width}x${window.screen.height}`,
                language: navigator.language,
                referrer: document.referrer
            };

            await addDoc(
                collection(db, 'analytics'), 
                enrichedData
            );

        } catch (error) {
            console.warn('Error logging analytics:', error);
            // No lanzamos error para no interrumpir la experiencia del usuario
        }
    },

    // Obtener IP del cliente
    async getClientIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            return 'unknown';
        }
    }
};

// Export singleton instance
export const firebase = {
    db,
    analytics,
    service: firebaseService
};
