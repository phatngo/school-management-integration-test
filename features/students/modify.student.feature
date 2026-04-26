@focus
Feature: Modify a student

  Background:
    Given a teacher with the following profile has existed in the system:
      | name | Phat |
    And a class with the following information has existed in the system:
      | name       | Math 101             |
      | teacher_id | {exisitingTeacherId} |
      | class_type | primary              |
    And a student with the following information has existed in the system:
      | name         | John Doe          |
      | phone_number | +84907055981      |
      | class_id     | {existingClassId} |

  Scenario: Modify a student successfully
    When I modify the existing student with the following profile:
      | name         | Jane Doe          |
      | phone_number | 555-0456          |
      | class_id     | {existingClassId} |
    Then I see the student is modified successfully with the following profile:
      | name         | Jane Doe          |
      | phone_number | 555-0456          |
      | class_id     | {existingClassId} |

  Scenario Outline: Failed to modify a non-existing student
    When I modify the student with id: "<id>" with the following profile:
      | name         | Jane Doe |
      | phone_number | 555-0456 |
      | class_id     |        1 |
    Then I fail to modify the student as student with id: "<id>" is not found

    Examples:
      | id |
      | -1 |

  Scenario: Failed to modify a student with an empty name
    When I modify the existing student with the following profile:
      | name         | empty             |
      | phone_number | 555-0456          |
      | class_id     | {existingClassId} |
    Then I fail to modify the student as name should not be empty

  Scenario Outline: Failed to modify a student with an invalid name
    When I modify the existing student with the following profile:
      | name         | <invalidName>     |
      | phone_number | 555-0456          |
      | class_id     | {existingClassId} |
    Then I fail to modify the student as name should be string

    Examples:
      | invalidName |
      | true        |
      |           1 |

  Scenario: Failed to modify a student with an empty phone number
    When I modify the existing student with the following profile:
      | name         | Jane Doe          |
      | phone_number | empty             |
      | class_id     | {existingClassId} |
    Then I fail to modify the student as phone number should not be empty

  Scenario Outline: Failed to modify a student with an invalid class_id
    When I modify the existing student with the following profile:
      | name         | Jane Doe         |
      | phone_number | 555-0456         |
      | class_id     | <invalidClassId> |
    Then I fail to modify the student as class_id should be number

    Examples:
      | invalidClassId |
      | true           |
      | class1         |

  Scenario: Failed to modify a student with a non-existing class
    When I modify the existing student with the following profile:
      | name         | Jane Doe |
      | phone_number | 555-0456 |
      | class_id     |       -1 |
    Then I fail to modify the student as class with id: -1 is not found
