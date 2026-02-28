Feature: View a single teacher

  Background: Add a teacher successfully
    Given I add a new teacher with the following profile:
      | name | Julian |

  Scenario: View a single teacher successfully
    When I view the added teacher
    Then I see the fetched teacher data matches the data when created

  Scenario Outline: Failed to view a non-existent teacher
    When I view the teacher with id: <id>
    Then I fail to view the teacher as the teacher with <id> is not found

    Examples:
      | id |
      | -1 |
