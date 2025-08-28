import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NavBar from "./NavBar";
import { vi } from "vitest";

// mock LogoutButton to keep tests simple
vi.mock("../components/LogoutButton", () => {
  const MockLogoutButton = () => <div>Logout Button</div>;
  MockLogoutButton.displayName = "LogoutButton";
  return MockLogoutButton;
});

test("shows LogoutButton when path is /posts", () => {
  render(
    <MemoryRouter initialEntries={["/posts"]}>
      <NavBar />
    </MemoryRouter>
  );

  expect(screen.getByText("Logout Button")).toBeInTheDocument();
  expect(screen.queryByText("Sign Up")).not.toBeInTheDocument();
  expect(screen.queryByText("Log In")).not.toBeInTheDocument();
});

test("shows Log In but not Sign Up when path is /signup", () => {
  render(
    <MemoryRouter initialEntries={["/signup"]}>
      <NavBar />
    </MemoryRouter>
  );

  expect(screen.getByText("Log In")).toBeInTheDocument();
  expect(screen.queryByText("Sign Up")).not.toBeInTheDocument();
  expect(screen.queryByText("Logout Button")).not.toBeInTheDocument();
});

test("shows Sign Up but not Log In when path is /login", () => {
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <NavBar />
    </MemoryRouter>
  );

  expect(screen.getByText("Sign Up")).toBeInTheDocument();
  expect(screen.queryByText("Log In")).not.toBeInTheDocument();
  expect(screen.queryByText("Logout Button")).not.toBeInTheDocument();
});

test("shows Sign Up and Log In when path is home (/)", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <NavBar />
    </MemoryRouter>
  );

  expect(screen.getByText("Sign Up")).toBeInTheDocument();
  expect(screen.getByText("Log In")).toBeInTheDocument();
  expect(screen.queryByText("Logout Button")).not.toBeInTheDocument();
});