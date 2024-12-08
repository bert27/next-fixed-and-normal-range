import { render, screen, waitFor } from "@testing-library/react";
import Exercise1Page from "./page";
import { vi } from "vitest";

global.fetch = vi.fn();

const mockFetchSuccess = () => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      min: 0,
      max: 100,
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

describe("Exercise1Page", () => {
  beforeEach(() => {
    vi.clearAllMocks(); 
  });

  it("renders loading state initially", () => {
    render(<Exercise1Page />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders range slider on successful fetch", async () => {
    mockFetchSuccess();

    render(<Exercise1Page />);

    await waitFor(() => {
      const minSlider = screen.getByRole("slider", {
        name: /minimum value: 0,00 €/i,
      });
      const maxSlider = screen.getByRole("slider", {
        name: /maximum value: 100,00 €/i,
      });

      expect(minSlider).toBeInTheDocument();
      expect(maxSlider).toBeInTheDocument();
    });
  });

  it("renders error message on fetch failure", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Fetch failed")
    );

    render(<Exercise1Page />);

    await waitFor(() => {
      expect(
        screen.getByText("Error loading range values. Please try again later.")
      ).toBeInTheDocument();
    });
  });

  it("handles server response with ok=false", async () => {
    mockFetchFailureWithErrorCode();

    render(<Exercise1Page />);

    await waitFor(() => {
      expect(
        screen.getByText("Error loading range values. Please try again later.")
      ).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledTimes(1);
  });
});