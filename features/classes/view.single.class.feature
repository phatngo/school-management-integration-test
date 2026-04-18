Feature: View a class

  Scenario: View an existing class successfully
    Given a teacher with the following profile has existed in the system:
      | name | Phat |
    And a class with the following information has existed in the system:
      | name       | Math 101             |
      | teacher_id | {exisitingTeacherId} |
      | class_type | primary              |
    When I view the existing class
    Then I see the class is fetched correctly with the following details:
      | name       | Math 101             |
      | teacher_id | {exisitingTeacherId} |
      | class_type | primary              |

  Scenario Outline: Failed to view a non-existing class
    When I view the class with id: "<id>"
    Then I fail to see the class as the class with id: "<id>" is not found

    Examples:
      | id |
      | -1 |
