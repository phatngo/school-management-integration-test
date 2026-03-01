Feature: View a single teacher

  Background: Add a teacher successfully
    Given I add a new teacher with the following profile:
      | name | Julian |

  Scenario: Modify a teacher successfully
    When I modify the added teacher with the following data:
      | name | Mr. Johnson |
    Then I see the teacher is modified successfully

  Scenario Outline: Failed to modify a non-existent teacher
    When I modify the teacher with id: <id> and the following data:
      | name | Mr. Johnson |
    Then I fail to modify the teacher as the teacher with <id> is not found

    Examples:
      | id |
      | -1 |

  Scenario: Failed to modify a teacher with an empty name
    When I modify the added teacher with the following data:
      | name | <empty> |
    Then I fail to modify the teacher as name cannot be empty
