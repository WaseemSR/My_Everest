import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { useNavigate } from "react-router-dom";
import { login } from "../../src/services/authentication";

import { LoginPage } from "../../src/pages/Login/LoginPage";

// Mock React Router's useNavigate
vi.mock("react-router-dom", () => {
  const navigateMock = vi.fn();
  const useNavigateMock = () => navigateMock;
  return { useNavigate: useNavigateMock };
});

// Mock login service
vi.mock("../../src/services/authentication", () => {
  const loginMock = vi.fn();
  return { login: loginMock };
});

// Helper to fill and submit the form
async function completeLoginForm() {
  const user = userEvent.setup();

  const emailInputEl = screen.getByLabelText("Email:");
  const passwordInputEl = screen.getByLabelText("Password:");
  const submitButtonEl = screen.getByRole("submit-button");

  await user.type(emailInputEl, "test@email.com");
  await user.type(passwordInputEl, "1234");
  await user.click(submitButtonEl);
}

describe("Login Page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("renders email and password input fields and heading", () => {
    render(<LoginPage />);
    expect(screen.getByRole("heading", { name: /login/i })).toBeTruthy();
    expect(screen.getByLabelText("Email:")).toBeTruthy();
    expect(screen.getByLabelText("Password:")).toBeTruthy();
    expect(screen.getByRole("submit-button")).toBeTruthy();
  });

  test("password input has type 'password'", () => {
    render(<LoginPage />);
    const passwordInput = screen.getByLabelText("Password:");
    expect(passwordInput.getAttribute("type")).toBe("password");
  });

  test("allows a user to login", async () => {
    render(<LoginPage />);
    await completeLoginForm();
    expect(login).toHaveBeenCalledWith("test@email.com", "1234");
  });

  test("navigates to /posts on successful login", async () => {
    render(<LoginPage />);
    login.mockResolvedValue("secrettoken123");
    const navigateMock = useNavigate();

    await completeLoginForm();

    expect(navigateMock).toHaveBeenCalledWith("/posts");
  });

  test("navigates to /login on unsuccessful login", async () => {
    render(<LoginPage />);
    login.mockRejectedValue(new Error("Error logging in"));
    const navigateMock = useNavigate();

    await completeLoginForm();

    expect(navigateMock).toHaveBeenCalledWith("/login");
  });

  test("submitting empty form calls login with empty strings", async () => {
    render(<LoginPage />);
    const submitButton = screen.getByRole("submit-button");
    const user = userEvent.setup();

    await user.click(submitButton);

    expect(login).toHaveBeenCalledWith("", "");
  });
});
