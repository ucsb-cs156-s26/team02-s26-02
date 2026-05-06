import { fireEvent, getByLabelText, getByTestId, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router";

import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";
import { MenuItemReviewFixtures } from "fixtures/MenuItemReviewFixtures";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const originalModule = await vi.importActual("react-router");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("MenuItemReviewForm tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = [
    "itemId",
    "reviewerEmail",
    "stars",
    "Date (iso format)",
    "comments",
  ];
  const testId = "MenuItemReviewForm";

  test("renders correctly with no initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });
  });

  test("renders correctly when passing in initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewForm
            initialContents={MenuItemReviewFixtures.oneMenuItemReview}
          />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
    expect(screen.getByText(`Id`)).toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewForm />
        </Router>
      </QueryClientProvider>,
    );
    expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
    const cancelButton = screen.getByTestId(`${testId}-cancel`);

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  test("that the correct validations are performed", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();
    const submitButton = screen.getByText(/Create/);
    fireEvent.click(submitButton);

    await screen.findByText(/itemId is required/);
    expect(screen.getByText(/reviewerEmail is required/)).toBeInTheDocument();
    expect(screen.getByText(/stars is required/)).toBeInTheDocument();
    expect(screen.getByText(/dateReviewed is required/)).toBeInTheDocument();
    expect(screen.getByText(/comments is required/)).toBeInTheDocument();
  });
  test("stars boundary", async () => {
    render(
        <QueryClientProvider client={queryClient}>
            <Router>
                <MenuItemReviewForm />
            </Router>
        </QueryClientProvider>,
    );

    const starsInput = screen.getByTestId("MenuItemReviewForm-stars");
    const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

    fireEvent.change(starsInput, { target: { value: '6' } });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/Maximum Rating is 5/)).toBeInTheDocument();

    fireEvent.change(starsInput, { target: { value: '-1' } });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/Minimum Rating is 0/)).toBeInTheDocument();
});
});
