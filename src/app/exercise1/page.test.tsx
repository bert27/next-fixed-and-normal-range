import { render, screen, waitFor } from "@testing-library/react";
import Exercise1Page from "./page";
import { vi } from "vitest";
import { ERROR_MESSAGES } from "../services/api-service";
import RootLayout from "../layout";

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

const mockFetchFailure = () => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: false,
    status: 500,
    statusText: "Internal Server Error",
  });
};

const mockFetchInvalidValues = () => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      min: null,
      max: null,
    }),
  });
};

describe("Exercise1Page SSR", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders range slider on successful fetch", async () => {
    mockFetchSuccess();

    const ui = await Exercise1Page();
    render(<RootLayout.Content>{ui}</RootLayout.Content>);

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

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("renders error message on fetch failure", async () => {
    mockFetchFailure();

    const ui = await Exercise1Page();
    render(<RootLayout.Content>{ui}</RootLayout.Content>);

    await waitFor(() => {
      expect(screen.getByText(ERROR_MESSAGES.RANGE_VALUES)).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("handles server response with ok=false", async () => {
    mockFetchFailure();

    const ui = await Exercise1Page();
    render(<RootLayout.Content>{ui}</RootLayout.Content>);

    await waitFor(() => {
      expect(screen.getByText(ERROR_MESSAGES.RANGE_VALUES)).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("handles invalid range values", async () => {
    mockFetchInvalidValues();

    const ui = await Exercise1Page();
    render(<RootLayout.Content>{ui}</RootLayout.Content>);

    await waitFor(() => {
      expect(screen.getByText(/Invalid range values/i)).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
