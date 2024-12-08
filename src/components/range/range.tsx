"use client";

import React from "react";
import FixedRangeSlider from "./components/fixed-range-slider";
import RangeSlider from "./components/range-slider";

interface RangeSelectorProps {
  mode: "fixed" | "normal";
  values?: number[];
  min?: number;
  max?: number;
  step?: number;
}

export const RangeSelector: React.FC<RangeSelectorProps> = ({ mode, values = [], min = 0, max = 100, step = 1 }) => {
  return mode === "fixed" && values.length > 0 ? (
    <FixedRangeSlider values={values} />
  ) : mode === "normal" ? (
    <RangeSlider min={min} max={max} step={step} />
  ) : null;
};

