"use client";

import React, { useState, useRef } from "react";
import { addEventListeners, removeEventListeners } from "../utils";
import "./range-slider.css";

interface RangeSliderProps {
  min: number;
  max: number;
  step: number;
  minGap?: number;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
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
    if (!rangeRef.current) return;

    const clientX =
      event instanceof MouseEvent ? event.clientX : event.touches[0]?.clientX;

    const rect = rangeRef.current.getBoundingClientRect();
    const percent = (clientX - rect.left) / rect.width;
    const newValue = Math.round((min + percent * (max - min)) / step) * step;

    if (type === "min") {
      handleMinChange(Math.min(newValue, maxValue - step));
    } else {
      handleMaxChange(Math.max(newValue, minValue + step));
    }
  };

  const handleMouseOrTouchDown = (type: "min" | "max") => {
    const moveHandler = (event: MouseEvent | TouchEvent) =>
      handleMouseOrTouchMove(event, type);
    const upHandler = () => {
      removeEventListeners(moveHandler, upHandler);
    };

    addEventListeners(moveHandler, upHandler);
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
    <div className="range-slider-wrapper" ref={rangeRef}>
      <div className="range-labels">
        <input
          className="input"
          type="number"
          value={minValue}
          step={step}
          onChange={(e) => handleMinChange(parseFloat(e.target.value))}
        />
        <input
          className="input"
          type="number"
          value={maxValue}
          step={step}
          onChange={(e) => handleMaxChange(parseFloat(e.target.value))}
        />
      </div>

      <div className="range-track">
        <div
          className="range-highlight"
          style={{
            left: `${((minValue - min) / (max - min)) * 100}%`,
            right: `${100 - ((maxValue - min) / (max - min)) * 100}%`,
          }}
        />
        <div
          className="range-handle"
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={minValue}
          aria-label={`Minimum value: ${formatValue(minValue)}`}
          tabIndex={0}
          style={{
            left: `${((minValue - min) / (max - min)) * 100}%`,
          }}
          onMouseDown={() => handleMouseOrTouchDown("min")}
          onTouchStart={() => handleMouseOrTouchDown("min")}
          onKeyDown={(e) => handleKeyDown(e, "min")}
        />
        <div
          className="range-handle"
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={maxValue}
          aria-label={`Maximum value: ${formatValue(maxValue)}`}
          tabIndex={0}
          style={{
            left: `${((maxValue - min) / (max - min)) * 100}%`,
          }}
          onMouseDown={() => handleMouseOrTouchDown("max")}
          onTouchStart={() => handleMouseOrTouchDown("max")}
          onKeyDown={(e) => handleKeyDown(e, "max")}
        />
      </div>
    </div>
  );
};

export default RangeSlider;
