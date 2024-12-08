"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/layout";
import { RangeSelector } from "@/components/range/range";

export default function Exercise1Page() {
  const [minValue, setMinValue] = useState<number | undefined>(undefined);
  const [maxValue, setMaxValue] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRangeValues = async () => {
    try {
      const response = await fetch(
        "https://demo3042680.mockable.io/range-values"
      );
      if (!response.ok) {
        throw new Error("Error fetching range values");
      }
      const data = await response.json();

      setMinValue(data.min);
      setMaxValue(data.max);
      setError(null);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching range values:", error);
      setError("Error loading range values. Please try again later.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRangeValues();
  }, []);

  return (
    <Layout
      title="Mango"
      subtitle="Reusable Input Range"
      isLoading={isLoading}
      errorMessage={error}
    >
      <RangeSelector mode="normal" min={minValue} max={maxValue} step={1} />
    </Layout>
  );
}