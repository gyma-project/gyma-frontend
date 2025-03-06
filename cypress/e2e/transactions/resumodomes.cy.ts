describe('Tela de Resumo do Mês', () => {
    beforeEach(() => {
        // Visita a página inicial
        cy.visit('http://localhost:3000');

        // Realiza login
        cy.get('button').contains('Entrar').click();

        // Acessa o sistema de login do Keycloak
        cy.origin('http://localhost:8080', () => {
            cy.get('input#username').type('testuser');
            cy.get('input#password').type('test');
            cy.get('button').contains('Sign In').click();
        });

        // Aguarda redirecionamento e confirma que está na página inicial
        cy.url().should('include', 'localhost:3000');
        cy.contains('p', 'Gerência de Finanças').should('be.visible');

        // Acessa a página de histórico de transações
        cy.contains('span', 'Resumo do mês atual').click();
    });

    it('deve exibir corretamente as entradas, saídas e saldo do mês atual', () => {
        // Verifica se as informações de entradas, saídas e saldo estão sendo exibidas corretamente
        cy.get('main').within(() => {
            // Verifica entradas
            cy.contains('Entradas').should('be.visible');
            cy.get('p')
                .contains(/R\$\s?\d+(\.\d{1,2})?/) // Verifica se há valor em reais
                .should('exist');

            // Verifica despesas
            cy.contains('Despesas').should('be.visible');
            cy.get('p')
                .contains(/R\$\s?\d+(\.\d{1,2})?/) // Verifica se há valor em reais
                .should('exist');

            // Verifica saldo atual
            cy.contains('Saldo Atual').should('be.visible');
            cy.get('p')
                .contains(/R\$\s?\d+(\.\d{1,2})?/) // Verifica se há valor em reais
                .should('exist');
                
            cy.wait(2000);
            // Apresenta o gráfico
            cy.get('canvas')
                .should('have.length', 1)
                .scrollIntoView()
                .should('be.visible');
        });
    });
});
