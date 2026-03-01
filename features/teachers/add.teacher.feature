Feature: Add a teacher

  Scenario: Add a teacher successfully
    When I add a new teacher with the following profile:
      | name | David |
    Then I see the teacher is created successfully

  Scenario: Failed to add a teacher with an empty name
    When I add a new teacher with the following profile:
      | name | <empty> |
    Then I fail to add the teacher as name cannot be empty
