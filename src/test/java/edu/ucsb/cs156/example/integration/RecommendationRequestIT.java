package edu.ucsb.cs156.example.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.example.entities.RecommendationRequest;
import edu.ucsb.cs156.example.repositories.RecommendationRequestRepository;
import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.services.CurrentUserService;
import edu.ucsb.cs156.example.services.GrantedAuthoritiesService;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import java.time.LocalDateTime;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("integration")
@Import(TestConfig.class)
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class RecommendationRequestIT {
  @Autowired public CurrentUserService currentUserService;

  @Autowired public GrantedAuthoritiesService grantedAuthoritiesService;

  @Autowired RecommendationRequestRepository recommendationRequestRepository;

  @Autowired public MockMvc mockMvc;

  @Autowired public ObjectMapper mapper;

  @MockitoBean UserRepository userRepository;

  @WithMockUser(roles = {"USER"})
  @Test
  public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {
    // arrange

    RecommendationRequest recReq =
        RecommendationRequest.builder()
            .requesterEmail("requester@ucsb.edu")
            .professorEmail("professor@ucsb.edu")
            .explanation("A good reason")
            .dateRequested(LocalDateTime.of(2022, 2, 2, 2, 22))
            .dateNeeded(LocalDateTime.of(2026, 3, 3, 3, 33))
            .done(false)
            .build();
    // .name("Taco Bell").description("Mexican").build();

    recommendationRequestRepository.save(recReq);

    // act
    MvcResult response =
        mockMvc
            .perform(get("/api/RecommendationRequest?id=1"))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    String expectedJson = mapper.writeValueAsString(recReq);
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedJson, responseString);
  }

  @WithMockUser(roles = {"ADMIN", "USER"})
  @Test
  public void an_admin_user_can_post_a_new_restaurant() throws Exception {
    // arrange

    RecommendationRequest recReq1 =
        RecommendationRequest.builder()
            .id(1L)
            .requesterEmail("requester@ucsb.edu")
            .professorEmail("professor@ucsb.edu")
            .explanation("A good reason")
            .dateRequested(LocalDateTime.of(2022, 2, 2, 2, 22))
            .dateNeeded(LocalDateTime.of(2026, 3, 3, 3, 33))
            .done(false)
            .build();

    // act
    MvcResult response =
        mockMvc
            .perform(
                post("/api/RecommendationRequest/post?requesterEmail=requester@ucsb.edu&professorEmail=professor@ucsb.edu&explanation=A good reason&done=false&dateRequested=2022-02-02T02:22&dateNeeded=2026-03-03T03:33")
                    .with(csrf()))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    String expectedJson = mapper.writeValueAsString(recReq1);
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedJson, responseString);
  }
}
