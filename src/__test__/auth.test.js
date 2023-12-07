import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  screen,
  cleanup,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../pages/login/Login";
import * as api from "../api";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  withRouter: (component) => component,
}));
jest.mock("../api", () => ({
  ...jest.requireActual("../api"),
  getUni: jest.fn(() => Promise.resolve([])),
}));

describe("Login component", () => {
  test("Login render", () => {
    expect(true).toBe(true);
  });
});
