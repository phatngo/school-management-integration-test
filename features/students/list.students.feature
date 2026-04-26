@focus
Feature: View list of students

  Scenario: View the default list of students successfully
    When I view the default list of students
    Then I see the page 1 of the list of students with limit of 10 are fetched correctly

  Scenario Outline: View pages of students successfully
    When I view the list of students with the following options:
      | page | <page> |
    Then I see the page <page> of the list of students with limit of 10 are fetched correctly

    Examples:
      | page |
      |    2 |

  Scenario Outline: View list of students with different limits successfully
    When I view the list of students with the following options:
      | limit | <limit> |
    Then I see the page 1 of the list of students with limit of <limit> are fetched correctly

    Examples:
      | limit |
      |    10 |
      |   100 |

  Scenario: Failed to view the list of students with invalid limits
    When I view the list of students with the following options:
      | limit | <limit> |
    Then I fail to view the list of students due to invalid limits

    Examples:
      | limit |
      |     0 |
      |    -1 |
      | true  |
      | null  |
      | abc   |

  Scenario: Failed to view the list of students with invalid page numbers
    When I view the list of students with the following options:
      | page | <page> |
    Then I fail to view the list of students due to invalid page number

    Examples:
      | page |
      |    0 |
      |   -1 |
      | true |
      | null |
      | abc  |

  Scenario Outline: View list of students with all valid pagination options successfully
    When I view the list of students with the following options:
      | page  | <page>  |
      | limit | <limit> |
    Then I see the page <page> of the list of students with limit of <limit> are fetched correctly

    Examples:
      | page | limit |
      |    1 |   100 |
      |    2 |    50 |
      |    3 |    10 |
