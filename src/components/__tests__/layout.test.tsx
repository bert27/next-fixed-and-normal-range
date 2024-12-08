import { render, screen } from "@testing-library/react";
import Layout from "../layout";

describe("Layout Component", () => {
  it("renders the error state with accessible role", () => {
    render(
      <Layout error="An error occurred">
        <p>Child content</p>
      </Layout>
    );

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("An error occurred");

    expect(screen.queryByText("Child content")).not.toBeInTheDocument();
  });

  it("renders children when no error is present", () => {
    render(
      <Layout error={null}>
        <p>Child content</p>
      </Layout>
    );

    expect(screen.getByText("Child content")).toBeInTheDocument();
  });

  it("does not render error message when there is no error", () => {
    render(
      <Layout error={null}>
        <p>Child content</p>
      </Layout>
    );

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});