import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import React from "react";
import RangeSlider from "../range-slider";
describe("RangeSlider Component", () => {
  const defaultProps = {
    min: 0,
    max: 100,
    step: 1,
    minGap: 3,
  };

  const initialMockedValues = {
    width: 200,
    left: 0,
    right: 200,
    top: 0,
    bottom: 20,
    height: 20,
    x: 0,
    y: 0,
    toJSON: () => {},
  };
  let actualMockedValues = initialMockedValues;

  beforeEach(() => {
    vi.restoreAllMocks();
    actualMockedValues = initialMockedValues;

    vi.spyOn(HTMLDivElement.prototype, "getBoundingClientRect").mockReturnValue(
      actualMockedValues
    );
  });

  it("renders correctly with default props", () => {
    render(<RangeSlider {...defaultProps} />);
    expect(
      screen.getByRole("slider", { name: /Minimum value:/ })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("slider", { name: /Maximum value:/ })
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("0")).toBeInTheDocument();
    expect(screen.getByDisplayValue("100")).toBeInTheDocument();
  });

  it("updates the minimum value on valid input change", () => {
    render(<RangeSlider {...defaultProps} />);
    const minInput = screen.getByDisplayValue("0") as HTMLInputElement;
    fireEvent.change(minInput, { target: { value: "10" } });
    expect(minInput.value).toBe("10");
  });

  it("updates the maximum value on valid input change", () => {
    render(<RangeSlider {...defaultProps} />);
    const maxInput = screen.getByDisplayValue("100") as HTMLInputElement;
    fireEvent.change(maxInput, { target: { value: "90" } });
    expect(maxInput.value).toBe("90");
  });

  it("does not allow minimum value to exceed maxValue - minGap", () => {
    render(<RangeSlider {...defaultProps} />);
    const minInput = screen.getByDisplayValue("0") as HTMLInputElement;
    fireEvent.change(minInput, { target: { value: "98" } });
    expect(minInput.value).toBe("0"); // Sin cambios
  });

  it("does not allow maximum value to go below minValue + minGap", () => {
    render(<RangeSlider {...defaultProps} />);
    const maxInput = screen.getByDisplayValue("100") as HTMLInputElement;
    fireEvent.change(maxInput, { target: { value: "2" } });
    expect(maxInput.value).toBe("100"); // Sin cambios
  });

  it("renders the formatted value correctly", () => {
    render(<RangeSlider {...defaultProps} />);
    const minSlider = screen.getByRole("slider", { name: /Minimum value:/ });
    expect(minSlider.getAttribute("aria-label")).toBe("Minimum value: 0,00 €");
  });

  it("handles mouse movement for minimum slider", () => {
    render(<RangeSlider {...defaultProps} />);
    const minSlider = screen.getByRole("slider", { name: /Minimum value:/ });

    actualMockedValues.left = 0;
    actualMockedValues.width = 200;

    fireEvent.mouseDown(minSlider);
    fireEvent.mouseMove(document, { clientX: 50 });
    fireEvent.mouseUp(document);

    expect(screen.getByDisplayValue("25")).toBeInTheDocument();
  });

  it("handles mouse movement for maximum slider", () => {
    render(<RangeSlider {...defaultProps} />);
    const maxSlider = screen.getByRole("slider", { name: /Maximum value:/ });

    actualMockedValues.left = 0;
    actualMockedValues.width = 200;

    fireEvent.mouseDown(maxSlider);
    fireEvent.mouseMove(document, { clientX: 150 });
    fireEvent.mouseUp(document);

    expect(screen.getByDisplayValue("75")).toBeInTheDocument();
  });

  it("handles touch movement for minimum slider", () => {
    render(<RangeSlider {...defaultProps} />);
    const minSlider = screen.getByRole("slider", { name: /Minimum value:/ });

    actualMockedValues = {
      ...actualMockedValues,
      left: 0,
      width: 200,
    };

    vi.spyOn(HTMLDivElement.prototype, "getBoundingClientRect").mockReturnValue(
      actualMockedValues
    );

    fireEvent.touchStart(minSlider, { touches: [{ clientX: 76 }] });
    fireEvent.touchMove(document, { touches: [{ clientX: 76 }] });
    fireEvent.touchEnd(document);

    const expectedValue =
      Math.round(
        (defaultProps.min +
          (76 / 200) * (defaultProps.max - defaultProps.min)) /
          defaultProps.step
      ) * defaultProps.step;

    expect(
      screen.getByDisplayValue(expectedValue.toString())
    ).toBeInTheDocument();
  });

  it("handles touch movement for maximum slider", () => {
    render(<RangeSlider {...defaultProps} />);
    const rangeSlider = screen.getByRole("slider", { name: /Maximum value:/ });

    actualMockedValues.left = 0;
    actualMockedValues.width = 200;

    fireEvent.touchStart(rangeSlider, { touches: [{ clientX: 180 }] });
    fireEvent.touchMove(document, { touches: [{ clientX: 150 }] });
    fireEvent.touchEnd(document);

    const maxInput = screen.getByDisplayValue("75") as HTMLInputElement;
    expect(maxInput.value).toBe("75");
  });

  it("handles keyboard navigation for minimum slider", () => {
    render(<RangeSlider {...defaultProps} />);
    const minSlider = screen.getByRole("slider", { name: /Minimum value:/ });

    fireEvent.keyDown(minSlider, { key: "ArrowRight" });
    expect(screen.getByDisplayValue("1")).toBeInTheDocument();

    fireEvent.keyDown(minSlider, { key: "ArrowLeft" });
    expect(screen.getByDisplayValue("0")).toBeInTheDocument();

    fireEvent.keyDown(minSlider, { key: "ArrowUp" });
    expect(screen.getByDisplayValue("1")).toBeInTheDocument();
  });

  it("handles keyboard navigation for maximum slider", () => {
    render(<RangeSlider {...defaultProps} />);
    const maxSlider = screen.getByRole("slider", { name: /Maximum value:/ });

    fireEvent.keyDown(maxSlider, { key: "ArrowLeft" });
    expect(screen.getByDisplayValue("99")).toBeInTheDocument();

    fireEvent.keyDown(maxSlider, { key: "ArrowRight" });
    expect(screen.getByDisplayValue("100")).toBeInTheDocument();
  });
});
