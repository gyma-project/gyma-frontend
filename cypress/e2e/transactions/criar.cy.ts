describe('Cadastro de Transação com Login', () => {
  beforeEach(() => {
    cy.intercept('HEAD', 'http://localhost:9000/images/*', { statusCode: 200 });

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
    cy.contains('span', 'Cadastrar Transação').click({ force: true });
    cy.url().should('include', '/transactions/create');

    cy.get('input[placeholder="Digite o valor da transação..."]').clear().type('55');

    cy.get('select').select('SALARIES');

    cy.get('textarea[placeholder="Digite a descrição da transação..."]').clear().type('Pagamento de salário');

    cy.get('button[type="submit"]').click();

    cy.wait(4000);

  });
});
