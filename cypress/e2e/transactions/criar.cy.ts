describe('Cadastro de Transação com Login', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');

    cy.get('button').contains('Entrar').click();

    cy.origin('http://localhost:8080', () => {
      cy.get('input#username').type('testuser');
      cy.get('input#password').type('test');
      cy.get('button').contains('Sign In').click();
    });

    cy.url().should('include', 'http://localhost:3000');
    cy.contains('p', 'Gerência de Finanças');
  });

  it('Deve cadastrar uma transação após o login', () => {
    cy.contains('p', 'Cadastrar Transação').click({ force: true });
    cy.url().should('include', '/transactions/create');

    cy.get('input[placeholder="Digite o valor da transação..."]').clear().type('100');

    cy.get('select').select('SALARIES');

    cy.get('textarea[placeholder="Digite a descrição da transação..."]').clear().type('Pagamento de salário');

    cy.get('button[type="submit"]').click();

  });
});
