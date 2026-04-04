Feature: View a single teacher

  Scenario Outline: View a single teacher successfully
    Given a teacher with the following profile has existed in the system:
      | name | <name> |
    When I view the existing teacher
    Then I see the existing teacher is fectched successfully with the following profile:
      | name | <name> |

    Examples:
      | name |
      | Phat |

  Scenario Outline: Failed to view a non-existent teacher
    When I view the teacher with id: "<id>"
    Then I fail to view the teacher as the teacher with "<id>" is not found

    Examples:
      | id |
      | -1 |
