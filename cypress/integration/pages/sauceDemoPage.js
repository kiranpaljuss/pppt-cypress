class SauceDemoPage {
  usernameInput () {
    return cy.get('#user-name');
  }

  passwordInput () {
    return cy.get('#password');
  }

  loginButton () {
    return cy.get('#login-button');
  }

  pageTitle () {
    return cy.get('.title');
  }

  sortSelect () {
    return cy.get('[data-test="product-sort-container"]');
  }

  itemPrices () {
    return cy.get('.inventory_item_price');
  }

  itemNames () {
    return cy.get('.inventory_item_name');
  }

  inventoryItemByName (itemName) {
    return cy.contains('.inventory_item', itemName);
  }

  addToCartButtonInItem (itemName) {
    return this.inventoryItemByName(itemName).contains('button', 'Add to cart');
  }

  shoppingCartLink () {
    return cy.get('.shopping_cart_link');
  }

  cartItems () {
    return cy.get('.cart_item .inventory_item_name');
  }

  cartBadge () {
    return cy.get('.shopping_cart_badge');
  }

  continueShoppingButton () {
    return cy.get('#continue-shopping');
  }

  checkoutButton () {
    return cy.get('#checkout');
  }

  firstNameInput () {
    return cy.get('#first-name');
  }

  lastNameInput () {
    return cy.get('#last-name');
  }

  postalCodeInput () {
    return cy.get('#postal-code');
  }

  continueCheckoutButton () {
    return cy.get('#continue');
  }

  errorMessage () {
    return cy.get('[data-test="error"]');
  }
}

export default new SauceDemoPage();