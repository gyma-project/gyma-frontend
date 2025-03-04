describe('Criação de Usuário', () => {

    it('Deve acessar a página de listagem de usuários após fazer login e pesquisar por: usuário que não existe', () => {

        cy.visit('http://localhost:3000');

        cy.get('button').contains('Entrar').click();

        cy.origin('http://localhost:8080', () => {
            cy.get('input#username').type('testuser');

            cy.get('input#password').type('test');

            cy.get('button').contains('Sign In').click();

        });

        cy.url().should('include', 'http://localhost:3000');

        cy.contains('p', 'Gerência de usuários');

        cy.contains('p', 'Listagem de usuários').click({ force: true });

        cy.wait(2000);

        const searchName = 'Benicio';

        cy.get('input[placeholder="Buscar pelo nome..."]').type(searchName);

    });
});
