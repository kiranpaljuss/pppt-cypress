@api
Feature: 03 Account create and update API

  Scenario: 01 Create a new account via API
    Given I prepare a unique account payload
    When I send a "POST" request to "/createAccount" with the prepared account payload
    Then the response status should be "200"
    And the API response code should be "201"
    And the API response message should be "User created!"

  Scenario: 02 Update an existing account via API
    Given I prepare a unique account payload
    And I create the prepared account via API
    And the API response code should be "201"
    When I update the prepared account details
    And I send a "PUT" request to "/updateAccount" with the prepared account payload
    Then the response status should be "200"
    And the API response code should be "200"
    And the API response message should be "User updated!"