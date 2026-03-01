# pactum-cucumber-boilerplate

Boilerplate project to run REST API tests with [Cucumber](https://cucumber.io) and [PactumJS](https://pactumjs.github.io)

## Setup

## Authentication

By default, all scenarios are authenticated as a default user. If you want to use a different user for a specific scenario, you can use the following step before your CRUD operations:

```gherkin
Given I am authenticated as "<user>" user
```

Where `<user>` is a user defined in your configuration files.

### Example

Here is an example of how to use this step in a feature file:

```gherkin
Feature: Add a teacher

  Scenario: Add a teacher successfully with a specific user
    Given I am authenticated as "admin" user
    When I add a new teacher with the following profile:
      | name | David |
    Then I see the teacher is created successfully
```
