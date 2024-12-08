"use client";

import React, { useState, useEffect, useRef } from "react";

interface RangeSliderProps {
  min?: number;
  max?: number;
  step?: number;
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

  useEffect(() => {
    setMinValue(min);
    setMaxValue(max);
  }, [min, max]);

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

  const addEventListeners = (
    moveHandler: (event: MouseEvent | TouchEvent) => void,
    upHandler: () => void
  ) => {
    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("mouseup", upHandler);
    document.addEventListener("touchmove", moveHandler);
    document.addEventListener("touchend", upHandler);
  };

  const removeEventListeners = (
    moveHandler: (event: MouseEvent | TouchEvent) => void,
    upHandler: () => void
  ) => {
    document.removeEventListener("mousemove", moveHandler);
    document.removeEventListener("mouseup", upHandler);
    document.removeEventListener("touchmove", moveHandler);
    document.removeEventListener("touchend", upHandler);
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

  const colorSliderSelect = "#2C2D3F";
  const colorSliderUnselect = "#bebec4";
  const widthRangeHandle = "22px";

  return (
    <div className="range-slider" ref={rangeRef}>
      <div className="range-labels">
        <input
          type="number"
          className="range-label"
          value={minValue}
          step={step}
          onChange={(e) => handleMinChange(parseFloat(e.target.value))}
        />
        <input
          type="number"
          className="range-label"
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
          style={{ left: `${((minValue - min) / (max - min)) * 100}%` }}
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
      <style jsx>{`
        .range-slider {
          width: 88%;
          position: relative;
          height: 60px;
        }
        .range-labels {
          display: flex;
          justify-content: space-between;
          width: 100%;
          margin-bottom: 10px;
        }
        .range-label {
          width: 80px;
          font-size: 16px;
          font-weight: bold;
          color: #333;
          text-align: center;
        }
        .range-track {
          width: calc(100% + ${widthRangeHandle});
          height: 3px;
          position: relative;
          margin: 10px 0;
          background: ${colorSliderUnselect};
          border-radius: 4px;
        }
        .range-highlight {
          position: absolute;
          top: 0;
          bottom: 0;
          background: ${colorSliderSelect};
          border-radius: 4px;
        }
        .range-handle {
          position: absolute;
          top: -8px;
          width: ${widthRangeHandle};
          height: ${widthRangeHandle};
          background: ${colorSliderSelect};
          border-radius: 50%;
          cursor: grab;
          transition: transform 0.2s;
        }
        .range-handle:hover {
          transform: scale(1.2);
        }
        .range-handle:focus {
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
};

export default RangeSlider;
