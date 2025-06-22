describe('Contact and Audit Forms', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should submit contact form successfully', () => {
    // Activar sección contacto
    cy.get('.nav-link[data-section="contact"]').click();
    cy.wait(500);

    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="email"]').type('testuser@example.com');
    cy.get('input[name="subject"]').type('Test Subject');
    cy.get('textarea[name="message"]').type('This is a test message.');
    cy.get('form#contact-form').submit();
    cy.contains('Thank you for your message').should('be.visible');
  });

  it('should show validation errors on empty contact form submission', () => {
    // Activar sección contacto
    cy.get('.nav-link[data-section="contact"]').click();
    cy.wait(500);

    cy.get('form#contact-form').submit();
    cy.contains('Name is required').should('be.visible');
    cy.contains('Email is required').should('be.visible');
    cy.contains('Message is required').should('be.visible');
  });

  it('should submit audit form successfully', () => {
    // Activar sección auditoría
    cy.get('.nav-link[data-section="auditoria"]').click();
    cy.wait(500);

    cy.get('input[name="maquina"]').type('Test Machine');
    cy.get('input[name="ip"]').type('192.168.1.1');
    cy.get('textarea[name="vulnerabilidades"]').type('None');
    cy.get('textarea[name="recomendaciones"]').type('Keep updated');
    cy.get('form#audit-form').submit();
    cy.contains('Audit created successfully').should('be.visible');
  });

  it('should show validation errors on empty audit form submission', () => {
    // Activar sección auditoría
    cy.get('.nav-link[data-section="auditoria"]').click();
    cy.wait(500);

    cy.get('form#audit-form').submit();
    cy.contains('Machine is required').should('be.visible');
    cy.contains('IP is required').should('be.visible');
    cy.contains('Vulnerabilities are required').should('be.visible');
    cy.contains('Recommendations are required').should('be.visible');
  });
});
