// database.js - operaciones con Firestore

import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, limit, serverTimestamp } from 'firebase/firestore';

const db = getFirestore();


// Guardar nuevo proyecto
export async function addProject(projectData) {
  try {
    const docRef = await addDoc(collection(db, 'projects'), {
      ...projectData,
      createdAt: serverTimestamp(),
      featured: projectData.featured || false
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding project:', error);
    return { success: false, error: error.message };
  }
}

// Obtener proyectos destacados
export async function getFeaturedProjects(limitCount = 5) {
  try {
    const q = query(
      collection(db, 'projects'),
      where('featured', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    const projects = [];
    querySnapshot.forEach(doc => {
      projects.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, projects };
  } catch (error) {
    console.error('Error getting featured projects:', error);
    return { success: false, error: error.message };
  }
}

// Obtener todas las habilidades
export async function getSkills() {
  try {
    const querySnapshot = await getDocs(collection(db, 'skills'));
    const skills = [];
    querySnapshot.forEach(doc => {
      skills.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, skills };
  } catch (error) {
    console.error('Error getting skills:', error);
    return { success: false, error: error.message };
  }
}

// Obtener certificaciones
export async function getCertifications() {
  try {
    const querySnapshot = await getDocs(collection(db, 'certifications'));
    const certifications = [];
    querySnapshot.forEach(doc => {
      certifications.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, certifications };
  } catch (error) {
    console.error('Error getting certifications:', error);
    return { success: false, error: error.message };
  }
}

// Guardar evento de analytics
export async function logAnalytics(eventData) {
  try {
    await addDoc(collection(db, 'analytics'), {
      ...eventData,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Error logging analytics:', error);
  }
}
