import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import React from "react";
import FixedRangeSlider from "../fixed-range-slider";

describe("FixedRangeSlider", () => {
  const mockValues = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99];

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders correctly", () => {
    render(<FixedRangeSlider values={mockValues} />);
    mockValues.forEach((value) => {
      expect(screen.getByText(`${value.toFixed(2)} €`)).toBeInTheDocument();
    });
  });

  it("updates indices when marker is clicked", () => {
    render(<FixedRangeSlider values={mockValues} />);
    const markerIndex = 2; // Index of 10.99 €
    const marker = screen.getByText(`${mockValues[markerIndex].toFixed(2)} €`);
    fireEvent.click(marker);
    expect(
      screen.getByText(`Min: ${mockValues[markerIndex].toFixed(2)} €`)
    ).toBeInTheDocument();
  });

  it("updates minIndex when a lower marker is clicked", () => {
    render(<FixedRangeSlider values={mockValues} />);
    const markerIndex = 1; // Index of 5.99 €
    const marker = screen.getByText(`${mockValues[markerIndex].toFixed(2)} €`);
    fireEvent.click(marker);
    expect(
      screen.getByText(`Min: ${mockValues[markerIndex].toFixed(2)} €`)
    ).toBeInTheDocument();
  });

  it("updates maxIndex when a higher marker is clicked", () => {
    render(<FixedRangeSlider values={mockValues} />);
    const markerIndex = 4; // Index of 50.99 €
    const marker = screen.getByText(`${mockValues[markerIndex].toFixed(2)} €`);
    fireEvent.click(marker);
    expect(
      screen.getByText(`Max: ${mockValues[markerIndex].toFixed(2)} €`)
    ).toBeInTheDocument();
  });

   it("updates minIndex if newIndex is closer to minIndex", () => {
    render(<FixedRangeSlider values={mockValues} />);
    const markerIndex = 2; // Index of 10.99 €
    const clickPosition = (markerIndex / (mockValues.length - 1)) * 100;

    vi.spyOn(HTMLDivElement.prototype, "getBoundingClientRect").mockReturnValue({
      left: 0,
      width: 100,
      right: 100,
      top: 0,
      bottom: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    fireEvent.click(screen.getByTestId("markers-container"), {
      clientX: clickPosition,
    });

    expect(screen.getByText(`Min: ${mockValues[markerIndex].toFixed(2)} €`)).toBeInTheDocument();
  });

  it("updates maxIndex if newIndex is closer to maxIndex", () => {
    render(<FixedRangeSlider values={mockValues} />);
    const markerIndex = 4; // Index of 50.99 €
    const clickPosition = (markerIndex / (mockValues.length - 1)) * 100;

    vi.spyOn(HTMLDivElement.prototype, "getBoundingClientRect").mockReturnValue({
      left: 0,
      width: 100,
      right: 100,
      top: 0,
      bottom: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    fireEvent.click(screen.getByTestId("markers-container"), {
      clientX: clickPosition,
    });

    expect(screen.getByText(`Max: ${mockValues[markerIndex].toFixed(2)} €`)).toBeInTheDocument();
  });

  it("handles mouse down and drag events correctly for min handle", () => {
    render(<FixedRangeSlider values={mockValues} />);

    const minHandle = screen.getByTestId("min-handle");
    fireEvent.mouseDown(minHandle);

    vi.spyOn(HTMLDivElement.prototype, "getBoundingClientRect").mockReturnValue(
      {
        left: 0,
        width: 100,
        right: 100,
        top: 0,
        bottom: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      }
    );

    fireEvent.mouseMove(document, { clientX: 50 });
    fireEvent.mouseUp(document);

    const expectedIndex = 3; // Based on the mockValues array
    expect(
      screen.getByText(`Min: ${mockValues[expectedIndex].toFixed(2)} €`)
    ).toBeInTheDocument();
  });

  it("handles mouse down and drag events correctly for max handle", () => {
    render(<FixedRangeSlider values={mockValues} />);

    const maxHandle = screen.getByTestId("max-handle");
    fireEvent.mouseDown(maxHandle);

    vi.spyOn(HTMLDivElement.prototype, "getBoundingClientRect").mockReturnValue(
      {
        left: 0,
        width: 100,
        right: 100,
        top: 0,
        bottom: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      }
    );

    fireEvent.mouseMove(document, { clientX: 20 });
    fireEvent.mouseUp(document);

    const expectedIndex = 1; // Based on the mockValues array
    expect(
      screen.getByText(`Max: ${mockValues[expectedIndex].toFixed(2)} €`)
    ).toBeInTheDocument();
  });

  it("handles touch drag events correctly for min handle", () => {
    render(<FixedRangeSlider values={mockValues} />);

    const minHandle = screen.getByTestId("min-handle");
    fireEvent.touchStart(minHandle, { touches: [{ clientX: 20 }] });

    vi.spyOn(HTMLDivElement.prototype, "getBoundingClientRect").mockReturnValue(
      {
        left: 0,
        width: 100,
        right: 100,
        top: 0,
        bottom: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      }
    );

    fireEvent.touchMove(document, { touches: [{ clientX: 70 }] });
    fireEvent.touchEnd(document);

    const expectedIndex = 4; // Based on the mockValues array
    expect(
      screen.getByText(`Min: ${mockValues[expectedIndex].toFixed(2)} €`)
    ).toBeInTheDocument();
  });

  it("handles touch drag events correctly for max handle", () => {
    render(<FixedRangeSlider values={mockValues} />);

    const maxHandle = screen.getByTestId("max-handle");
    fireEvent.touchStart(maxHandle, { touches: [{ clientX: 90 }] });

    vi.spyOn(HTMLDivElement.prototype, "getBoundingClientRect").mockReturnValue(
      {
        left: 0,
        width: 100,
        right: 100,
        top: 0,
        bottom: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      }
    );

    fireEvent.touchMove(document, { touches: [{ clientX: 50 }] });
    fireEvent.touchEnd(document);

    const expectedIndex = 3; // Based on the mockValues array
    expect(
      screen.getByText(`Max: ${mockValues[expectedIndex].toFixed(2)} €`)
    ).toBeInTheDocument();
  });
});
