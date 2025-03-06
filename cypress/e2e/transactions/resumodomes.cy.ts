describe('Tela de Resumo do Mês', () => {
    beforeEach(() => {
        cy.intercept('HEAD', 'http://localhost:9000/images/*', { statusCode: 200 });

        cy.visit('http://localhost:3000');

        cy.get('button').contains('Entrar').click();

        cy.origin('http://localhost:8080', () => {
            cy.get('input#username').type('testuser');
            cy.get('input#password').type('test');
            cy.get('button').contains('Sign In').click();
        });

        cy.url().should('include', 'localhost:3000');
        cy.contains('p', 'Gerência de Finanças').should('be.visible');

        cy.contains('span', 'Resumo do mês atual').click();
    });

    it('deve exibir corretamente as entradas, saídas e saldo do mês atual', () => {
        cy.get('main').within(() => {
            cy.contains('Entradas').should('be.visible');
            cy.get('p')
                .contains(/R\$\s?\d+(\.\d{1,2})?/) // Verifica se há valor em reais
                .should('exist');

            cy.contains('Despesas').should('be.visible');
            cy.get('p')
                .contains(/R\$\s?\d+(\.\d{1,2})?/) // Verifica se há valor em reais
                .should('exist');

            cy.contains('Saldo Atual').should('be.visible');
            cy.get('p')
                .contains(/R\$\s?\d+(\.\d{1,2})?/) // Verifica se há valor em reais
                .should('exist');
                
            cy.wait(2000);
            cy.get('canvas')
                .should('have.length', 1)
                .scrollIntoView()
                .should('be.visible');
        });
    });
});
