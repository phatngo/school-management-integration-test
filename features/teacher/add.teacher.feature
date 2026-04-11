Feature: Add a teacher

  Scenario Outline: Add a teacher successfully
    When I add a new teacher with the following profile:
      | name | <name> |
    Then I see the teacher is created successfully with the following profile:
      | name | <name> |

    Examples:
      | name  |
      | David |

  Scenario Outline: Failed to add a teacher with an invalid names
    When I add a new teacher with the following profile:
      | name | <inValidName> |
    Then I fail to add the teacher as name is invalid

    Examples:
      | inValidName |
      | empty       |
      | null        |
      | true        |
      |           1 |
