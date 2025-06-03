# Instrucciones básicas para pruebas end-to-end (E2E)

Para realizar pruebas end-to-end completas en su proyecto, puede usar herramientas como Cypress o Playwright. A continuación, se describen los pasos básicos para comenzar con Cypress:

1. Instalar Cypress:
   ```
   npm install cypress --save-dev
   ```

2. Agregar un script en package.json:
   ```json
   "scripts": {
     "cypress:open": "cypress open",
     "cypress:run": "cypress run"
   }
   ```

3. Ejecutar Cypress en modo interactivo:
   ```
   npm run cypress:open
   ```

4. Ejecutar Cypress en modo headless (para CI/CD):
   ```
   npm run cypress:run
   ```

5. Crear pruebas E2E en la carpeta `cypress/integration/`, por ejemplo:
   ```js
   describe('Página de inicio', () => {
     it('debería cargar correctamente', () => {
       cy.visit('http://localhost:8000');
       cy.contains('juan@cybersec:~$ whoami');
     });

     it('debería navegar a la sección About', () => {
       cy.get('.nav-link[data-section="about"]').click();
       cy.get('#about').should('be.visible');
     });
   });
   ```

6. Ejecutar el servidor local antes de correr las pruebas.

---

Este archivo es una guía para que pueda implementar pruebas E2E según sus necesidades. La implementación completa de pruebas E2E puede ser extensa y específica para cada proyecto.
