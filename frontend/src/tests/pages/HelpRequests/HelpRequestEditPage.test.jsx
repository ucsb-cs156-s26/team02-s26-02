import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import HelpRequestEditPage from "main/pages/HelpRequests/HelpRequestEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "tests/testutils/mockConsole";

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
    useParams: vi.fn(() => ({
      id: 17,
    })),
    Navigate: vi.fn((x) => {
      mockNavigate(x);
      return null;
    }),
  };
});

let axiosMock;
describe("HelpRequestEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/helprequests", { params: { id: 17 } }).timeout();
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Help Request");
      expect(screen.queryByTestId("HelpRequest-requesterEmail")).not.toBeInTheDocument();
      restoreConsole();
    });
  });

  describe("tests where backend is working normally", () => {
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/helprequests", { params: { id: 17 } }).reply(200, {
        id: 17,
        requesterEmail: "davidchen@ucsb.edu",
        teamId: "02",
        tableOrBreakoutRoom: "Table 2",
        requestTime: "2026-04-28T12:30:30.000",
        explanation: "I need help with the project",
        solved: true,
      });
      axiosMock.onPut("/api/helprequests").reply(200, {
        id: 17,
        requesterEmail: "davidchen123@ucsb.edu",
        teamId: "03",
        tableOrBreakoutRoom: "Table 3",
        requestTime: "2030-04-28T12:30:30.000",
        explanation: "I need a lot of help with the project",
        solved: false,
      });
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("HelpRequestForm-id");

      const idField = screen.getByTestId("HelpRequestForm-id");
      const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail");
      const teamIdField = screen.getByLabelText("Team ID");
      const tableOrBreakoutRoomField = screen.getByLabelText("Table or Breakout Room");
      const requestTimeField = screen.getByLabelText("Request Time in UTC");
      const explanationField = screen.getByLabelText("Explanation");
      const solvedField = screen.getByLabelText("Solved");
      const submitButton = screen.getByText("Update");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");
      expect(requesterEmailField).toBeInTheDocument();
      expect(requesterEmailField).toHaveValue("davidchen@ucsb.edu");
      expect(teamIdField).toBeInTheDocument();
      expect(teamIdField).toHaveValue("02");
      expect(tableOrBreakoutRoomField).toBeInTheDocument();
      expect(tableOrBreakoutRoomField).toHaveValue("Table 2");
      expect(requestTimeField).toBeInTheDocument();
      expect(requestTimeField).toHaveValue("2026-04-28T12:30:30.000");
      expect(explanationField).toBeInTheDocument();
      expect(explanationField).toHaveValue("I need help with the project");
      expect(solvedField).toBeInTheDocument();
      expect(solvedField).toHaveValue("true");

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(requesterEmailField, {
        target: { value: "davidchen123@ucsb.edu" },
      });
      fireEvent.change(teamIdField, {
        target: { value: "03" },
      });
      fireEvent.change(tableOrBreakoutRoomField, {
        target: { value: "Table 3" },
      });
      fireEvent.change(requestTimeField, {
        target: { value: "2030-04-28T12:30" },
      });
      fireEvent.change(explanationField, {
        target: { value: "I need a lot of help with the project" },
      });
      fireEvent.change(solvedField, {
        target: { value: "false" },
      });
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "Help Request Updated - id: 17 explanation: I need a lot of help with the project",
      );

      expect(mockNavigate).toBeCalledWith({ to: "/helprequests" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          requesterEmail: "davidchen123@ucsb.edu",
          teamId: "03",
          tableOrBreakoutRoom: "Table 3",
          requestTime: "2030-04-28T12:30",
          explanation: "I need a lot of help with the project",
          solved: "false",
        }),
      ); // posted object
    });

     test("Changes when you click Update", async () => {
       render(
         <QueryClientProvider client={queryClient}>
           <MemoryRouter>
             <HelpRequestEditPage />
           </MemoryRouter>
         </QueryClientProvider>,
       );

      await screen.findByTestId("HelpRequestForm-id");

      const idField = screen.getByTestId("HelpRequestForm-id");
      const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail");
      const teamIdField = screen.getByLabelText("Team ID");
      const tableOrBreakoutRoomField = screen.getByLabelText("Table or Breakout Room");
      const requestTimeField = screen.getByLabelText("Request Time in UTC");
      const explanationField = screen.getByLabelText("Explanation");
      const solvedField = screen.getByLabelText("Solved");
      const submitButton = screen.getByText("Update");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");
      expect(requesterEmailField).toBeInTheDocument();
      expect(requesterEmailField).toHaveValue("davidchen@ucsb.edu");
      expect(teamIdField).toBeInTheDocument();
      expect(teamIdField).toHaveValue("02");
      expect(tableOrBreakoutRoomField).toBeInTheDocument();
      expect(tableOrBreakoutRoomField).toHaveValue("Table 2");
      expect(requestTimeField).toBeInTheDocument();
      expect(requestTimeField).toHaveValue("2026-04-28T12:30:30.000");
      expect(explanationField).toBeInTheDocument();
      expect(explanationField).toHaveValue("I need help with the project");
      expect(solvedField).toBeInTheDocument();
      expect(solvedField).toHaveValue("true");

      expect(submitButton).toHaveTextContent("Update");


       fireEvent.change(requesterEmailField, {
         target: { value: "davidchen123@ucsb.edu" },
       });
       fireEvent.change(teamIdField, {
         target: { value: "03" },
       });
       fireEvent.change(tableOrBreakoutRoomField, {
         target: { value: "Table 3" },
       });
       fireEvent.change(requestTimeField, {
         target: { value: "2030-04-28T12:30" },
       });
       fireEvent.change(explanationField, {
         target: { value: "I need a lot of help with the project" },
       });
       fireEvent.change(solvedField, {
         target: { value: "false" },
       });

       fireEvent.click(submitButton);

       await waitFor(() => expect(mockToast).toBeCalled());
       expect(mockToast).toBeCalledWith(
         "Help Request Updated - id: 17 explanation: I need a lot of help with the project",
       );
       expect(mockNavigate).toBeCalledWith({ to: "/helprequests" });
     });
   });
});
