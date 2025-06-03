describe('Full Application Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the home page and display main sections', () => {
    cy.contains('Juan Mamani - Ethical Hacker & Network Specialist');
    cy.get('.nav-tab').should('have.length.greaterThan', 0);
  });

  it('should navigate through main sections', () => {
    cy.get('.nav-tab').each(($tab) => {
      cy.wrap($tab).click();
      cy.wait(500);
      cy.get('.section.active').should('exist');
    });
  });

  it('should generate payload and display output', () => {
    cy.get('#exploit_type').type('xss');
    cy.get('#payload_type').type('reverse_shell');
    cy.get('#custom_payload').type('test payload');
    cy.get('.btn-hack').contains('GENERATE PAYLOAD').click();
    cy.get('#payload-output').should('contain.text', 'Generated reverse_shell for xss');
  });

  it('should initiate network scan and show results', () => {
    cy.get('#scan_target').clear().type('192.168.1.0/24');
    cy.get('#scan_type').select('tcp_syn');
    cy.get('.btn-hack').contains('INITIATE SCAN').click();
    cy.get('#network-results').should('contain.text', 'Scan initiated');
  });

  it('should analyze evidence file', () => {
    cy.get('#evidence_file').type('/path/to/evidence.img');
    cy.get('.btn-hack').contains('ANALYZE EVIDENCE').click();
    cy.on('window:alert', (str) => {
      expect(str).to.include('Analyzing evidence file');
    });
  });
});
