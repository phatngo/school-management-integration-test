Feature: Delete a student

  Scenario: Delete a student successfully
    Given a teacher with the following profile has existed in the system:
      | name | Phat |
    And a class with the following information has existed in the system:
      | name       | Math 101             |
      | teacher_id | {exisitingTeacherId} |
      | class_type | primary              |
    And a student with the following information has existed in the system:
      | name         | Long              |
      | phone_number |      +84907056718 |
      | class_id     | {existingClassId} |
    When I delete the existing student
    Then I see the student is deleted successfully

  Scenario Outline: Failed to delete a student
    When I delete the student with id: "<studentId>"
    Then I fail to delete the student with id: "<studentId>" is not found

    Examples:
      | studentId |
      |        -1 |
