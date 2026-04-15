Feature: Add a new class

  Scenario: Add a new class successfully
    Given a teacher with the following profile has existed in the system:
      | name | Phat |
    When I add a new class with the following information:
      | name       | Math 102             |
      | teacher_id | {exisitingTeacherId} |
      | class_type | primary              |
    Then I see the new class is added successfully with the following information:
      | name       | Math 102             |
      | teacher_id | {exisitingTeacherId} |
      | class_type | primary              |

  Scenario Outline: Add a new class successfully with valid class types
    Given a teacher with the following profile has existed in the system:
      | name | Phat |
    When I add a new class with the following information:
      | name       | Math 102             |
      | teacher_id | {exisitingTeacherId} |
      | class_type | <classType>          |
    Then I see the new class is added successfully with the following information:
      | name       | Math 102             |
      | teacher_id | {exisitingTeacherId} |
      | class_type | <classType>          |

    Examples:
      | classType  |
      | elementary |
      | high       |

  Scenario Outline: Failed to add a class with an invalid name type
    Given a teacher with the following profile has existed in the system:
      | name | Phat |
    When I add a new class with the following information:
      | name       | <invalidName>        |
      | teacher_id | {exisitingTeacherId} |
      | class_type | primary              |
    Then I fail to add the class as name is invalid

    Examples:
      | invalidName |
      | empty       |
      | null        |
      | true        |
      |           1 |

  Scenario: Failed to add a class with a duplicate name
    Given a teacher with the following profile has existed in the system:
      | name | Phat |
    And a class with the following information has existed in the system:
      | name       | Math 102             |
      | teacher_id | {exisitingTeacherId} |
      | class_type | primary              |
    When I add a new class with the following information:
      | name       | Math 102             |
      | teacher_id | {exisitingTeacherId} |
      | class_type | primary              |
    Then I fail to add the class as class name is duplicate

  Scenario Outline: Failed to add a class with an invalid teacher id type
    When I add a new class with the following information:
      | name       | Math 102           |
      | teacher_id | <invalidTeacherId> |
      | class_type | primary            |
    Then I fail to add the class as teacher id is invalid

    Examples:
      | invalidTeacherId |
      | empty            |
      | null             |
      | true             |
      | teacher1         |

  Scenario Outline: Failed to add a class with a non existing teacher
    When I add a new class with the following information:
      | name       | Math 102 |
      | teacher_id | <id>     |
      | class_type | primary  |
    Then I fail to add the class as teacher with id: <id> is non existing

    Examples:
      | id |
      | -1 |

  Scenario Outline: Failed to add a class with an invalid class type
    Given a teacher with the following profile has existed in the system:
      | name | Phat |
    When I add a new class with the following information:
      | name       | Math 102             |
      | teacher_id | {exisitingTeacherId} |
      | class_type | <classType>          |
    Then I fail to add the class as class type is invalid

    Examples:
      | classType |
      | empty     |
      | null      |
      | true      |
      |         1 |

  Scenario Outline: Failed to add a class with an non-allowed value
    Given a teacher with the following profile has existed in the system:
      | name | Phat |
    When I add a new class with the following information:
      | name       | Math 102             |
      | teacher_id | {exisitingTeacherId} |
      | class_type | pdd                  |
    Then I fail to add the class as class type is not the allowed values
