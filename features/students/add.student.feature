Feature: Add a student

  Scenario: Add a student successfully
    Given a teacher with the following profile has existed in the system:
      | name | Phat |
    And a class with the following information has existed in the system:
      | name       | Math 101             |
      | teacher_id | {exisitingTeacherId} |
      | class_type | primary              |
    When I add a new student with the following profile:
      | name         | John               |
      | phone_number |       +84907055981 |
      | class_id     | {existingClassId} |
    Then I see the student is added successfully with the following profile:
      | name         | John               |
      | phone_number |       +84907055981 |
      | class_id     | {existingClassId} |

  Scenario Outline: Failed to add a student with invalid name
    Given a teacher with the following profile has existed in the system:
      | name | Phat |
    And a class with the following information has existed in the system:
      | name       | Math 101             |
      | teacher_id | {exisitingTeacherId} |
      | class_type | primary              |
    When I add a new student with the following profile:
      | name         | <invalidName>      |
      | phone_number |       +84907055981 |
      | class_id     | {exisitingClassId} |
    Then I fail to add the student as student name should be string

    Examples:
      | invalidName |
      | null        |
      | true        |
      |           1 |

  Scenario Outline: Failed to add a student with invalid phone number
    Given a teacher with the following profile has existed in the system:
      | name | Phat |
    And a class with the following information has existed in the system:
      | name       | Math 101             |
      | teacher_id | {exisitingTeacherId} |
      | class_type | primary              |
    When I add a new student with the following profile:
      | name         | John                 |
      | phone_number | <invalidPhoneNumber> |
      | class_id     | {exisitingClassId}   |
    Then I fail to add the student as phone number should be string

    Examples:
      | invalidPhoneNumber |
      | null               |
      | true               |
      |                  1 |

  Scenario Outline: Failed to add a student with a non-existing class
    When I add a new student with the following profile:
      | name         | John             |
      | phone_number |     +84907058976 |
      | class_id     | <invalidClassId> |
    Then I fail to add the student as class with id: <invalidClassId> is not existing

    Examples:
      | invalidClassId |
      |             -1 |
      |           9999 |
