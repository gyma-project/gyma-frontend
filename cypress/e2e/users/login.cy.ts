describe('Criação de Usuário', () => {

  before(() => {
    cy.login('testuser', 'test');
  });

  it('Deve conseguir acessar a página principal', () => {
    cy.visit(Cypress.env('BASE_URL')); 
  });
});