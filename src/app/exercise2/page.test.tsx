import { render, screen, waitFor } from "@testing-library/react";
import Exercise2Page from "./page";
import { vi } from "vitest";
import { ERROR_MESSAGES } from "../services/api-service";
import RootLayout from "../layout";



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

describe("Exercise2Page with RootLayoutContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders FixedRangeSlider on successful fetch", async () => {
    mockFetchSuccess();

    const ui = await Exercise2Page();
    render(<RootLayout.Content>{ui}</RootLayout.Content>);

    await waitFor(() => {
      const markersContainer = screen.getByTestId("markers-container");
      expect(markersContainer).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("renders error message for FIXED_RANGE_VALUES failure", async () => {
    mockFetchFailureWithErrorCode();

    const ui = await Exercise2Page();
    render(<RootLayout.Content>{ui}</RootLayout.Content>);

    await waitFor(() => {
      expect(
        screen.getByText(ERROR_MESSAGES.FIXED_RANGE_VALUES)
      ).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledTimes(1);
  });
});