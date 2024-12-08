export const ERROR_MESSAGES = {
  RANGE_VALUES: "Error loading range values. Please try again later.",
  FIXED_RANGE_VALUES:
    "Error loading fixed range values. Please try again later.",
};

interface RangeValuesResponseInterface {
  min: number;
  max: number;
}

interface FixedRangeValuesResponseInterface {
  rangeValues: number[];
}

interface FetchResult<T> {
  data?: T;
  error: string | null;
}

export async function getData<T>(
  url: string,
  errorMessage: string
): Promise<FetchResult<T>> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      return { error: errorMessage };
    }

    const data = await response.json();
    return { data, error: null };
  } catch {
    return { error: errorMessage };
  }
}
export async function fetchRangeValues(): Promise<
  FetchResult<RangeValuesResponseInterface>
> {
  const url = "http://demo3042680.mockable.io/range-values";

  const result = await getData<RangeValuesResponseInterface>(
    url,
    ERROR_MESSAGES.RANGE_VALUES
  );
  if (
    result.data &&
    (typeof result.data.min !== "number" || typeof result.data.max !== "number")
  ) {
    return {
      error: "Invalid range values received from the server.",
    };
  }

  return result;
}
export async function fetchFixedRangeValues(): Promise<
  FetchResult<FixedRangeValuesResponseInterface>
> {
  const url = "http://demo3042680.mockable.io/range-values-fixed";

  return getData<FixedRangeValuesResponseInterface>(
    url,
    ERROR_MESSAGES.FIXED_RANGE_VALUES
  );
}
export async function fetchMockRangeValues(): Promise<
  FetchResult<RangeValuesResponseInterface>
> {
  const mockData: RangeValuesResponseInterface = {
    min: 10,
    max: 100,
  };

  return { data: mockData, error: null };
}

export async function fetchMockFixedRangeValues(): Promise<
  FetchResult<FixedRangeValuesResponseInterface>
> {
  const mockData: FixedRangeValuesResponseInterface = {
    rangeValues: [10, 20, 30, 40, 50],
  };

  return { data: mockData, error: null };
}

export async function fetchMockRangeValuesWithError(): Promise<
  FetchResult<RangeValuesResponseInterface>
> {
  return { error: ERROR_MESSAGES.RANGE_VALUES };
}

export async function fetchMockFixedRangeValuesWithError(): Promise<
  FetchResult<FixedRangeValuesResponseInterface>
> {
  return { error: ERROR_MESSAGES.FIXED_RANGE_VALUES };
}
