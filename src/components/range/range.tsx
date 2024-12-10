import React from "react";
import FixedRangeSlider from "./components/fixed-range-slider/fixed-range-slider";
import { RangeSlider } from "./components/range-slider/range-slider";

interface RangeSelectorProps {
  mode: "fixed" | "normal";
  values?: number[];
  min?: number;
  max?: number;
  step?: number;
}

export const RangeSelector: React.FC<RangeSelectorProps> = ({
  mode,
  values = [],
  min = 0,
  max = 100,
  step = 1,
}) => {
  if (mode === "fixed") {
    return <FixedRangeSlider values={values} />;
  }

  return <RangeSlider min={min} max={max} step={step} />;
};
