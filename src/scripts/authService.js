import { login as firebaseLogin } from './auth';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth();

export const authService = {
    async login(email, password) {
        return await firebaseLogin(email, password);
    },

    async register(email, password) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            return { success: true, user: userCredential.user };
        } catch (error) {
            console.error('Error en registro:', error.message);
            return { success: false, error: error.message };
        }
    }
};
