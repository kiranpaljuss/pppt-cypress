import { Given, When, Then, DataTable } from '@badeball/cypress-cucumber-preprocessor';
import sauceDemoPage from '../pages/sauceDemoPage';
import PageUrls from '../../support/urls';

Given('I open the SauceDemo login page', () => {
  cy.visit(PageUrls.sauceDemoPage());
});

When(/^I login to SauceDemo with user key "(.*)"$/, (userKey: string) => {
  cy.env([userKey, 'SAUCE_PASSWORD']).then((envValues) => {
    const username = envValues[userKey];
    const password = envValues.SAUCE_PASSWORD;

    expect(username, `Missing Cypress env value for ${userKey}`).to.be.a('string').and.not.be.empty;
    expect(password, 'Missing Cypress env value for SAUCE_PASSWORD').to.be.a('string').and.not.be.empty;

    sauceDemoPage.usernameInput().clear().type(username as string);
    sauceDemoPage.passwordInput().clear().type(password as string);
    sauceDemoPage.loginButton().click();
  });
});

Then('I should be on the SauceDemo inventory page', () => {
  cy.url().should('include', '/inventory.html');
  sauceDemoPage.pageTitle().should('contain', 'Products');
});

When(/^I select the "(.*)" sort option$/, (sortOption: string) => {
  sauceDemoPage.sortSelect().select(sortOption);
});

Then(/^the inventory items should be in "(.*)" order$/, (expectedOrder: string) => {
  if (expectedOrder === 'ascending' || expectedOrder === 'descending') {
    sauceDemoPage.itemPrices().then(($prices) => {
      const values = [...$prices].map((el) => Number(el.innerText.replace('$', '')));
      const sorted = [...values].sort((a, b) => a - b);

      if (expectedOrder === 'ascending') {
        expect(values).to.deep.equal(sorted);
      } else {
        expect(values).to.deep.equal([...sorted].reverse());
      }
    });
    return;
  }

  if (expectedOrder === 'alphabetical') {
    sauceDemoPage.itemNames().then(($names) => {
      const values = [...$names].map((el) => el.innerText.trim());
      const sorted = [...values].sort((a, b) => a.localeCompare(b));
      expect(values).to.deep.equal(sorted);
    });
  }
});

Given(/^I add "(.*)" to the cart$/, (itemName: string) => {
  sauceDemoPage.addToCartButtonInItem(itemName).click();
});

Given('I open the shopping cart', () => {
  sauceDemoPage.shoppingCartLink().click();
});

Given('I proceed to checkout', () => {
  sauceDemoPage.checkoutButton().click();
});

When(/^I enter first name "(.*)", last name "(.*)", and postal code "(.*)"$/, (firstName: string, lastName: string, postalCode: string) => {
  sauceDemoPage.firstNameInput().clear();
  if (firstName) {
    sauceDemoPage.firstNameInput().type(firstName);
  }

  sauceDemoPage.lastNameInput().clear();
  if (lastName) {
    sauceDemoPage.lastNameInput().type(lastName);
  }

  sauceDemoPage.postalCodeInput().clear();
  if (postalCode) {
    sauceDemoPage.postalCodeInput().type(postalCode);
  }
});

When('I continue checkout', () => {
  sauceDemoPage.continueCheckoutButton().click();
});

Then(/^I should see checkout outcome "(.*)"$/, (expectedOutcome: string) => {
  if (expectedOutcome === 'Checkout Overview') {
    cy.url().should('include', '/checkout-step-two.html');
    sauceDemoPage.pageTitle().should('contain', 'Checkout: Overview');
    return;
  }

  sauceDemoPage.errorMessage().should('be.visible').and('contain', expectedOutcome);
});

When('I add the following products to the cart:', (dataTable: DataTable) => {
  const rows = dataTable.hashes();
  rows.forEach((row) => {
    sauceDemoPage.addToCartButtonInItem(row.productName).click();
  });
});

Then('the cart should contain the following products:', (dataTable: DataTable) => {
  const productNames = dataTable.hashes().map((row) => row.productName);
  sauceDemoPage.cartItems().then(($items) => {
    const values = [...$items].map((el) => el.innerText.trim());
    productNames.forEach((name) => {
      expect(values).to.include(name);
    });
  });
});

Then(/^the cart badge should show "(.*)"$/, (count: string) => {
  sauceDemoPage.cartBadge().should('be.visible').and('have.text', String(count));
});

When('I click continue shopping', () => {
  sauceDemoPage.continueShoppingButton().click();
});