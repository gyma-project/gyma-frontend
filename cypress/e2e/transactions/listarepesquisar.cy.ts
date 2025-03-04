describe('Histórico de Transações', () => {
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

    it('Deve encontrar uma transação com data existente', () => {

        cy.contains('span', 'Histórico das Transações').click();

        cy.wait(2000);

        cy.get('input[type="date"]').type('2023-02-10');
    });
    
    it('Deve encontrar uma transação com data não existente', () => {

        cy.contains('span', 'Histórico das Transações').click();

        cy.wait(2000);

        cy.get('input[type="date"]').type('2024-03-04');
    });

});
