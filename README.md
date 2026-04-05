# pactum-cucumber-boilerplate

Boilerplate project to run REST API tests with [Cucumber](https://cucumber.io) and [PactumJS](https://pactumjs.github.io)

## Setup

### Run tests with tags

To run tests with a specific tag, you can use the following command:

```bash
npm run test -- --tags @your-tag
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
