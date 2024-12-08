import {
  fetchRangeValues,
  fetchFixedRangeValues,
  fetchMockRangeValues,
  fetchMockFixedRangeValues,
  fetchMockRangeValuesWithError,
  fetchMockFixedRangeValuesWithError,
  ERROR_MESSAGES,
} from "./api-service";
import { vi } from "vitest";

global.fetch = vi.fn();

describe("API Service", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchRangeValues", () => {
    it("should return valid range values on success", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ min: 10, max: 100 }),
      });

      const result = await fetchRangeValues();
      expect(result).toEqual({ data: { min: 10, max: 100 }, error: null });
      expect(fetch).toHaveBeenCalledWith(
        "http://demo3042680.mockable.io/range-values"
      );
    });

    it("should return an error for invalid range values", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ min: "invalid", max: 100 }),
      });

      const result = await fetchRangeValues();
      expect(result).toEqual({
        error: "Invalid range values received from the server.",
      });
    });

    it("should return an error if fetch fails", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network Error")
      );

      const result = await fetchRangeValues();
      expect(result).toEqual({
        error: ERROR_MESSAGES.RANGE_VALUES,
      });
    });

    it("should return an error if the response is not ok", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      const result = await fetchRangeValues();
      expect(result).toEqual({
        error: ERROR_MESSAGES.RANGE_VALUES,
      });
    });
  });

  describe("fetchFixedRangeValues", () => {
    it("should return valid fixed range values on success", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ rangeValues: [10, 20, 30, 40, 50] }),
      });

      const result = await fetchFixedRangeValues();
      expect(result).toEqual({
        data: { rangeValues: [10, 20, 30, 40, 50] },
        error: null,
      });
      expect(fetch).toHaveBeenCalledWith(
        "http://demo3042680.mockable.io/range-values-fixed"
      );
    });

    it("should return an error if fetch fails", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network Error")
      );

      const result = await fetchFixedRangeValues();
      expect(result).toEqual({
        error: ERROR_MESSAGES.FIXED_RANGE_VALUES,
      });
    });

    it("should return an error if the response is not ok", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      const result = await fetchFixedRangeValues();
      expect(result).toEqual({
        error: ERROR_MESSAGES.FIXED_RANGE_VALUES,
      });
    });
  });

  describe("fetchMockRangeValues", () => {
    it("should return mock range values", async () => {
      const result = await fetchMockRangeValues();
      expect(result).toEqual({
        data: { min: 10, max: 100 },
        error: null,
      });
    });
  });

  describe("fetchMockFixedRangeValues", () => {
    it("should return mock fixed range values", async () => {
      const result = await fetchMockFixedRangeValues();
      expect(result).toEqual({
        data: { rangeValues: [10, 20, 30, 40, 50] },
        error: null,
      });
    });
  });

  describe("fetchMockRangeValuesWithError", () => {
    it("should return an error for mock range values", async () => {
      const result = await fetchMockRangeValuesWithError();
      expect(result).toEqual({
        error: ERROR_MESSAGES.RANGE_VALUES,
      });
    });
  });

  describe("fetchMockFixedRangeValuesWithError", () => {
    it("should return an error for mock fixed range values", async () => {
      const result = await fetchMockFixedRangeValuesWithError();
      expect(result).toEqual({
        error: ERROR_MESSAGES.FIXED_RANGE_VALUES,
      });
    });
  });
});
