@ui
Feature: 02 SauceDemo inventory sorting and checkout validation

  Background:
    Given I open the SauceDemo login page
    When I login to SauceDemo with user key "SAUCE_STANDARD_USER"
    Then I should be on the SauceDemo inventory page

  Scenario Outline: 01 Verify inventory sorting behavior - <sortOption>
    When I select the "<sortOption>" sort option
    Then the inventory items should be in "<expectedOrder>" order

    Examples:
      | sortOption          | expectedOrder |
      | Price (low to high) | ascending     |
      | Price (high to low) | descending    |
      | Name (A to Z)       | alphabetical  |

  Scenario Outline: 02 Verify checkout information validation - <firstName>/<lastName>
    Given I add "Sauce Labs Backpack" to the cart
    And I open the shopping cart
    And I proceed to checkout
    When I enter first name "<firstName>", last name "<lastName>", and postal code "<postalCode>"
    And I continue checkout
    Then I should see checkout outcome "<expectedOutcome>"

    Examples:
      | firstName | lastName | postalCode | expectedOutcome               |
      | John      | Doe      | 90210      | Checkout Overview             |
      |           | Doe      | 90210      | Error: First Name is required |
      | John      |          | 90210      | Error: Last Name is required  |