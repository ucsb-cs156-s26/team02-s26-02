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
public class ArticleWebIT extends WebTestCase {
  @Test
  public void admin_user_can_create_edit_delete_article() throws Exception {
    setupUser(true);

    page.getByText("Articles").click();
    page.getByText("Create Article").click();

    assertThat(page.getByText("Create New Article")).isVisible();

    page.getByTestId("ArticlesForm-title").fill("Test Title");
    page.getByTestId("ArticlesForm-url").fill("Test Article URL");
    page.getByTestId("ArticlesForm-explanation").fill("Test Article Explanation");
    page.getByTestId("ArticlesForm-email").fill("Test Article Email");
    page.getByTestId("ArticlesForm-dateAdded").fill("2026-05-06T12:31");
    page.getByTestId("ArticlesForm-submit").click();

    assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-title")).hasText("Test Title");

    page.getByTestId("ArticlesTable-cell-row-0-col-Edit-button").click();
    assertThat(page.getByText("Edit Article")).isVisible();
    page.getByTestId("ArticlesForm-title").fill("New Test Title");
    page.getByTestId("ArticlesForm-submit").click();

    assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-title")).hasText("New Test Title");

    page.getByTestId("ArticlesTable-cell-row-0-col-Delete-button").click();

    assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-title")).not().isVisible();
  }
}
