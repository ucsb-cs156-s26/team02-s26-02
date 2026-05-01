import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemForm";
import { ucsbDiningCommonsMenuItemsFixtures } from "fixtures/ucsbDiningCommonsMenuItemFixtures";
import { BrowserRouter as Router } from "react-router";
import { expect } from "vitest";

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const originalModule = await vi.importActual("react-router");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("UCSBDiningCommonsMenuItemForm tests", () => {
  const expectedHeaders = ["Dining Commons Code", "Name", "Station"];
  const testId = "UCSBDiningCommonsMenuItemForm";

  test("renders correctly", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm />
      </Router>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expect(screen.getByTestId(`${testId}-submit`)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });
  });

  test("renders correctly when passing in a UCSBDiningCommonsMenuItem", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm
          initialContents={
            ucsbDiningCommonsMenuItemsFixtures.oneDiningCommonsMenuItem
          }
        />
      </Router>,
    );
    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
    expect(screen.getByText(`Id`)).toBeInTheDocument();
  });

  test("that the correct validations are performed", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm />
      </Router>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();
    const submitButton = screen.getByText(/Create/);
    fireEvent.click(submitButton);

    await screen.findByText(/Name is required/);
    expect(
      screen.getByText(/Dining Commons Code is required/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Station is required/)).toBeInTheDocument();

    const nameInput = screen.getByTestId(`${testId}-name`);
    const diningCommonsCodeInput = screen.getByTestId(
      `${testId}-diningCommonsCode`,
    );
    const stationInput = screen.getByTestId(`${testId}-station`);

    fireEvent.change(nameInput, { target: { value: "a".repeat(31) } });
    fireEvent.click(submitButton);
    fireEvent.change(diningCommonsCodeInput, {
      target: { value: "a".repeat(31) },
    });
    fireEvent.click(submitButton);
    fireEvent.change(stationInput, { target: { value: "a".repeat(31) } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getAllByText(/Max length 30 characters/)).toHaveLength(3);
    });
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm />
      </Router>,
    );
    expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
    const cancelButton = screen.getByTestId(`${testId}-cancel`);

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
