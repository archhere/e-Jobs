import { describe, expect, test } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { RouterProvider } from "react-router-dom";
// import { createMemoryHistory } from "history";
// import Login from "../pages/login/Login"
import App from "../App"
import { useState } from "react";

describe("App", () => {
  test("renders", () => {
    render(<App />);
    screen.debug()
    // const linkElement = screen.getByTestId("cards");
    // const linkElement = screen.getByText(/EJobs/i)
//     const maxLengthToPrint = 100000
// screen.debug(linkElement, maxLengthToPrint);
    // expect(linkElement).toBeInTheDocument();
  });

  
});
