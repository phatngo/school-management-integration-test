Feature: Modify a class

  Background:
    Given a teacher with the following profile has existed in the system:
      | name | Phat |
    And a class with the following information has existed in the system:
      | name       | Math 101             |
      | teacher_id | {exisitingTeacherId} |
      | class_type | primary              |

  Scenario: Modify an existing class successfully
    When I modify the existing class with the following information:
      | name       | Science 101          |
      | teacher_id | {exisitingTeacherId} |
      | class_type | elementary           |
    Then I see the class is modified successfully with the following information:
      | name       | Science 101          |
      | teacher_id | {exisitingTeacherId} |
      | class_type | elementary           |

  Scenario Outline: Modify an existing class successfully with valid class types
    When I modify the existing class with the following information:
      | name       | Math 102             |
      | teacher_id | {exisitingTeacherId} |
      | class_type | <classType>          |
    Then I see the class is modified successfully with the following information:
      | name       | Math 102             |
      | teacher_id | {exisitingTeacherId} |
      | class_type | <classType>          |

    Examples:
      | classType |
      | primary   |
      | high      |

  Scenario: Failed to modify a non-existing class
    When I modify the class with id: <id> with the following information:
      | name       | Math 103             |
      | teacher_id | {exisitingTeacherId} |
      | class_type | primary              |
    Then I fail to modify the class as class with id: <id> is not found

    Examples:
      | id |
      | -1 |

  Scenario Outline: Failed to modify a class with an invalid name
    When I modify the existing class with the following information:
      | name       | <invalidName>        |
      | teacher_id | {exisitingTeacherId} |
      | class_type | primary              |
    Then I fail to modify the class as name is invalid

    Examples:
      | invalidName |
      | empty       |
      | null        |
      | true        |
      |           1 |

  Scenario: Failed to modify a class with a duplicate name
    When I modify the existing class with the following information:
      | name       | {duplicateClassName} |
      | teacher_id | {exisitingTeacherId} |
      | class_type | primary              |
    Then I fail to modify the class as class name is duplicate

  Scenario Outline: Failed to modify a class with an invalid teacher id
    When I modify the existing class with the following information:
      | name       | Math 102           |
      | teacher_id | <invalidTeacherId> |
      | class_type | primary            |
    Then I fail to modify the class as teacher id is invalid

    Examples:
      | invalidTeacherId |
      | empty            |
      | null             |
      | true             |
      | teacher1         |

  Scenario Outline: Failed to modify a class with a non existing teacher
    When I modify the existing class with the following information:
      | name       | Math 102 |
      | teacher_id | <id>     |
      | class_type | primary  |
    Then I fail to modify the class as teacher with id: <id> is non existing

    Examples:
      | id |
      | -1 |

  Scenario Outline: Failed to modify a class with an invalid class type
    When I modify the existing class with the following information:
      | name       | Math 102             |
      | teacher_id | {exisitingTeacherId} |
      | class_type | <classType>          |
    Then I fail to modify the class as class type is invalid

    Examples:
      | classType |
      | empty     |
      | null      |
      | true      |
      |         1 |

  Scenario Outline: Failed to modify a class with an non-allowed value
    When I modify the existing class with the following information:
      | name       | Math 102             |
      | teacher_id | {exisitingTeacherId} |
      | class_type | pdd                  |
    Then I fail to modify the class as class type is not the allowed values
