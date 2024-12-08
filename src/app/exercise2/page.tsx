"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/layout";
import { RangeSelector } from "@/components/range/range";

export default function Exercise2Page() {
  const [rangeValues, setRangeValues] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRangeValues = async () => {
    try {
      const response = await fetch(
        "https://demo3042680.mockable.io/range-values-fixed"
      );
      if (!response.ok) {
        throw new Error("Error fetching range values");
      }
      const data = await response.json();
      setRangeValues(data.rangeValues);
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
      subtitle="Fixed Values Range"
      isLoading={isLoading}
      errorMessage={error}
    >
      <RangeSelector mode="fixed" values={rangeValues} />
    </Layout>
  );
}
