Feature: Delete a single teacher

  Scenario: Delete a teacher successfully
    Given a teacher with the following profile has existed in the system:
      | name | Phat |
    When I delete the existing teacher
    Then I see the teacher is deleted successfully

  Scenario Outline: Failed to delete a non-existent teacher
    When I delete the teacher with id: "<id>"
    Then I fail to delete the teacher as the teacher with "<id>" is not found

    Examples:
      | id    |
      |    -1 |
      | true  |
      | false |
      | null  |
      | empty |
