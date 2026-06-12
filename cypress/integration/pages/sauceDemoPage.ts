class SauceDemoPage {
  usernameInput () {
    return cy.get('[data-test="username"]');
  }

  passwordInput () {
    return cy.get('[data-test="password"]');
  }

  loginButton () {
    return cy.get('[data-test="login-button"]');
  }

  pageTitle () {
    return cy.get('[data-test="title"]');
  }

  sortSelect () {
    return cy.get('[data-test="product-sort-container"]');
  }

  activeSortOption () {
    return cy.get('[data-test="active-option"]');
  }

  itemPrices () {
    return cy.get('[data-test="inventory-item-price"]');
  }

  itemNames () {
    return cy.get('[data-test="inventory-item-name"]');
  }

  inventoryItemByName (itemName: string) {
    return cy.contains('[data-test="inventory-item"]', itemName);
  }

  addToCartButtonInItem (itemName: string) {
    return this.inventoryItemByName(itemName).find('[data-test^="add-to-cart-"]');
  }

  shoppingCartLink () {
    return cy.get('[data-test="shopping-cart-link"]');
  }

  cartItems () {
    return cy.get('[data-test="cart-list"] [data-test="inventory-item-name"]');
  }

  cartBadge () {
    return cy.get('[data-test="shopping-cart-badge"]');
  }

  continueShoppingButton () {
    return cy.get('[data-test="continue-shopping"]');
  }

  checkoutButton () {
    return cy.get('[data-test="checkout"]');
  }

  firstNameInput () {
    return cy.get('[data-test="firstName"]');
  }

  lastNameInput () {
    return cy.get('[data-test="lastName"]');
  }

  postalCodeInput () {
    return cy.get('[data-test="postalCode"]');
  }

  continueCheckoutButton () {
    return cy.get('[data-test="continue"]');
  }

  errorMessage () {
    return cy.get('[data-test="error"]');
  }
}

export default new SauceDemoPage();