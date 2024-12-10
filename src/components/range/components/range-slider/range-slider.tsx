"use client";

import React, { useState, useRef } from "react";
import styles from "./range-slider.module.css";
import { CustomInput } from "../atoms/custom-input";
import { RangeHandle } from "../atoms/range-handle/range-handle";
import { calculatePosition } from "../utils";

interface RangeSliderProps {
  min: number;
  max: number;
  step: number;
  minGap?: number;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  minGap = 3,
}) => {
  const [minValue, setMinValue] = useState<number>(min);
  const [maxValue, setMaxValue] = useState<number>(max);

  const rangeRef = useRef<HTMLDivElement>(null);

  const handleMinChange = (value: number) => {
    if (value < min || value > maxValue - minGap) return;
    setMinValue(value);
  };

  const handleMaxChange = (value: number) => {
    if (value > max || value < minValue + minGap) return;
    setMaxValue(value);
  };

  const handleMouseOrTouchMove = (
    event: MouseEvent | TouchEvent,
    type: "min" | "max"
  ) => {
    const newValue = calculatePosition(event, rangeRef, { min, max, step });
    if (newValue === null) return;

    if (type === "min") {
      handleMinChange(Math.min(newValue, maxValue - step));
    } else {
      handleMaxChange(Math.max(newValue, minValue + step));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, type: "min" | "max") => {
    let currentValue = type === "min" ? minValue : maxValue;

    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      currentValue -= step;
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      currentValue += step;
    }

    if (type === "min") {
      handleMinChange(currentValue);
    } else {
      handleMaxChange(currentValue);
    }
  };

  const formatValue = (value: number) =>
    `${value.toFixed(2).replace(".", ",")} €`;

  return (
    <div className={styles.rangeSliderWrapper} ref={rangeRef}>
      <div className={styles.rangeLabels}>
        <CustomInput value={minValue} step={step} onChange={handleMinChange} />
        <CustomInput value={maxValue} step={step} onChange={handleMaxChange} />
      </div>

      <div className={styles.rangeTrack}>
        <div
          className={styles.rangeHighlight}
          style={{
            left: `${((minValue - min) / (max - min)) * 100}%`,
            right: `${100 - ((maxValue - min) / (max - min)) * 100}%`,
          }}
        />
        <RangeHandle
          value={minValue}
          min={min}
          max={max}
          label={`Minimum value: ${formatValue(minValue)}`}
          position={((minValue - min) / (max - min)) * 100}
          type="min"
          onDrag={handleMouseOrTouchMove}
          onKeyDown={handleKeyDown}
        />
        <RangeHandle
          value={maxValue}
          min={min}
          max={max}
          label={`Maximum value: ${formatValue(maxValue)}`}
          position={((maxValue - min) / (max - min)) * 100}
          type="max"
          onDrag={handleMouseOrTouchMove}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};
