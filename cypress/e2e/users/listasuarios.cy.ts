describe('Criação de Usuário', () => {

    // testuser
    // testuser@testuser.com
    // test

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

        // Preencher o campo de pesquisa para buscar pelo nome
        const searchName = 'Benicio'; // Nome do usuário a ser pesquisado

        // Acessar o campo de pesquisa pelo placeholder e digitar o nome
        cy.get('input[placeholder="Buscar pelo nome..."]').type(searchName);

    });
});
