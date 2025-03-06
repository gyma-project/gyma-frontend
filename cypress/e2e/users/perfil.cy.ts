describe('Perfil do Usuário', () => {
    it('Deve acessar a página de perfil de um usuário, verificar as informações e rolar até o fim da página', () => {
        cy.intercept('HEAD', 'http://localhost:9000/images/*', { statusCode: 200 });

        cy.visit('http://localhost:3000');

        cy.get('button').contains('Entrar').click();

        // Realiza o login na tela externa
        cy.origin('http://localhost:8080', () => {
            cy.get('input#username').type('testuser');
            cy.get('input#password').type('test');
            cy.get('button').contains('Sign In').click();
        });

        cy.url().should('include', 'http://localhost:3000');

        cy.contains('Olá,').click();

        cy.get('div').contains('Meu Perfil').should('be.visible');

        cy.get('div').contains('Meu Perfil').click();

        cy.url().should('include', '/user/profile/testuser');

        cy.contains('Olá,').click();

        cy.wait(500);

        cy.window().then((win) => {
            cy.wrap(win).scrollTo('bottom', { duration: 2000 });
        });
        cy.wait(1000);

        cy.window().then((win) => {
            cy.wrap(win).scrollTo('top', { duration: 2000 });
        });
        cy.wait(1000);

        // Aqui está a parte modificada: clicar no "Encerrar Sessão"
        cy.contains('Olá,').click();  // Reabre o dropdown
        cy.get('button').contains('Encerrar Sessão').click();  // Clica em "Encerrar Sessão"

    });
});
