// auth.js - autenticación Firebase

import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const auth = getAuth();


// Monitor de estado de usuario
export function monitorAuthState(callback) {
  onAuthStateChanged(auth, user => {
    callback(user);
  });
}

// Iniciar sesión con email y contraseña
export async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Error en login:', error.message);
    return { success: false, error: error.message };
  }
}

// Cerrar sesión
export async function logout() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Error en logout:', error);
    return { success: false, error: error.message };
  }
}
