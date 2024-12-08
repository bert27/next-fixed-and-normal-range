import { render } from "@testing-library/react";
import RootLayout from "../layout";

describe("RootLayout", () => {
  it("sets the correct HTML structure", () => {
    const { container } = render(
      <RootLayout>
        <div>Child Content</div>
      </RootLayout>
    );


    const bodyElement = container.closest("body");
    const mainElement = bodyElement?.querySelector("main");
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveTextContent("Child Content");
  });
});