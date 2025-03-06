describe('Criação de Ficha de Treino', () => {
    it('Deve permitir criar uma ficha de treino com sucesso', () => {
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

        cy.wait(1000);
        cy.contains('span', 'Cadastrar treino').click({ force: true });
        cy.wait(3000);

        cy.intercept('POST', '/training/create', { statusCode: 200, body: { message: 'Ficha de treino cadastrada com sucesso!' } }).as('createTraining');

        cy.get('input[name="userId"]').click();
        cy.get('input[name="userId"]').type('silva');

        cy.wait(600);

        cy.get('.br-radio > .cursor-pointer').click();

        cy.get('input[name="exerciseIds"]').click();
        cy.get('input[name="exerciseIds"]').type('Supino');
        cy.wait(600);
        cy.get('.px-4 > span').click();
        

        cy.get('input[name="name"]').type('Treino de Peito');
        cy.get('textarea[name="description"]').type('Treino focado no desenvolvimento do peito');

        cy.get('button[type="submit"]').click();
    });
});
