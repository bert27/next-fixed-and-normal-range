import { render } from "@testing-library/react";
import RootLayout from "../layout";

describe("RootLayout", () => {
  it("sets the correct HTML structure and shows children when rendering", () => {
    const { container } = render(
      <RootLayout>
        <div>Child Content</div>
      </RootLayout>
    );

    const htmlElement = container.querySelector("html");
    const bodyElement = container.querySelector("body");

    expect(htmlElement).toBeInTheDocument();
    expect(bodyElement).toBeInTheDocument();

    expect(bodyElement).toHaveTextContent("Child Content");
  });
});