Feature: View single student

  Scenario: View single student successfully
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
    When I view the existing student
    Then I see the student is fetched correctly with the following details:
      | name         | Long              |
      | phone_number |      +84907056718 |
      | class_id     | {existingClassId} |

  Scenario: Failed to view single student with non-existing student id
    When I view the student with id: "<studentId>"
    Then I fail to see the student as the student with id: "<studentId>" is not found

    Examples:
      | studentId |
      |        -1 |
