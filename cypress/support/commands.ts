/// <reference types="cypress" />
import 'cypress-file-upload';

declare global {
  namespace Cypress {
    interface Chainable {
      // Adicionando a tipagem para o comando `login`
      login(username: string, password: string): Chainable<void>;
      attachFile(fileName: string, options?: object): Chainable<Element>;
    }
  }
}

// Comando de login (exemplo)
Cypress.Commands.add('login', (username, password) => {
  const apiUrl = Cypress.env('REACT_APP_API_URL');
  const keycloakUrl = Cypress.env('KEYCLOAK_URL');

  cy.visit(apiUrl);

  cy.get('button').contains('Entrar').click();

  cy.origin(keycloakUrl, { args: { username, password } }, ({ username, password }) => {
    cy.get('input#username').type(username);
    cy.get('input#password').type(password); 
    cy.get('button').contains('Sign In').click();
  });

  cy.url().should('include', apiUrl);
});
