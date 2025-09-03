import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import { HomePage } from "../../src/pages/Home/HomePage";

describe("Home Page", () => {
  test("welcomes you to the site", () => {
    // We need the Browser Router so that the Link elements load correctly
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    const heading = screen.getByRole("heading");
    expect(heading.textContent).toEqual("Welcome to MyEverest!");
  });

  test("Displays a signup link", async () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    const signupLink = screen.getByText("Sign Up");
    expect(signupLink.getAttribute("href")).toEqual("/signup");
  });

  test("Displays a login link", async () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    const loginLink = screen.getByText("Log In");
    expect(loginLink.getAttribute("href")).toEqual("/login");
  });
});

test("renders the Header component", () => {
  render(
    <BrowserRouter>
      <HomePage />
    </BrowserRouter>
  );

  const header = screen.getByRole("banner");
  expect(header).not.toBeNull();
});

test("renders the Footer component", () => {
  render(
    <BrowserRouter>
      <HomePage />
    </BrowserRouter>
  );

  const footer = screen.getByRole("contentinfo");
  expect(footer).not.toBeNull();
});
