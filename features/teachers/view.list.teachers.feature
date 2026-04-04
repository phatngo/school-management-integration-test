Feature: View list of teachers

  Scenario: View the default list of teachers successfully with default options
    When I view the default list of teachers
    Then I see the page 1 of the list of teachers with limit of 10 are fetched correctly

  Scenario: View pages of teachers successfully
    When I view the list of teachers with the following options:
      | page | <page> |
    Then I see the page <page> of the list of teachers with limit of 10 are fetched correctly

    Examples:
      | page |
      |    1 |
      |    2 |
      |    3 |

  Scenario: View list of teachers with different limits successfully
    When I view the list of teachers with the following options:
      | limit | <limit> |
    Then I see the page 1 of the list of teachers with limit of <limit> are fetched correctly

    Examples:
      | limit |
      |    10 |
      |   100 |

  Scenario Outline: View pages of teachers with all valid options successfully
    When I view the list of teachers with the following options:
      | page  | <page>  |
      | limit | <limit> |
    Then I see the page <page> of the list of teachers with limit of <limit> are fetched correctly

    Examples:
      | page | limit |
      |    1 |   100 |
      |    2 |    50 |
      |    3 |    10 |
