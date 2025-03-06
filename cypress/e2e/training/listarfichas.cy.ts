describe('Listagem de Fichas de treino', () => {

    it('Deve acessar a página de listagem de treinos após fazer login, pesquisar por treino e visualizar', () => {

        cy.intercept('HEAD', 'http://localhost:9000/images/*', { statusCode: 200 });

        cy.visit('http://localhost:3000');

        cy.get('button').contains('Entrar').click();
        cy.origin('http://localhost:8080', () => {
            cy.get('input#username').type('testuser');
            cy.get('input#password').type('test');
            cy.get('button').contains('Sign In').click();
        });

        cy.url().should('include', 'http://localhost:3000');

        cy.contains('p', 'Gerência de treinos');

        cy.wait(2000);
        cy.contains('span', 'Listagem de treinos').click({ force: true });

        const name = 'Treino de Peito';
        cy.get('input[placeholder="Buscar pelo nome..."]').type(name);
        cy.wait(3000);

        cy.get('img[alt="Visualizar"]').first().click();

        cy.wait(3000);

        cy.contains('button', 'Fechar').click();
    });
});
