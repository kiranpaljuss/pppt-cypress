// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
// import './commands';
// import './pages';

// Alternatively you can use CommonJS syntax:
require('./commands');

before(() => {
  // cy.clearCookies;
  // cy.clearLocalStorage;
  // cy.clearLocalStorageSnapshot();
  // cy.log('Local storage is cleared!');
  Cypress.on('uncaught:exception', () => {
    return false;
  });
});

beforeEach(() => {
  // cy.setLocalStorage('key', 'value');
  // cy.setCookie('key', 'value');
  // cy.restoreLocalStorage();
});

afterEach(() => {
  // cy.saveLocalStorage();
  // cy.log('Local storage is saved!');
});