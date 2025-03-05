describe('template spec', () => {

  before(() => {
    cy.login('testuser', 'test');
  });

  it('passes', () => {
    const apiUrl = Cypress.env('REACT_APP_API_URL');

    cy.visit(apiUrl)

    cy.contains('span', 'Cadastrar Transação').should('be.visible').click({force:true});
    cy.get('input[name="price"]').should('be.visible').type('50');
    cy.get('select[name="category"]').should('be.visible').select('MEMBERSHIP');
    cy.get('textarea[name="description"]').should('be.visible').type('Pagando mensalidade do aluno user');
    // esperar a implementação de mensagem no front para validar se foi criado a transação
    // cy.get('button[type="submit"]').should('be.visible').click({force:true});
  })
})