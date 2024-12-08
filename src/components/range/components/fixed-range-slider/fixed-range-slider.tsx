"use client";

import React, { useState, useRef } from "react";

import { addEventListeners, removeEventListeners } from "../utils";
import "./fixed-range-slider.css";
interface FixedRangeSliderProps {
  values: number[];
}

const FixedRangeSlider: React.FC<FixedRangeSliderProps> = ({ values }) => {
  const [minIndex, setMinIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(values.length - 1);
  const rangeRef = useRef<HTMLDivElement>(null);

  const handleDrag = (event: MouseEvent | TouchEvent, type: "min" | "max") => {
    if (!rangeRef.current) return;

    const clientX =
      event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;

    const rect = rangeRef.current.getBoundingClientRect();
    const percent = (clientX - rect.left) / rect.width;
    const newIndex = Math.round(percent * (values.length - 1));

    if (type === "min") {
      if (newIndex >= maxIndex || newIndex < 0) return;
      setMinIndex(newIndex);
    } else {
      if (newIndex <= minIndex || newIndex >= values.length) return;
      setMaxIndex(newIndex);
    }
  };

  const handleMouseOrTouchDown = (type: "min" | "max") => {
    const moveHandler = (event: MouseEvent | TouchEvent) =>
      handleDrag(event, type);
    const upHandler = () => {
      removeEventListeners(moveHandler, upHandler);
    };

    addEventListeners(moveHandler, upHandler);
  };

  const handleMarkerClick = (index: number) => {
    const distanceToMin = Math.abs(index - minIndex);
    const distanceToMax = Math.abs(index - maxIndex);

    if (distanceToMin < distanceToMax) {
      if (index < maxIndex) {
        setMinIndex(index);
      }
    } else {
      if (index > minIndex) {
        setMaxIndex(index);
      }
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!rangeRef.current) return;

    const rect = rangeRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newIndex = Math.round(percent * (values.length - 1));

    const distanceToMin = Math.abs(newIndex - minIndex);
    const distanceToMax = Math.abs(newIndex - maxIndex);

    if (distanceToMin < distanceToMax) {
      if (newIndex < maxIndex) {
        setMinIndex(newIndex);
      }
    } else {
      if (newIndex > minIndex) {
        setMaxIndex(newIndex);
      }
    }
  };

  return (
    <div className="fixed-range-slider-wrapper">
      <div className="range-track" ref={rangeRef} onClick={handleClick}>
        <div
          className="range-highlight"
          style={{
            left: `${(minIndex / (values.length - 1)) * 100}%`,
            right: `${100 - (maxIndex / (values.length - 1)) * 100}%`,
          }}
        />
        <div className="markers-container" data-testid="markers-container">
          {values.map((value, index) => (
            <div
              key={index}
              className="range-marker"
              style={{
                left: `${(index / (values.length - 1)) * 100}%`,
              }}
              onClick={() => handleMarkerClick(index)}
            >
              <div
                className="marker-circle"
                style={{
                  background:
                    index >= minIndex && index <= maxIndex ? "#2c2d3f" : "#fff",
                  border:
                    index >= minIndex && index <= maxIndex
                      ? "2px solid #000"
                      : "2px solid #000",
                }}
              />
              <span>{value.toFixed(2)} €</span>
            </div>
          ))}
        </div>
        <div
          className="range-handle"
          data-testid="min-handle"
          style={{
            left: `${(minIndex / (values.length - 1)) * 100}%`,
          }}
          onMouseDown={() => handleMouseOrTouchDown("min")}
          onTouchStart={() => handleMouseOrTouchDown("min")}
        />
        <div
          className="range-handle"
          data-testid="max-handle"
          style={{
            left: `${(maxIndex / (values.length - 1)) * 100}%`,
          }}
          onMouseDown={() => handleMouseOrTouchDown("max")}
          onTouchStart={() => handleMouseOrTouchDown("max")}
        />
      </div>
      <div className="range-labels">
        <span>
          {values.length > 0
            ? `Min: ${values[minIndex].toFixed(2)} €`
            : "Min: -"}
        </span>
        <span>
          {values.length > 0
            ? `Max: ${values[maxIndex].toFixed(2)} €`
            : "Max: -"}
        </span>
      </div>
    </div>
  );
};

export default FixedRangeSlider;
