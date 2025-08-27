import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../test-utils";
import Step1Personal from "../pages/Step1Personal";

jest.mock("../lib/storage", () => {
  const actual = jest.requireActual("../lib/storage");
  return {
    ...actual,                 // keep real debounce (and anything else)
    loadForm: jest.fn(() => null),
    saveForm: jest.fn(),
    clearForm: jest.fn(),
  };
});


// Spy on navigation
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

describe("Step1Personal", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  test("renders and Next is disabled initially", () => {
    renderWithProviders(<Step1Personal />);

    expect(
      screen.getByRole("heading", { name: /personal info/i })
    ).toBeInTheDocument();

    const nextBtn = screen.getByRole("button", { name: /next/i });
    expect(nextBtn).toBeDisabled();
  });

  test("submits valid form and navigates to Step 2", async () => {
    renderWithProviders(<Step1Personal />);
    const user = userEvent.setup();

    // Fill valid inputs
    await user.type(screen.getByLabelText(/name/i), "Motasim Ali");
    await user.type(screen.getByLabelText(/national id/i), "A1234567");
    const dob = screen.getByLabelText(/date of birth/i);
    await user.clear(dob);
    await user.type(dob, "1990-01-01");
    await user.selectOptions(screen.getByLabelText(/gender/i), "Male");
    await user.type(screen.getByLabelText(/address/i), "123 Main St");
    await user.type(screen.getByLabelText(/city/i), "Dubai");
    await user.type(screen.getByLabelText(/state/i), "Dubai");
    await user.type(
      screen.getByLabelText(/country/i),
      "United Arab Emirates"
    );
    await user.type(screen.getByLabelText(/phone/i), "+971500000000");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");

    const nextBtn = screen.getByRole("button", { name: /next/i });
    expect(nextBtn).toBeEnabled();

    await user.click(nextBtn);
    expect(mockNavigate).toHaveBeenCalledWith("/step-2");
  });
});
