# school-management-integration-test

An integration test project for [school-management-backend-app](https://github.com/phatngo/school-management-backend-app)

## Main Libraries

This project utilizes several key libraries and frameworks to facilitate API integration testing:

- **[Cucumber.js](https://cucumber.io/docs/cucumber/api/?lang=javascript):** A tool for running automated tests written in plain language. It's used for Behavior-Driven Development (BDD).
- **[PactumJS](https://pactumjs.github.io):** A REST API testing library for Node.js that provides a clear and simple way to test APIs.
- **[TypeScript](https://www.typescriptlang.org/):** A typed superset of JavaScript that compiles to plain JavaScript. It helps in writing more robust and maintainable code.
- **[Chai](https://www.chaijs.com/):** An assertion library that provides a rich set of assertions for testing.

## Setup

### Set up the production app

Follow the instruction outlined in README.md in [school-management-backend-app](https://github.com/phatngo/school-management-backend-app)

### Run all tests

To run all tests, you can use the following command:

```bash
npm run test
```

### Run tests with tags

To run tests with a specific tag, you can use the following command:

```bash
npm run test -- --tags '@your-tag'
```
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

## Seeding Data

For `PUT`, `GET`, and `DELETE` operations, you often need to ensure specific data exists in the database beforehand. You can use the following Gherkin step to create a teacher with a specific profile before your test scenario runs:

```gherkin
Given a teacher with the following profile has existed in the system:
  | name | <teacher_name> |
```

This step will create a new teacher with the provided details, making it available for subsequent steps in your scenario.

### Example

Here is an example of how to use this for a `DELETE` operation:

```gherkin
Scenario: Delete a teacher successfully
  Given a teacher with the following profile has existed in the system:
    | name | Phat |
  When I delete the existing teacher
  Then I see the teacher is deleted successfully
```
