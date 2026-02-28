Feature: Add a teacher

  Scenario: Add a teacher successfully
    When I add a new teacher with the following profile:
      | name | David |
    Then I see the teacher is created successfully