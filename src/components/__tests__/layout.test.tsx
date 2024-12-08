import { render, screen } from "@testing-library/react";
import Layout from "../layout";

describe("Layout Component", () => {
  it("renders the loading state with accessible role", () => {
    render(
      <Layout
        title="Test Title"
        subtitle="Test Subtitle"
        isLoading={true}
        errorMessage={null}
      >
        <p>Child content</p>
      </Layout>
    );

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Loading...");
    expect(screen.queryByText("Test Title")).not.toBeInTheDocument();
    expect(screen.queryByText("Test Subtitle")).not.toBeInTheDocument();
  });

  it("renders the error state with accessible role", () => {
    render(
      <Layout
        title="Test Title"
        subtitle="Test Subtitle"
        isLoading={false}
        errorMessage="An error occurred"
      >
        <p>Child content</p>
      </Layout>
    );

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("An error occurred");
    expect(screen.queryByText("Test Title")).not.toBeInTheDocument();
    expect(screen.queryByText("Test Subtitle")).not.toBeInTheDocument();
  });

  it("renders the title, subtitle, and children when not loading and no error", () => {
    render(
      <Layout
        title="Test Title"
        subtitle="Test Subtitle"
        isLoading={false}
        errorMessage={null}
      >
        <p>Child content</p>
      </Layout>
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Test Title"
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Test Subtitle"
    );
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });

  it("does not render children when loading or error", () => {
    const { rerender } = render(
      <Layout
        title="Test Title"
        subtitle="Test Subtitle"
        isLoading={true}
        errorMessage={null}
      >
        <p>Child content</p>
      </Layout>
    );

    expect(screen.queryByText("Child content")).not.toBeInTheDocument();

    rerender(
      <Layout
        title="Test Title"
        subtitle="Test Subtitle"
        isLoading={false}
        errorMessage="An error occurred"
      >
        <p>Child content</p>
      </Layout>
    );

    expect(screen.queryByText("Child content")).not.toBeInTheDocument();
  });
});