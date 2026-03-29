Feature: View list of teachers

  Scenario: View list of teachers successfully
    When I view page 1 with limit 10 of teachers
    Then I see the list of teachers are fetched correctly
