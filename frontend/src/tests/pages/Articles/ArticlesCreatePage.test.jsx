import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ArticlesCreatePage from "main/pages/Articles/ArticlesCreatePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { vi } from "vitest";

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

describe("ArticlesCreatePage tests", () => {
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
          <ArticlesCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /articles", async () => {
    const queryClient = new QueryClient();
    const article = {
      id: 3,
      title: "Test Article",
      url: "https://example.com",
      explanation: "This is a test article",
      email: "test@example.com",
      localDateTime: "2024-01-01T00:00:00",
    };

    axiosMock.onPost("/api/articles/post").reply(202, article);

    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toBeInTheDocument();
    });

    const titleInput = screen.getByLabelText("Title");
    expect(titleInput).toBeInTheDocument();

    const urlInput = screen.getByLabelText("URL");
    expect(urlInput).toBeInTheDocument();

    const explanationInput = screen.getByLabelText("Explanation");
    expect(explanationInput).toBeInTheDocument();

    const emailInput = screen.getByLabelText("Email");
    expect(emailInput).toBeInTheDocument();

    const createButton = screen.getByText("Create");
    expect(createButton).toBeInTheDocument();

    const localDateTimeInput = screen.getByLabelText("Date (iso format)");
    fireEvent.change(localDateTimeInput, {
      target: { value: "2024-01-01T00:00" },
    });

    fireEvent.change(titleInput, { target: { value: "Test Article" } });
    fireEvent.change(urlInput, { target: { value: "https://example.com" } });
    fireEvent.change(explanationInput, {
      target: { value: "This is a test article" },
    });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      title: "Test Article",
      url: "https://example.com",
      explanation: "This is a test article",
      email: "test@example.com",
      localDateTime: "2024-01-01T00:00:00",
    });

    // Verify console.log calls with correct messages and data
    expect(consoleLogSpy).toHaveBeenCalledWith("submitting data:", {
      title: "Test Article",
      url: "https://example.com",
      explanation: "This is a test article",
      email: "test@example.com",
      dateAdded: "2024-01-01T00:00",
    });

    expect(consoleLogSpy).toHaveBeenCalledWith("params being sent:", {
      title: "Test Article",
      url: "https://example.com",
      explanation: "This is a test article",
      email: "test@example.com",
      localDateTime: "2024-01-01T00:00:00",
    });

    expect(mockToast).toBeCalledWith(
      "New article Created - id: 3 name: Test Article",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/articles" });

    consoleLogSpy.mockRestore();
  });
});
