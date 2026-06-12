@ui
Feature: 01 SauceDemo cart management and continue shopping flow

  Background:
    Given I open the SauceDemo login page
    When I login to SauceDemo with user key "SAUCE_STANDARD_USER"
    Then I should be on the SauceDemo inventory page

  @test
  Scenario: 01 Add multiple items to cart from a data table
    When I add the following products to the cart:
      | productName             |
      | Sauce Labs Backpack     |
      | Sauce Labs Bike Light   |
      | Sauce Labs Bolt T-Shirt |
    Then the cart badge should show "3"
    And I open the shopping cart
    And the cart should contain the following products:
      | productName             |
      | Sauce Labs Backpack     |
      | Sauce Labs Bike Light   |
      | Sauce Labs Bolt T-Shirt |

  Scenario: 02 Continue shopping from cart returns to inventory
    Given I add "Sauce Labs Fleece Jacket" to the cart
    And I open the shopping cart
    When I click continue shopping
    Then I should be on the SauceDemo inventory page
    And the cart badge should show "1"