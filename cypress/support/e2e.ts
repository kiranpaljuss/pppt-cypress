import './commands';

before(() => {
  Cypress.on('uncaught:exception', () => {
    return false;
  });
});

beforeEach(() => {
});

afterEach(() => {
});