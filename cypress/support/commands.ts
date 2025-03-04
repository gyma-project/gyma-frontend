/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

// cypress/support/index.d.ts
require('dotenv').config();


declare namespace Cypress {
    interface Chainable {
      login(username: string, password: string): Chainable<void>;
    }
  }
  


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
  