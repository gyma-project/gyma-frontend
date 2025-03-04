describe('Criação de Usuário com Login', () => {

    it('Deve acessar a página de criação de usuário após fazer login e criar um perfil', () => {

        cy.visit('http://localhost:3000');

        cy.get('button').contains('Entrar').click();

        cy.origin('http://localhost:8080', () => {
            cy.get('input#username').type('testuser');

            cy.get('input#password').type('test');

            cy.get('button').contains('Sign In').click();

        });

        cy.url().should('include', 'http://localhost:3000');

        cy.contains('p', 'Gerência de usuários');

        cy.contains('p', 'Cadastrar usuário').click({ force: true });

        cy.url().should('include', '/user/create');

        const firstName = 'John';
        const lastName = 'Doe';
        const email = 'john.doe@example.com';
        const password = 'password123';
        const userType = 'STUDENT';

        cy.get('input[name="firstName"]').type(firstName);
        cy.get('input[name="lastName"]').type(lastName);
        cy.get('input[name="email"]').type(email);
        cy.get('input[name="password"]').type(password);
        cy.get('select[name="userType"]').select(userType);

        cy.get('button[type="submit"]').click();

    });
});
