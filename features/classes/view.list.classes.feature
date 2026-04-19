Feature: View list of classes

  Scenario: View list of classes
    When I view the default list of classes
    Then I see the page 1 of the list of classes with limit of 10 are fetched correctly

  Scenario Outline: View pages of classes successfully
    When I view the list of classes with the following pagination options
      | page | <page> |
    Then I see the page <page> of the list of classes with limit of 10 are fetched correctly

    Examples:
      | page |
      |    2 |

  Scenario Outline: View limits of classes successfully
    When I view the list of classes with the following pagination options
      | limit | <limit> |
    Then I see the page 1 of the list of classes with limit of <limit> are fetched correctly

    Examples:
      | limit |
      |   100 |

  Scenario: Failed to view the list of classes with invalid limits
    When I view the list of classes with the following pagination options
      | limit | <limit> |
    Then I fail to view the list of classes due to invalid limits

    Examples:
      | limit |
      |     0 |
      |    -1 |
      | true  |
      | null  |
      | abc   |

  Scenario: Failed to view the list of classes with invalid page numbers
    When I view the list of classes with the following pagination options
      | page | <page> |
    Then I fail to view the list of classes due to invalid page number

    Examples:
      | page |
      |     0 |
      |    -1 |
      | true  |
      | null  |
      | abc   |

  Scenario Outline: View pages of classes with all valid options successfully
    When I view the list of classes with the following pagination options
      | page  | <page>  |
      | limit | <limit> |
    Then I see the page <page> of the list of classes with limit of <limit> are fetched correctly

    Examples:
      | page | limit |
      |    1 |   100 |
      |    2 |    50 |
      |    3 |    10 |