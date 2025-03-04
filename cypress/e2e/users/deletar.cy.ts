describe('Criação de Usuário', () => {

    it('Deve acessar a página de listagem de usuários, pesquisar por um usuário e deletar o perfil', () => {

        cy.visit('http://localhost:3000');

        cy.get('button').contains('Entrar').click();

        cy.origin('http://localhost:8080', () => {
            cy.get('input#username').type('testuser');
            cy.get('input#password').type('test');
            cy.get('button').contains('Sign In').click();
        });

        cy.url().should('include', 'http://localhost:3000');

        cy.contains('p', 'Gerência de usuários');

        cy.contains('span', 'Listagem de usuários').click({ force: true });

        cy.wait(4000);

        const searchName = 'keilany';

        cy.get('input[placeholder="Buscar pelo nome..."]').type(searchName);

        cy.get('img[alt="Excluir"]').click();

        cy.contains('h3', 'Tem certeza que deseja excluir este perfil?');

        cy.get('button').contains('Confirmar').click();

        cy.contains(searchName).should('not.exist');
    });
});
