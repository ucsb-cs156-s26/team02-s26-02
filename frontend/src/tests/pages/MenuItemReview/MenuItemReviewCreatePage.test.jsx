import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MenuItemReviewCreatePage from "main/pages/MenuItemReview/MenuItemReviewCreatePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = vi.fn();
vi.mock("react-toastify", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    toast: vi.fn((x) => mockToast(x)),
  };
});

const mockNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    Navigate: vi.fn((x) => {
      mockNavigate(x);
      return null;
    }),
  };
});

describe("MenuItemReviewCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    vi.clearAllMocks();
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  const queryClient = new QueryClient();
  test("renders without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("itemId")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /MenuItemReview", async () => {
    const queryClient = new QueryClient();
    const MenuItemReview = {
      id: 1,
      itemId: 17,
      reviewerEmail: "kaijunli@ucsb.edu",
      stars: 5,
      dateReviewed: "2022-01-02T12:00:00Z",
      comments: "skibidi",
    };

    axiosMock.onPost("/api/menuitemreview/post").reply(202, MenuItemReview);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("itemId")).toBeInTheDocument();
    });

    const itemIdInput = screen.getByLabelText("itemId");
    expect(itemIdInput).toBeInTheDocument();

    const reviewerEmailInput = screen.getByLabelText("reviewerEmail");
    expect(reviewerEmailInput).toBeInTheDocument();

    const starsInput = screen.getByLabelText("stars");
    expect(starsInput).toBeInTheDocument();

    const dateReviewedInput = screen.getByLabelText("dateReviewed");
    expect(dateReviewedInput).toBeInTheDocument();

    const commentsInput = screen.getByLabelText("comments");
    expect(commentsInput).toBeInTheDocument();


    const createButton = screen.getByText("Create");
    expect(createButton).toBeInTheDocument();

    fireEvent.change(itemIdInput, { target: { value: "17", } });
    fireEvent.change(reviewerEmailInput, { target: { value: "kaijunli@ucsb.edu"} });
    fireEvent.change(starsInput, { target: { value: "5"} });
    fireEvent.change(dateReviewedInput, { target: { value: "2022-01-02T12:00:00"} });
    fireEvent.change(commentsInput, { target: { value: "skibidi"} });
    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      itemId: "17",
      reviewerEmail: "kaijunli@ucsb.edu",
      stars: "5",
      dateReviewed: "2022-01-02T12:00Z",
      comments: "skibidi",
    });

    // assert - check that the toast was called with the expected message
    expect(mockToast).toHaveBeenCalledWith(
      "New MenuItemReview Created - id: 1 reviewerEmail: kaijunli@ucsb.edu stars: 5 dateReviewed: 2022-01-02T12:00:00Z comments: skibidi",
    );
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/MenuItemReview" });
  });
});
