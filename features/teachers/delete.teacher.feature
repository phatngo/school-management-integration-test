Feature: Delete a single teacher

  Background: Add a teacher successfully
    Given I add a new teacher with the following profile:
      | name | Julian |

  Scenario: Delete a teacher successfully
    When I delete the added teacher
    Then I see the teacher is deleted successfully

  Scenario Outline: Failed to delete a non-existent teacher
    When I delete the teacher with id: <id>
    Then I fail to delete the teacher as the teacher with <id> is not found

    Examples:
      | id |
      | -1 |
