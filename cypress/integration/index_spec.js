describe('Index Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000'); // Adjust if frontend served differently
  });

  it('should display the home section', () => {
    cy.get('#home').should('be.visible');
    cy.contains('juan@cybersec:~$ whoami');
  });

  it('should navigate to About section', () => {
    cy.get('.nav-link[data-section="about"]').click();
    cy.get('#about').should('be.visible');
  });
});
