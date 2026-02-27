Feature: Teacher CRUD

  Scenario: Test
    When I add a new teacher with the following profile:
      | name | David |
    Then I see the teacher is created successfully