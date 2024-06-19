import { describe, expect, test } from "vitest";
import { render, screen, fireEvent, waitForElement } from "@testing-library/react";
import userEvent from '@testing-library/user-event'
import "@testing-library/jest-dom";
import { MemoryRouter, BrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
// import { createMemoryHistory } from "history";
import Login from "../pages/login/Login"
import { useState } from "react";
import { ERROR_GENERIC } from "../utils/constants"

describe("Login", () => {
  test("renders", async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    const header = screen.getByText(/Sign in/i);
    expect(header).toBeInTheDocument();
    expect(screen.getByText(/Login/i)).toBeDisabled;
    const input1 = screen.getByTestId('username');
    await userEvent.clear(input1)
    await userEvent.type(input1, 'hello')
    expect(input1.value).toBe("hello");
    const input2 = screen.getByTestId('password');
    await userEvent.clear(input2)
    await userEvent.type(input2, '123')
    expect(input2.value).toBe("123");
    expect(screen.getByText(/Login/i)).toBeEnabled
    fireEvent.click(screen.getByText(/Login/i));
    screen.debug()  
    // screen.debug()
    // const alertText = screen.get
    // expect(alertText).toBeInTheDocument();
  });

  
});
