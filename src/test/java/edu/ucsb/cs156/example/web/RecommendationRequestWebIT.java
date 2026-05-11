package edu.ucsb.cs156.example.web;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class RecommendationRequestWebIT extends WebTestCase {
  @Test
  public void admin_user_can_create_edit_delete_recommendationrequest() throws Exception {
    setupUser(true);

    page.getByText("RecommendationRequest").click();

    page.getByText("Create Recommendation Request").click();
    assertThat(page.getByText("Create New Recommendation Request")).isVisible();
    page.getByTestId("RecommendationRequestForm-requesterEmail").fill("andrewbryan@ucsb.edu");
    page.getByTestId("RecommendationRequestForm-professorEmail").fill("conrad@ucsb.edu");
    page.getByTestId("RecommendationRequestForm-explanation").fill("A great explanation");
    page.getByTestId("RecommendationRequestForm-done").fill("true");
    page.getByTestId("RecommendationRequestForm-dateRequested").fill("2022-02-22T00:00");
    page.getByTestId("RecommendationRequestForm-dateNeeded").fill("2023-03-22T00:00");
    page.getByTestId("RecommendationRequestForm-submit").click();

    assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-requesterEmail"))
        .hasText("andrewbryan@ucsb.edu");
    assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-professorEmail"))
        .hasText("conrad@ucsb.edu");
    assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-dateRequested"))
        .hasText("2022-02-22T00:00:00");
    assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-dateNeeded"))
        .hasText("2023-03-22T00:00:00");
    assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-explanation"))
        .hasText("A great explanation");
    assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-done")).hasText("true");

    page.getByTestId("RecommendationRequestTable-cell-row-0-col-Edit-button").click();
    assertThat(page.getByText("Edit RecommendationRequest")).isVisible();
    page.getByTestId("RecommendationRequestForm-explanation").fill("This is a bad explanation");
    page.getByTestId("RecommendationRequestForm-submit").click();

    assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-explanation"))
        .hasText("This is a bad explanation");

    page.getByTestId("RecommendationRequestTable-cell-row-0-col-Delete-button").click();

    assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-id")).not().isVisible();
  }

  @Test
  public void regular_user_cannot_create_restaurant() throws Exception {
    setupUser(false);

    page.getByText("RecommendationRequest").click();

    assertThat(page.getByText("Create Recommendation Request")).not().isVisible();
    assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-id")).not().isVisible();
  }
}
