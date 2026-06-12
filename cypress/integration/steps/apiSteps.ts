import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import PageUrls from '../../support/urls';

let response: Cypress.Response<any>;
let accountPayload: Record<string, any>;
const BASE_URL = PageUrls.automationExerciseApiBase();

function parseResponseBody (body: unknown) {
  if (typeof body === 'string') {
    return JSON.parse(body) as Record<string, any>;
  }

  return body as Record<string, any>;
}

function buildUniqueAccountPayload () {
  const uniquePart = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;

  return cy.fixture('accountPayload').then((payloadTemplate: Record<string, any>) => {
    return {
      ...payloadTemplate,
      email: `cypress.user.${uniquePart}@example.com`,
      mobile_number: `9${String(Date.now()).slice(-9)}`,
    };
  });
}

Given(/^I send a "(.*)" request to "(.*)"$/, (method: string, endpoint: string) => {
  cy.request({
    method,
    url: `${BASE_URL}${endpoint}`,
    failOnStatusCode: false,
  }).then((res) => {
    response = res;
  });
});

Given('I prepare a unique account payload', () => {
  return buildUniqueAccountPayload().then((payload) => {
    accountPayload = payload;
  });
});

Given('I create the prepared account via API', () => {
  cy.request({
    method: 'POST',
    url: `${BASE_URL}/createAccount`,
    form: true,
    body: accountPayload,
    failOnStatusCode: false,
  }).then((res) => {
    response = res;
  });
});

When(/^I send a "(.*)" request to "(.*)" with the prepared account payload$/, (method: string, endpoint: string) => {
  cy.request({
    method,
    url: `${BASE_URL}${endpoint}`,
    form: true,
    body: accountPayload,
    failOnStatusCode: false,
  }).then((res) => {
    response = res;
  });
});

When('I update the prepared account details', () => {
  accountPayload = {
    ...accountPayload,
    name: 'Updated Cypress User',
    firstname: 'Updated',
    city: 'Pune',
  };
});

Then(/^the response status should be "(.*)"$/, (statusCode: string) => {
  expect(response.status).to.eq(Number(statusCode));
});

Then(/^the API response code should be "(.*)"$/, (apiCode: string) => {
  const parsedBody = parseResponseBody(response.body);
  expect(Number(parsedBody.responseCode)).to.eq(Number(apiCode));
});

Then(/^the API response message should be "(.*)"$/, (message: string) => {
  const parsedBody = parseResponseBody(response.body);
  expect(parsedBody.message).to.eq(message);
});