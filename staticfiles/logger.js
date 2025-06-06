export const logger = {
    error(message, error) {
        console.error(`[ERROR] ${message}`, error);
        // Aquí se puede agregar integración con servicios externos de logging si se desea
    },

    analytics(event) {
        console.log(`[ANALYTICS] Evento:`, event);
        // Aquí se puede agregar integración con Firebase Analytics u otro servicio
    }
};
