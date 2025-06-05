import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const db = getFirestore();

export class AdminPanel {
    async getMessages() {
        try {
            const messagesCol = collection(db, 'messages');
            const messagesSnapshot = await getDocs(messagesCol);
            const messages = messagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return { success: true, messages };
        } catch (error) {
            console.error('Error al obtener mensajes:', error.message);
            return { success: false, error: error.message };
        }
    }

    async deleteMessage(id) {
        try {
            await deleteDoc(doc(db, 'messages', id));
            return { success: true };
        } catch (error) {
            console.error('Error al borrar mensaje:', error.message);
            return { success: false, error: error.message };
        }
    }
}
