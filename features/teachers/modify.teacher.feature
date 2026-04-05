Feature: View a single teacher

  Scenario Outline: Modify a teacher successfully
    Given a teacher with the following profile has existed in the system:
      | name | Phat |
    When I modify the existing teacher with the following data:
      | name | <modifiedName> |
    Then I see the teacher is modified successfully with the following data:
      | name | <modifiedName> |

    Examples:
      | modifiedName |
      | Johnson      |

  Scenario Outline: Failed to modify a teacher with an invalid id
    When I modify the teacher with id: "<id>" and the following data:
      | name | Hendrik |
    Then I fail to modify the teacher as the teacher with "<id>" is not found

    Examples:
      | id    |
      |    -1 |
      | true  |
      | false |
      | null  |
      | empty |

  Scenario Outline: Failed to modify a teacher with an invalid names
    Given a teacher with the following profile has existed in the system:
      | name | Phat |
    When I modify the existing teacher with the following data:
      | name | <inValidName> |
    Then I fail to modify the teacher as name is invalid

    Examples:
      | inValidName |
      | empty       |
      | null        |
      | true        |
      |           1 |
