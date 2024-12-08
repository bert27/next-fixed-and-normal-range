import { render, screen, waitFor, within } from "@testing-library/react";
import Exercise2Page from "./page";
import { vi } from "vitest";

global.fetch = vi.fn();

const mockFetchSuccess = () => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      rangeValues: [10, 20, 30, 40, 50],
    }),
  });
};

const mockFetchFailureWithErrorCode = () => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: false,
    status: 500,
    statusText: "Internal Server Error",
  });
};

describe("Exercise2Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    render(<Exercise2Page />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders FixedRangeSlider on successful fetch", async () => {
    mockFetchSuccess();

    render(<Exercise2Page />);

    await waitFor(() => {
      const markersContainer = screen.getByTestId("markers-container");
      const markers = within(markersContainer).getAllByText(/\d+ €/i);
      expect(markers).toHaveLength(5);
      expect(markers[0]).toHaveTextContent("10.00 €");
      expect(markers[4]).toHaveTextContent("50.00 €");
    });
  });

  it("renders error message on fetch failure", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Fetch failed")
    );

    render(<Exercise2Page />);

    await waitFor(() => {
      expect(
        screen.getByText("Error loading range values. Please try again later.")
      ).toBeInTheDocument();
    });
  });

  it("handles server response with ok=false", async () => {
    mockFetchFailureWithErrorCode();

    render(<Exercise2Page />);

    await waitFor(() => {
      expect(
        screen.getByText("Error loading range values. Please try again later.")
      ).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledTimes(1); // Asegura que fetch se llamó una vez
  });

  it("does not render FixedRangeSlider when rangeValues is empty", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ rangeValues: [] }),
    });

    render(<Exercise2Page />);

    await waitFor(() => {
      expect(screen.queryByRole("slider")).not.toBeInTheDocument();
    });
  });
});
