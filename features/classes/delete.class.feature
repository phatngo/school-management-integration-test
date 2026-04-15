Feature: Delete a class

  Background:
    Given a teacher with the following profile has existed in the system:
      | name | Phat |
    And a class with the following information has existed in the system:
      | name       | Math 101             |
      | teacher_id | {exisitingTeacherId} |
      | class_type | primary              |

    Scenario: Delete an existing class successfully
      When I delete the existing class
      Then I see the class is deleted successfully

    Scenario Outline: Failed to delete a non-existing class
      When I delete the class with id: "<id>"
      Then I fail to delete the class with id: "<id>" is not found

      Examples:
        | id |
        | -1 |